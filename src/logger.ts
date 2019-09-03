import { Logger } from "ts-log-debug";

import { Environment } from "./types";
import { LOG_LEVEL, NODE_ENV } from "./utils/config";

type LogFunction = (message: string, meta?: any) => void;

interface ILogger {
  debug: LogFunction;
  error: LogFunction;
  info: LogFunction;
  warn: LogFunction;
}

const logger = new Logger("app");

logger.level = LOG_LEVEL;

if (NODE_ENV === Environment.development || NODE_ENV === Environment.test) {
  logger.appenders.set("console-log", {
    layout: { type: "colored" },
    type: "console"
  });
} else {
  logger.appenders.set("file-log", {
    backups: 3,
    compress: true,
    filename: "logs/combined.log",
    layout: { type: "json", separator: "," },
    maxLogSize: 5242880,
    type: "file"
  });
}

export default logger;

const formatMessage = (prefix: string, message: string, meta: any): string =>
  `[${prefix}] ${message}${meta != null ? ":" : ""} `;

export const createLogger = (prefix: string): ILogger => ({
  debug(message: string, meta: any): void {
    logger.debug(
      formatMessage(prefix, message, meta),
      meta != null ? meta : ""
    );
  },
  error(message: string, meta: any): void {
    logger.error(
      formatMessage(prefix, message, meta),
      meta != null ? meta : ""
    );
  },
  info: (message: string, meta: any): void => {
    logger.info(formatMessage(prefix, message, meta), meta != null ? meta : "");
  },
  warn: (message: string, meta: any): void => {
    logger.warn(formatMessage(prefix, message, meta), meta != null ? meta : "");
  }
});
