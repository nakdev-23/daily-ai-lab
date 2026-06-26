// Metro config for the daily-ai-lab monorepo.
// Expo SDK 52+ (we're on 56) auto-detects npm/yarn workspaces and adds the
// monorepo root to watchFolders + resolves hoisted node_modules automatically,
// so no manual watchFolders/nodeModulesPaths are required here. This file exists
// as the explicit customization point if we ever need it.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
