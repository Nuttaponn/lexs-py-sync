const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
  },
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/projects/spig-core/setup-jest.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/projects/spig-core/tsconfig.spec.json",
    },
  },
};
