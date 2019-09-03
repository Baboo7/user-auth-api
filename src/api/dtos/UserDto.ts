import { Email, Required } from "@tsed/common";

export class UserDto {
  @Email()
  @Required()
  public email!: string;

  @Required()
  public password!: string;
}
