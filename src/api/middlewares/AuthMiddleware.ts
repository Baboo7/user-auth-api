import { EndpointInfo, IMiddleware, Middleware, Req } from "@tsed/common";
import { InternalServerError, Unauthorized } from "ts-httpexceptions";

import { IUserToken } from "../../types";
import { IRole } from "../decorators/AuthDecorator";
import { TokenService } from "../services/TokenService";

@Middleware()
export class AuthMiddleware implements IMiddleware {
  constructor(private tokenService: TokenService) {}

  public decodeToken(token: string): IUserToken {
    let payload: IUserToken;
    try {
      payload = this.tokenService.verify(token);
    } catch (e) {
      throw new InternalServerError("Internal Error");
    }

    return payload;
  }

  public hasPermission(roles: IRole[], token: IUserToken): boolean {
    const hasPermission =
      roles.length === 0 ||
      roles.some(
        (role: IRole): boolean => {
          if (role === "admin" && this.isUserAdmin(token)) {
            return true;
          }

          return false;
        }
      );

    return hasPermission;
  }

  public isUserAdmin(token: IUserToken): boolean {
    return token.admin;
  }

  public parseAuthorizationHeader(request: Req): string {
    const authorization = request.get("Authorization");
    if (!authorization) {
      throw new InternalServerError("Internal Error");
    }

    const splitAuth = authorization.split(" ");
    if (
      splitAuth.length < 2 ||
      splitAuth.length > 2 ||
      splitAuth[0] !== "Bearer"
    ) {
      throw new InternalServerError("Internal Error");
    }

    const token = splitAuth[1];

    return token;
  }

  public use(
    @Req() request: Req,
    @EndpointInfo() endpointInfo: EndpointInfo
  ): void {
    const token = this.parseAuthorizationHeader(request);
    const payload = this.decodeToken(token);

    const roles: IRole[] = endpointInfo.get(AuthMiddleware) || [];
    if (!this.hasPermission(roles, payload)) {
      throw new Unauthorized("Unauthorized");
    }

    request.ctx.userToken = payload;
  }
}
