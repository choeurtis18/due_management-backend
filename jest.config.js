export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.(js|jsx|mjs|cjs)$': 'babel-jest',
    },
    globals: {
      'NODE_ENV': 'test',
    },
};
  