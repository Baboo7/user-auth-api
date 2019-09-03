import * as dotenv from "dotenv";

import { Environment } from "../types";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV as Environment;

const initEnvironmentVariable = (
  variable: string | undefined,
  label: string
): string => {
  if (NODE_ENV) {
    if (!variable) {
      throw new Error(`Environment variable ${label} is undefined.`);
    }

    return variable;
  }

  return "";
};

export const LOG_LEVEL = initEnvironmentVariable(
  process.env.LOG_LEVEL,
  "LOG_LEVEL"
);

export const PORT = initEnvironmentVariable(process.env.PORT, "PORT");

export const SECRET_KEY = initEnvironmentVariable(
  process.env.SECRET_KEY,
  "SECRET_KEY"
);

export const SECRET_KEY_TOKEN = initEnvironmentVariable(
  process.env.SECRET_KEY_TOKEN,
  "SECRET_KEY_TOKEN"
);
