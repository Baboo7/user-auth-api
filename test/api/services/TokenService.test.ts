import { inject, TestContext } from "@tsed/testing";
import * as jwt from "jsonwebtoken";

import {
  TokenErrors,
  TokenService
} from "../../../src/api/services/TokenService";

describe("TokenService", () => {
  beforeEach(TestContext.create);
  afterEach(TestContext.reset);

  it("should verify token", inject(
    [TokenService],
    (tokenService: TokenService) => {
      expect.assertions(1);

      jest
        .spyOn(jwt, "verify")
        .mockImplementation(
          (): any => ({ usn: "user@name.com", exp: 999999999999 })
        );

      const payload = tokenService.verify("token");

      expect(payload).toEqual({ usn: "user@name.com", exp: 999999999999 });
    }
  ));

  it("should throw if token expired", inject(
    [TokenService],
    (tokenService: TokenService) => {
      expect.assertions(1);

      jest
        .spyOn(jwt, "verify")
        .mockImplementation((): any => ({ usn: "user@name.com", exp: 1 }));

      try {
        tokenService.verify("token");
      } catch (e) {
        expect(e.message).toBe(TokenErrors.TOKEN_EXPIRED);
      }
    }
  ));
});
