import { Service } from "@tsed/di";
import { find } from "lodash";

import { IUser } from "../../types";

const USERS: IUser[] = [
  {
    admin: false,
    email: "user@example.com",
    password: "soleil123"
  },
  {
    admin: true,
    email: "admin@example.com",
    password: "admin"
  }
];

@Service()
export class UserRepository {
  public async findByEmail(email: string): Promise<IUser | null> {
    const user = find(USERS, (u: IUser) => u.email === email);

    return user ? user : null;
  }
}
