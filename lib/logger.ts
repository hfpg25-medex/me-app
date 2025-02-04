import winston from "winston";
import "winston-daily-rotate-file";

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

// Tell winston about our colors
winston.addColors(colors);

// Define the format for our logs
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Create file transports for different log levels
const fileTransport = new winston.transports.DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
  format: winston.format.combine(
    winston.format.uncolorize(),
    winston.format.json()
  ),
});

const errorFileTransport = new winston.transports.DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
  level: "error",
  format: winston.format.combine(
    winston.format.uncolorize(),
    winston.format.json()
  ),
});

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels,
  format,
  transports: [
    fileTransport,
    errorFileTransport,
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Create a stream object for Morgan HTTP logging
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

type LogContext = {
  userId?: string;
  action?: string;
  component?: string;
  [key: string]: unknown;
};

// Helper functions for structured logging
export function logInfo(message: string, context?: LogContext) {
  logger.info({ message, ...context });
}

export function logError(error: Error | unknown, context?: LogContext) {
  if (error instanceof Error) {
    logger.error({
      message: error.message,
      stack: error.stack,
      ...context,
    });
  } else {
    logger.error({
      message: "Unknown error occurred",
      error,
      ...context,
    });
  }
}

export function logWarning(message: string, context?: LogContext) {
  logger.warn({ message, ...context });
}

export function logDebug(message: string, context?: LogContext) {
  logger.debug({ message, ...context });
}

export default logger;
