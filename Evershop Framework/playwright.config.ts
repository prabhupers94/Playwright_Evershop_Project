/*
 * Playwright Test Configuration
 * This configuration file sets up Playwright for end-to-end testing.
 * It includes settings for retries, timeouts, reporters, and browser configurations.
 */

import { defineConfig, devices } from '@playwright/test';
import { appEnv } from './config/env.js';

export default defineConfig({
  testDir: './tests', // Directory where test files are located
  fullyParallel: true, //Enables tests to run in parallel across all available workers for faster execution
  workers: process.env.CI ? 4 : 2, // 1 worker locally for debugging & More workers in CI. Worker runs tests in parallel in a context.
  retries: process.env.CI ? 2 : 0, // 2 retries in CI for flaky tests, 0 locally for faster feedback
  forbidOnly: !!process.env.CI, // Fail if a test is marked as 'only' in CI
  timeout: 600_000, // 10 mins a test can run before timing out
  expect: { timeout: 60_000 }, // 1 min for assertions
  outputDir: 'reports/test-results',
  reporter: [
    ['html', { open: 'never', outputFolder: 'reports/html-report' }], // Generates an HTML report after tests run, does not open automatically
    ['junit', { outputFile: 'reports/junit/results.xml' }], // Generates a JUnit report for CI integration
    ['json', { outputFile: 'reports/results.json' }],
    ['allure-playwright', { resultsDir: 'reports/allure-results' }], // Generates Allure reports for detailed test results
    //['lcov', { outputFile: 'reports/coverage/lcov.info' }],
  ],
  use: {
    baseURL: appEnv.baseUrl, // Base URL for the application under test, loaded from environment configuration
    trace: 'on', // 'retain-on-failure' Retains traces for debugging only when tests fail
    video: 'on', // 'retain-on-failure' Records videos of test runs, retained only on failure
    screenshot: 'only-on-failure', // Takes screenshots only on test failure
    // Add navigation timeout for better debugging
    navigationTimeout: 60_000, // 1 min for page navigation
    actionTimeout: 15_000, // 15 sec for actions like click, fill
  },
  projects: [
    // This determines what type of page object is created
    { name: 'chromium', use: { ...devices['Chrome'] } },
    ...(process.env.CI
      ? [
          { name: 'firefox', use: { ...devices['Firefox'] } },
          { name: 'webkit', use: { ...devices['Safari'] } },
        ]
      : []),
  ],
  
});
