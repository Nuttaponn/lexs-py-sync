module.exports = {
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@shared/(.*)': '<rootDir>/src/app/shared/$1',
    '@modules/(.*)': '<rootDir>/src/app/modules/$1',
    '@environments/(.*)': '<rootDir>/src/environments/$1',
    '@spig/core(.*)': '<rootDir>/projects/spig-core/src/public-api.ts',
    '@lexs/lexs-client(.*)': '<rootDir>/projects/lexs/lexs-client/src/index.ts',
    '@mocks/(.*)': '<rootDir>/src/mocks/$1',
  },
  testMatch: ['**/src/app/**/?(*.)+(spec|test).+(ts|tsx|js)'],
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testEnvironment: 'jsdom',
};
