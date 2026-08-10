module.exports = {
  preset: '@react-native/jest-preset',
  // helper files under __tests__ are imports, not test suites
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/helpers/'],
};
