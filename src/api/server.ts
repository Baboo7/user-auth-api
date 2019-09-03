import { ServerLoader, ServerSettings } from "@tsed/common";
import * as bodyParser from "body-parser";
import path = require("path");
import * as tsLog from "ts-log-debug";

import logger from "../logger";
import { PORT } from "../utils/config";

// Monkey patch to use same logger in the whole app
// tslint:disable-next-line: no-any
(tsLog as any).$log = logger;

const rootDir = path.resolve(__dirname);

@ServerSettings({
  acceptMimes: ["application/json"],
  componentsScan: [
    `${rootDir}/services/*.ts`,
    `${rootDir}/../database/repositories/*.ts`
  ],
  httpPort: PORT,
  mount: {
    "/api": `${rootDir}/controllers/*.ts`
  },
  rootDir,
  swagger: [
    {
      path: "/swagger"
    }
  ]
})
export class Server extends ServerLoader {
  public $onMountingMiddlewares(): void | Promise<void> {
    this.use(bodyParser.json()).use(
      bodyParser.urlencoded({
        extended: true
      })
    );
  }

  // tslint:disable-next-line: no-any
  public $onServerInitError(err: any): void {
    logger.error(err);
  }
}
