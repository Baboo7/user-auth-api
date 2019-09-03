import { Req } from "@tsed/common";
import { TestContext } from "@tsed/testing";
import { InternalServerError } from "ts-httpexceptions";

import { AuthMiddleware } from "../../../src/api/middlewares/AuthMiddleware";
import { TokenService } from "../../../src/api/services/TokenService";
import { IUserToken } from "../../../src/types";

describe("AuthMiddleware", () => {
  beforeEach(TestContext.create);
  afterEach(TestContext.reset);

  describe("use", () => {
    it("should authenticate user", async () => {
      expect.assertions(2);

      const mockVerify = jest.fn().mockImplementation((): string => "payload");
      const locals = [
        {
          provide: TokenService,
          use: {
            verify: mockVerify
          }
        }
      ];
      const authMiddleware: AuthMiddleware = await TestContext.invoke(
        AuthMiddleware,
        locals
      );

      const request = {
        ctx: {},
        get: (args: any): any => "Bearer token"
      } as Partial<Req>;
      const endpointInfo = {
        get: (): any => []
      };

      authMiddleware.use(request as any, endpointInfo as any);

      expect(mockVerify).toHaveBeenCalledWith("token");
      expect(request.ctx!.userToken).toBe("payload");
    });
  });

  describe("parseAuthorizationHeader", () => {
    it("should return token", async () => {
      expect.assertions(1);

      const locals = [{ provide: TokenService, use: {} }];
      const authMiddleware: AuthMiddleware = await TestContext.invoke(
        AuthMiddleware,
        locals
      );

      const request = {
        get: (args: any): any => "Bearer token"
      } as Partial<Req>;

      const token = authMiddleware.parseAuthorizationHeader(request as any);
      expect(token).toBe("token");
    });

    it("should throw if Authorization header incorrect", async () => {
      expect.assertions(4);

      const locals = [{ provide: TokenService, use: {} }];
      const authMiddleware: AuthMiddleware = await TestContext.invoke(
        AuthMiddleware,
        locals
      );

      // Authorization header missing
      let request = {
        get: (args: any): any => ""
      } as Partial<Req>;

      try {
        authMiddleware.parseAuthorizationHeader(request as any);
      } catch (e) {
        expect(() => {
          throw e;
        }).toThrow(InternalServerError);
      }

      // Authorization header with invalid shape
      request = {
        get: (args: any): any => "token"
      } as Partial<Req>;

      try {
        authMiddleware.parseAuthorizationHeader(request as any);
      } catch (e) {
        expect(() => {
          throw e;
        }).toThrow(InternalServerError);
      }

      // Authorization header with invalid shape
      request = {
        get: (args: any): any => "Bearer token somemore"
      } as Partial<Req>;

      try {
        authMiddleware.parseAuthorizationHeader(request as any);
      } catch (e) {
        expect(() => {
          throw e;
        }).toThrow(InternalServerError);
      }

      // Authorization header with invalid prefix
      request = {
        get: (args: any): any => "Carrier token"
      } as Partial<Req>;

      try {
        authMiddleware.parseAuthorizationHeader(request as any);
      } catch (e) {
        expect(() => {
          throw e;
        }).toThrow(InternalServerError);
      }
    });
  });

  describe("decodeToken", () => {
    it("should throw if token invalid", async () => {
      expect.assertions(1);

      const locals = [
        {
          provide: TokenService,
          use: {
            verify: jest.fn().mockImplementation(
              (): void => {
                throw new Error();
              }
            )
          }
        }
      ];
      const authMiddleware: AuthMiddleware = await TestContext.invoke(
        AuthMiddleware,
        locals
      );

      try {
        authMiddleware.decodeToken("wrong token");
      } catch (e) {
        expect(() => {
          throw e;
        }).toThrow(InternalServerError);
      }
    });
  });

  describe("hasPermission", () => {
    it("should check if user has permission", async () => {
      expect.assertions(3);

      const locals = [
        {
          provide: TokenService,
          use: {}
        }
      ];
      const authMiddleware: AuthMiddleware = await TestContext.invoke(
        AuthMiddleware,
        locals
      );

      let hasPermission = authMiddleware.hasPermission([], {
        admin: false
      } as IUserToken);
      expect(hasPermission).toBe(true);

      hasPermission = authMiddleware.hasPermission(["admin"], {
        admin: false
      } as IUserToken);
      expect(hasPermission).toBe(false);

      hasPermission = authMiddleware.hasPermission(["admin"], {
        admin: true
      } as IUserToken);
      expect(hasPermission).toBe(true);
    });
  });
});
