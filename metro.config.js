const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    blockList: [
      // 백엔드 폴더 제외
      /ai-recommendation-server\/.*/,
      // node_modules 내부의 특정 패키지 제외
      /node_modules\/.*\/node_modules\/.*/,
    ],
  },
  watchFolders: [__dirname],
};