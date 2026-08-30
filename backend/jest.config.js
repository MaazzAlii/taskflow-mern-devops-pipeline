module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  detectOpenHandles: true,
  forceExit: true,
  testTimeout: 30000,
};
