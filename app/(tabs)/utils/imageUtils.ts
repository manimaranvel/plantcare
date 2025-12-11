// src/utils/imageUtils.native.ts
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

type Format = 'JPEG' | 'PNG' | 'WEBP';

const DEFAULTS = {
  width: 500,
  height: 500,
  quality: 80, // 0-100
  format: 'JPEG' as Format,
  rotate: 0, // degrees
  keepMeta: false,
};

const imageUtils = {
  /**
   * Compress and/or resize a single image using native code.
   *
   * @param imageUri - source uri (file:// or content:// or scheme depending on platform)
   * @param opts - options to control width/height/quality/format
   * @returns local file URI of the resized/compressed image (file://...)
   */
  compressImage: async (
    imageUri: string,
    opts?: Partial<{
      width: number;
      height: number;
      quality: number; // 0 - 100
      format: Format;
      rotate: number; // degrees
      outputPath?: string; // optional folder to write result (platform-dep)
    }>
  ): Promise<string> => {
    const options = { ...DEFAULTS, ...(opts || {}) };

    try {
      // react-native-image-resizer expects quality as percentage (0-100)
      const response = await ImageResizer.createResizedImage(
        imageUri,
        options.width,
        options.height,
        options.format,
        options.quality,
        options.rotate,
        options.outputPath ?? undefined,
        options.keepMeta
      );

      // response contains: uri, path, name, size
      // On Android: response.uri is often content:// or file://
      // On iOS: response.uri is a file path string (file:// not always)
      // Normalize to file:// URI for consistency:
      let resultUri = response.uri;
      if (resultUri && !resultUri.startsWith('file://')) {
        // If it's a plain path (iOS), prefix with file:// for consistency
        // but be careful on Android where content:// must be preserved.
        if (!resultUri.startsWith('content://')) {
          resultUri = `file://${resultUri}`;
        }
      }

      return resultUri;
    } catch (err) {
      console.error('compressImage error:', err);
      throw err;
    }
  },

  /**
   * Batch compress multiple images with concurrency control.
   * Returns an array of result URIs in the same order.
   */
  compressImagesBatch: async (
    uris: string[],
    opts?: Partial<{
      width: number;
      height: number;
      quality: number;
      format: Format;
      rotate: number;
      concurrency: number;
    }>
  ): Promise<string[]> => {
    const concurrency = opts?.concurrency ?? 3;
    const results: string[] = new Array(uris.length);
    let idx = 0;

    // simple worker pool
    const workers = new Array(Math.min(concurrency, uris.length)).fill(null).map(
      async () => {
        while (true) {
          const current = idx;
          if (current >= uris.length) break;
          idx += 1;
          try {
            const res = await imageUtils.compressImage(uris[current], opts);
            results[current] = res;
          } catch (e) {
            // store empty string or rethrow depending on how you want to handle failures
            results[current] = '';
            console.error(`compressImagesBatch failed for index ${current}`, e);
          }
        }
      }
    );

    await Promise.all(workers);
    return results;
  },

  /**
   * Optional helper: move resulting image into app cache directory (useful if outputPath unsupported)
   * Returns the new file URI.
   */
  moveToCache: async (fileUri: string, filename?: string): Promise<string> => {
    try {
      const name = filename ?? `img_${Date.now()}.jpg`;
      const destPath = `${RNFS.CachesDirectoryPath}/${name}`;
      // strip file:// if present for RNFS methods
      const fromPath = fileUri.replace(/^file:\/\//, '');

      await RNFS.copyFile(fromPath, destPath);
      return `file://${destPath}`;
    } catch (err) {
      console.error('moveToCache error:', err);
      throw err;
    }
  },
};

export default imageUtils;
