import { Service } from "@tsed/common";
import * as jwt from "jsonwebtoken";

import { createLogger } from "../../logger";
import { IUser } from "../../types";
import { IUserToken, IUserTokenUserInfo } from "../../types";
import { SECRET_KEY_TOKEN } from "../../utils/config";

const logger = createLogger(__filename);

export enum TokenErrors {
  TOKEN_EXPIRED = "TOKEN_EXPIRED"
}

const ISSUER = "user-auth-api";

@Service()
export class TokenService {
  public generateUserToken(user: IUser): string {
    const userInfo: IUserTokenUserInfo = {
      admin: user.admin,
      email: user.email
    };

    return this.sign(userInfo);
  }

  public getUserInfo({ admin, email }: IUserToken): IUserTokenUserInfo {
    return { admin, email };
  }

  public sign(userInfo: IUserTokenUserInfo): string {
    return jwt.sign(userInfo, SECRET_KEY_TOKEN, {
      algorithm: "HS256",
      expiresIn: "2d",
      issuer: ISSUER
    });
  }

  public verify(token: string): IUserToken {
    try {
      const payload: IUserToken = jwt.verify(token, SECRET_KEY_TOKEN, {
        issuer: ISSUER
      }) as IUserToken;

      const now = Date.now() / 1000;
      if (payload.exp <= now) {
        throw new Error(TokenErrors.TOKEN_EXPIRED);
      }

      return payload;
    } catch (e) {
      logger.warn("Error while verifying token", e);
      throw e;
    }
  }
}
