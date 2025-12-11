// // metro.config.js
// const { getDefaultConfig } = require('metro-config');

// const config = getDefaultConfig(__dirname);

// config.resolver.sourceExts = ['ts', 'tsx', 'js', 'jsx', 'json'];

// module.exports = config;


// metro.config.js
const { getDefaultConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    // add any extra extensions you need here:
    sourceExts: [...(defaultConfig.resolver.sourceExts || []), 'cjs','ts', 'tsx', 'js', 'jsx', 'json'],
  },
};