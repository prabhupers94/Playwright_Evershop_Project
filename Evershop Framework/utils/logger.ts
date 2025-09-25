import pino from 'pino';
import fs from 'fs';
import path from 'path';

/**
 * Type alias for log levels supported by the logger.
 * This provides better type safety and maintainability across the codebase.
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Logger configuration interface.
 * Defines the structure for logger configuration options.
 * This interface is used to configure the logger's behavior, such as enabling/disabling console and file logging,
 * setting log levels, and specifying the log directory.
 */

export interface LoggerConfig {
  consoleLogging: boolean;
  fileLogging: boolean;
  logLevel: LogLevel;
  logDirectory: string;
  // Enhanced: Section-specific log levels
  sectionLevels?: {
    test?: LogLevel;
    page?: LogLevel;
    workflow?: LogLevel;
    component?: LogLevel;
  };
}

// Type for log data - can be object or primitive values
export type LogData =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | null
  | undefined
  | Error;

// Type for Pino transport targets
interface PinoTarget {
  target: string;
  level: string;
  options?: Record<string, unknown>;
}

// Default configuration
const defaultConfig: LoggerConfig = {
  consoleLogging: true, // Enabled by default
  fileLogging: false, // Disabled by default
  logLevel: 'info',
  logDirectory: './logs',
};

// Load configuration from environment or use defaults
function loadConfig(): LoggerConfig {
  // Parse section-specific levels from environment
  const sectionLevels = {
    test: process.env.LOG_LEVEL_TEST as LogLevel,
    page: process.env.LOG_LEVEL_PAGE as LogLevel,
    workflow: process.env.LOG_LEVEL_WORKFLOW as LogLevel,
    component: process.env.LOG_LEVEL_COMPONENT as LogLevel,
  };

  // Remove undefined values
  const filteredSectionLevels = Object.fromEntries(
    Object.entries(sectionLevels).filter(([, value]) => value),
  ) as LoggerConfig['sectionLevels'];

  return {
    consoleLogging: process.env.CONSOLE_LOGGING !== 'false',
    fileLogging: process.env.FILE_LOGGING === 'true',
    logLevel: (process.env.LOG_LEVEL as LogLevel) ?? defaultConfig.logLevel,
    logDirectory: process.env.LOG_DIRECTORY ?? defaultConfig.logDirectory,
    sectionLevels:
      Object.keys(filteredSectionLevels || {}).length > 0 ? filteredSectionLevels : undefined,
  };
}

// Create logger instance
function createLogger(): pino.Logger {
  const config = loadConfig();

  // Ensure log directory exists if file logging is enabled
  if (config.fileLogging) {
    if (!fs.existsSync(config.logDirectory)) {
      fs.mkdirSync(config.logDirectory, { recursive: true });
    }
  }

  const targets: PinoTarget[] = [];

  // Console logging target
  if (config.consoleLogging) {
    targets.push({
      target: 'pino-pretty',
      level: config.logLevel,
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      },
    });
  }

  // File logging target
  if (config.fileLogging) {
    const logFileName = `paf-test-exec-${new Date().toISOString().split('T')[0]}.log`;
    const logFilePath = path.join(config.logDirectory, logFileName);

    targets.push({
      target: 'pino/file',
      level: config.logLevel,
      options: {
        destination: logFilePath,
      },
    });
  }

  // If no targets are enabled, add a minimal console target
  if (targets.length === 0) {
    targets.push({
      target: 'pino-pretty',
      level: 'error',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      },
    });
  }

  return pino({
    level: config.logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
      targets,
    },
  });
}

// Export singleton logger instance
export const logger = createLogger();

// Export utility functions for different log levels with proper typing
export const log = {
  trace: (message: string, data?: LogData): void => logger.trace(data, message),
  debug: (message: string, data?: LogData): void => logger.debug(data, message),
  info: (message: string, data?: LogData): void => logger.info(data, message),
  warn: (message: string, data?: LogData): void => logger.warn(data, message),
  error: (message: string, data?: LogData): void => logger.error(data, message),
  fatal: (message: string, data?: LogData): void => logger.fatal(data, message),
};

/**
 * Creates a logger for a specific test case and includes the test case name in its context.
 * It allows for better organization and filtering of logs related to specific tests.
 * @param testName - Name of the specific test case for which the logger is created
 * @returns A logger instance for the specified test case.
 */
export function createTestLogger(testName: string): pino.Logger {
  const config = loadConfig();
  const childLogger = logger.child({ layer: 'test', test: testName });

  // Apply section-specific log level if configured
  if (config.sectionLevels?.test) {
    childLogger.level = config.sectionLevels.test;
  }

  return childLogger;
}

/**
 * Creates a logger for a specific page and includes the page name in its context.
 * It allows for better organization and filtering of logs related to specific pages.
 * @param pageName - Name of the page for which the logger is created
 * @returns A logger instance for the specified page.
 */
export function createPageLogger(pageName: string): pino.Logger {
  const config = loadConfig();
  const childLogger = logger.child({ layer: 'page-object', page: pageName });

  // Apply section-specific log level if configured
  if (config.sectionLevels?.page) {
    childLogger.level = config.sectionLevels.page;
  }

  return childLogger;
}

/**
 * Creates a logger for a specific workflow and includes the workflow name in its context.
 * It allows for better organization and filtering of logs related to specific workflows.
 * @param workflowName - Name of the workflow for which the logger is created
 * @returns A logger instance for the specified workflow.
 */
export function createWorkflowLogger(workflowName: string): pino.Logger {
  const config = loadConfig();
  const childLogger = logger.child({ layer: 'workflow', workflow: workflowName });

  // Apply section-specific log level if configured
  if (config.sectionLevels?.workflow) {
    childLogger.level = config.sectionLevels.workflow;
  }

  return childLogger;
}

/**
 * Creates a logger for a specific component and includes the component name in its context.
 * It allows for better organization and filtering of logs related to specific UI components.
 * @param componentName - Name of the component for which the logger is created
 * @returns A logger instance for the specified component.
 */
export function createComponentLogger(componentName: string): pino.Logger {
  const config = loadConfig();
  const childLogger = logger.child({ layer: 'component', component: componentName });

  // Apply section-specific log level if configured
  if (config.sectionLevels?.component) {
    childLogger.level = config.sectionLevels.component;
  }

  return childLogger;
}

// Helper function to enable file logging programmatically
export function enableFileLogging(): void {
  process.env.FILE_LOGGING = 'true';
  // Note: Logger needs to be recreated for this to take effect
  log.info('File logging enabled. Restart application or tests to take effect.');
}

// Helper function to disable file logging programmatically
export function disableFileLogging(): void {
  process.env.FILE_LOGGING = 'false';
  log.info('File logging disabled. Restart application or tests to take effect.');
}
