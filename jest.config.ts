/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "@jest/types";

const config: Config.InitialOptions = {

    // Automatically clear mock calls, instances and results before every test
    clearMocks: true,

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // An array of glob patterns indicating a set of files for which coverage information should be collected
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        'src/*.{js,jsx,ts,tsx}',
    ],

    // The directory where Jest should output its coverage files
    coverageDirectory: "tests/coverage",

    // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
    moduleNameMapper: {
        // Handle module aliases
        '^@/components/(.*)$': '<rootDir>/tests/components/$1',
    },

    // The root directory that Jest should scan for tests and modules within
    rootDir: './',

    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: [
        "<rootDir>/tests/setupTests.ts"
    ],

    // The test environment that will be used for testing
    testEnvironment: "jsdom",

    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: [
        "/node_modules/",
        "/.next/",
    ],

    // A map from regular expressions to paths to transformers
    transform: {
        // Use babel-jest to transpile tests with the next/babel preset
        // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },

    // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
    transformIgnorePatterns: [
        '/node_modules/',
        '^.+\\.module\\.(css|sass|scss)$',
    ],

}

export default config;
