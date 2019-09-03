import { TestContext } from "@tsed/testing";
import { Unauthorized } from "ts-httpexceptions";

import { UserCtrl } from "../../../src/api/controllers/UserCtrl";
import { UserDto } from "../../../src/api/dtos/UserDto";
import { CryptoService } from "../../../src/api/services/CryptoService";
import { TokenService } from "../../../src/api/services/TokenService";
import { UserRepository } from "../../../src/database/repositories";
import { IUser } from "../../../src/types";

describe("UserCtrl", () => {
  beforeEach(TestContext.create);
  afterEach(TestContext.reset);

  describe("login", () => {
    beforeEach(TestContext.create);
    afterEach(TestContext.reset);

    it("should log in user", async () => {
      expect.assertions(2);

      const mockGenerateUserToken = jest
        .fn()
        .mockImplementation((): Promise<void> => Promise.resolve());
      const locals = [
        {
          provide: CryptoService,
          use: {
            compare: async (): Promise<boolean> => true
          }
        },
        {
          provide: TokenService,
          use: {
            generateUserToken: mockGenerateUserToken
          }
        },
        {
          provide: UserRepository,
          use: {
            findByEmail: async (): Promise<any> =>
              ({
                admin: false,
                email: "john@doe.com",
                password: "soleil123"
              } as IUser)
          }
        }
      ];
      const userCtrl: UserCtrl = await TestContext.invoke(UserCtrl, locals);

      const body: UserDto = {
        email: "john@doe.com",
        password: "soleil123"
      };

      await userCtrl.login(body as any);

      expect(mockGenerateUserToken).toHaveBeenCalledTimes(1);
      expect(mockGenerateUserToken).toHaveBeenCalledWith({
        admin: false,
        email: "john@doe.com",
        password: "soleil123"
      });
    });

    it("should throw if wrong credentials", async () => {
      expect.assertions(4);

      const mockCompare = jest
        .fn()
        .mockImplementation(
          async (password: string): Promise<boolean> => password === "soleil123"
        );
      const locals = [
        {
          provide: CryptoService,
          use: {
            compare: mockCompare
          }
        },
        { provide: TokenService, use: {} },
        {
          provide: UserRepository,
          use: {
            findByEmail: async (): Promise<null> => null
          }
        }
      ];
      const userCtrl: UserCtrl = await TestContext.invoke(UserCtrl, locals);

      let body: UserDto = {
        email: "wrong@email.com",
        password: "soleil123"
      };

      try {
        await userCtrl.login(body as any);
      } catch (e) {
        expect(() => {
          throw e;
        }).toThrow(Unauthorized);
      }
      expect(mockCompare).toHaveBeenCalledTimes(1);
      expect(mockCompare).toHaveBeenCalledWith("soleil123", "");

      body = {
        email: "john@doe.com",
        password: "wrong password"
      };

      try {
        await userCtrl.login(body as any);
      } catch (e) {
        expect(() => {
          throw e;
        }).toThrow(Unauthorized);
      }
    });
  });
});
