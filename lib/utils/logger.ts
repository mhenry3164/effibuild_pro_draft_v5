type ErrorLevel = "info" | "warn" | "error";

interface ErrorLog {
  level: ErrorLevel;
  message: string;
  error?: any;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

class Logger {
  static async log(level: ErrorLevel, message: string, error?: any, metadata?: Record<string, any>) {
    const log: ErrorLog = {
      level,
      message,
      error,
      metadata,
      timestamp: new Date()
    };

    if (process.env.NODE_ENV === "development") {
      console[level](log);
    }
  }

  static error(message: string, error?: any, metadata?: Record<string, any>) {
    return this.log("error", message, error, metadata);
  }

  static warn(message: string, metadata?: Record<string, any>) {
    return this.log("warn", message, undefined, metadata);
  }

  static info(message: string, metadata?: Record<string, any>) {
    return this.log("info", message, undefined, metadata);
  }
}

export default Logger;
