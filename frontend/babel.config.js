module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          unstable_transformImportMeta: true,
        },
      ],
    ],
    plugins: [
      // Required for expo-router
      'expo-router/babel',
      // Required for react-native-reanimated
      'react-native-reanimated/plugin',
    ],
  };
}; 