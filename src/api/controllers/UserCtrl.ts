import { BodyParams, Controller, Post, Required } from "@tsed/common";
import { Docs } from "@tsed/swagger";
import { Unauthorized } from "ts-httpexceptions";

import { UserRepository } from "../../database/repositories";
import { createLogger } from "../../logger";
import { IUser } from "../../types";
import { UserDto } from "../dtos/UserDto";
import { CryptoService } from "../services/CryptoService";
import { TokenService } from "../services/TokenService";

const logger = createLogger(__filename);

@Controller("/users")
@Docs()
export class UserCtrl {
  constructor(
    private cryptoService: CryptoService,
    private tokenService: TokenService,
    private userRepository: UserRepository
  ) {}

  @Post("/login")
  public async login(
    @Required() @BodyParams("", UserDto) userDto: UserDto
  ): Promise<string> {
    const user: IUser | null = await this.userRepository.findByEmail(
      userDto.email
    );

    // Prevent timing attacks by running the hash method
    const encryptedPassword = user !== null ? user.password : "";
    const isPasswordCorrect: boolean = await this.cryptoService.compare(
      userDto.password,
      encryptedPassword
    );

    if (user === null || !isPasswordCorrect) {
      logger.warn(`Failed login for user ${userDto.email}`);

      throw new Unauthorized("Wrong credentials");
    }

    return this.tokenService.generateUserToken(user);
  }
}
