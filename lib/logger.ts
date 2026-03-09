/**
 * Structured Logger
 * Replaces console.log with structured logging for production
 */

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLog(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error ? `${error.message}\n${error.stack}` : undefined,
    };
  }

  private output(entry: LogEntry) {
    if (this.isDevelopment) {
      console.log(JSON.stringify(entry, null, 2));
    } else {
      console.log(JSON.stringify(entry));
    }
  }

  debug(message: string, context?: Record<string, any>) {
    const entry = this.formatLog(LogLevel.DEBUG, message, context);
    if (this.isDevelopment) {
      this.output(entry);
    }
  }

  info(message: string, context?: Record<string, any>) {
    const entry = this.formatLog(LogLevel.INFO, message, context);
    this.output(entry);
  }

  warn(message: string, context?: Record<string, any>) {
    const entry = this.formatLog(LogLevel.WARN, message, context);
    this.output(entry);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    const entry = this.formatLog(LogLevel.ERROR, message, context, error);
    this.output(entry);
  }

  apiCall(method: string, path: string, status: number, duration: number, context?: Record<string, any>) {
    this.info(`API ${method} ${path} - ${status}`, {
      api: true,
      method,
      path,
      status,
      duration: `${duration}ms`,
      ...context,
    });
  }

  databaseOperation(operation: string, collection: string, status: 'success' | 'error', context?: Record<string, any>) {
    const message = `Database ${operation} on ${collection}: ${status}`;
    this.info(message, {
      database: true,
      operation,
      collection,
      status,
      ...context,
    });
  }

  authentication(event: 'login' | 'logout' | 'signup' | 'failed', userId?: string, context?: Record<string, any>) {
    this.info(`Authentication: ${event}`, {
      auth: true,
      event,
      userId,
      ...context,
    });
  }
}

export const logger = new Logger();
