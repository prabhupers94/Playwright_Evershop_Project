import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { log } from '../utils/logger.js';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Configuration management system that handles environment-specific settings for the Playwright test automation project.
 * This file loads environment configurations for Playwright tests.
 * It reads environment-specific settings from JSON files and allows for local overrides using .env files.
 * The environment can be specified via the APP_ENV variable, defaulting to 'dev'.
 * It also allows overriding default user credentials via environment variables APP_USER and APP_PW.
 * The loaded configuration is used to set up the Playwright test environment.
 * Example usage:
 *   $env:APP_ENV="dev"; npm run test     # Uses appEnv.dev.json
 *   $env:APP_ENV="qa"; npm run test      # Uses appEnv.qa.json
 *   $env:APP_ENV="stage"; npm run test   # Uses appEnv.stage.json
 */

/**
 * Represents the environment configuration for Playwright tests.
 * Contains properties for the environment name, base URL, default user credentials, and optional API base URL.
 */
export interface AppEnv {
  name: string;
  baseUrl: string;
  defaultUser: { username?: string; email: string; password: string };
  apiBaseUrl?: string;
}

// Set to false to disable caching and always read from the file
const enableConfigCache = true;

// Cache environment data to avoid repeated file reads
let cachedEnv: AppEnv | null = null;

/**
 * Gets the environment configuration for Playwright tests.
 * If caching is disabled, it will always read the configuration from the file.
 * @returns The environment configuration for Playwright tests.
 */
function getEnv(): AppEnv {
  // TODO: Make the function thread-safe across multiple playwright worker threads.
  if (!enableConfigCache) {
    // Always read fresh if caching disabled - don't cache the result
    return loadEnv();
  }

  // Caching is enabled, use cached version if available
  // Load if not available
  cachedEnv ??= loadEnv();
  return cachedEnv;
}

/**
 * Loads the environment configuration for the Playwright tests.
 * @returns The loaded environment configuration.
 */
function loadEnv(): AppEnv {
  // Determine environment name from APP_ENV variable or default to 'dev'
  const envName = process.env.APP_ENV ?? 'qa';

  // Constructs file path for environment-specific JSON files appEnv.dev.json (or) appEnv.qa.json (or) appEnv.stage.json
  const envPath = path.join(__dirname, `appEnv.${envName}.json`);
  if (!fs.existsSync(envPath)) {
    throw new Error(`Unknown environment '${envName}' (expected dev|qa|stage)`);
  }

  // Read the environment configuration from the JSON file
  const cfg: AppEnv = JSON.parse(fs.readFileSync(envPath, 'utf-8'));

  // Load local environment that can override default settings
  // This allows for local development overrides without changing the main config files
  const localEnv = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(localEnv)) {
    // dotenv is a Node.js library that loads environment variables from a .env file into process.env.
    // It bridges the gap between file-based configuration and environment variables
    log.info(`Loading local environment from ${localEnv}`);
    // Loads the .env.local file first, allowing for local overrides
    // If the file exists, it loads it with override set to false, so it doesn't overwrite existing process.env variables.
    dotenv.config({ path: localEnv, override: false });
  } else {
    // If the file does not exist, it falls back to loading the default .env file
    // This allows for flexible configuration management in different environments
    dotenv.config();
  }

  // env.local takes precedence and overrides credentials if provided
  if (process.env.APP_URL) {
    cfg.baseUrl = process.env.APP_URL;
  }
  if (process.env.APP_EMAIL && process.env.APP_PW) {
    // User credentials available in environment variables is set to the defaultUser property for testing framework to use.
    // This allows for secure handling of sensitive information without hardcoding it in the source code
    cfg.defaultUser = {
      email: process.env.APP_EMAIL,
      //base64 decoding of password
      password: Buffer.from(process.env.APP_PW, 'base64').toString('utf-8'),
    };
  }
  log.info(`Environment: ${cfg.name}`);
  log.info(`Base URL: ${cfg.baseUrl}`);
  if (cfg.apiBaseUrl) {
    log.info(`API Base URL: ${cfg.apiBaseUrl}`);
  }
  return cfg;
}

// Export the environment instance
export const appEnv = getEnv();
