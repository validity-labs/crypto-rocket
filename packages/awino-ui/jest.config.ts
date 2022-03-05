import type { InitialOptionsTsJest } from 'ts-jest/dist/types';

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/testing/config/jest.setup.ts'],
  snapshotResolver: '<rootDir>/testing/config/jest.snapshot.ts',
  // seek files only in specified folder
  roots: ['<rootDir>/src/'], // `--listTests` to check list of triggered test files https://jestjs.io/docs/cli#--listtests
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  moduleNameMapper: {
    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': `<rootDir>/testing/__mocks__/fileMock.ts`,

    // Handle Module Path Aliases
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@/public/(.*)$': '<rootDir>/public/$1',
    '^@/mocks/(.*)$': '<rootDir>/testing/__mocks__/$1',
    '^@/fixtures/(.*)$': '<rootDir>/testing/__fixtures__/$1',
    '^@/testing/(.*)$': '<rootDir>/testing/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '.+\\.(css|styl|less|sass|scss)$': 'jest-css-modules-transform',
  },
  // testPathIgnorePatterns: [
  //   '<rootDir>/node_modules/',
  //   '<rootDir>/.next/',
  //   '<rootDir>/cypress/',
  //   '<rootDir>/__mocks__/',
  //   '<rootDir>/__fixtures__/',
  // ],
};

export default config;
