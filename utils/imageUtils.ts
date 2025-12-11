// import ImageResizer from 'react-native-image-resizer';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';

type Format = 'JPEG' | 'PNG' | 'WEBP';

const DEFAULTS = {
  width: 800,
  height: 800,
  quality: 70,
  format: 'JPEG' as Format,
  rotate: 0,
};

const THUMBNAIL_DEFAULTS = {
  width: 200,
  height: 200,
  quality: 70,
  format: 'JPEG' as Format,
  rotate: 0,
};

export const compressImage = async (
  imageUri: string,
  opts?: Partial<{
    width: number;
    height: number;
    quality: number;
    format: Format;
    rotate: number;
  }>
): Promise<string> => {
  const options = { ...DEFAULTS, ...(opts || {}) };

  try {
    const response = await ImageResizer.createResizedImage(
      imageUri,
      options.width,
      options.height,
      options.format,
      options.quality,
      options.rotate
    );

    let resultUri = response.uri;
    if (resultUri && !resultUri.startsWith('file://') && !resultUri.startsWith('content://')) {
      resultUri = `file://${resultUri}`;
    }

    return resultUri;
  } catch (err) {
    console.error('compressImage error:', err);
    throw err;
  }
};

export const generateThumbnail = async (
  imageUri: string,
  opts?: Partial<{
    width: number;
    height: number;
    quality: number;
  }>
): Promise<string> => {
  const options = { ...THUMBNAIL_DEFAULTS, ...(opts || {}) };

  try {
    const response = await ImageResizer.createResizedImage(
      imageUri,
      options.width,
      options.height,
      options.format,
      options.quality,
      options.rotate
    );

    let resultUri = response.uri;
    if (resultUri && !resultUri.startsWith('file://') && !resultUri.startsWith('content://')) {
      resultUri = `file://${resultUri}`;
    }

    return resultUri;
  } catch (err) {
    console.error('generateThumbnail error:', err);
    throw err;
  }
};

export const moveToCache = async (fileUri: string, filename?: string): Promise<string> => {
  try {
    const name = filename ?? `img_${Date.now()}.jpg`;
    const destPath = `${RNFS.CachesDirectoryPath}/${name}`;
    const fromPath = fileUri.replace(/^file:\/\//, '');

    await RNFS.copyFile(fromPath, destPath);
    return `file://${destPath}`;
  } catch (err) {
    console.error('moveToCache error:', err);
    throw err;
  }
};

export default {
  compressImage,
  generateThumbnail,
  moveToCache,
};
