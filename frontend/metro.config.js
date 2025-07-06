const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for resolving modules that might not be properly exported
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_conditionNames = ['react-native', 'browser', 'require'];

// Handle noble-hashes module resolution
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: 'expo-crypto',
};

// Enable support for import.meta and other modern JS features
config.transformer.unstable_allowRequireContext = true;

module.exports = config; 