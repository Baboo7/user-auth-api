export interface IUserTokenUserInfo {
  admin: boolean;
  email: string;
}

export interface IUserToken extends IUserTokenUserInfo {
  exp: number;
  iat: number;
  iss: string;
}
