import { UseBefore } from "@tsed/common";
import { applyDecorators, StoreSet } from "@tsed/core";

import { AuthMiddleware } from "../middlewares/AuthMiddleware";

export type IRole = "admin";

export const AuthDecorator = (roles: IRole[]): Function =>
  applyDecorators(StoreSet(AuthMiddleware, roles), UseBefore(AuthMiddleware));
