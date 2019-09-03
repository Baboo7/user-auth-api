import { Service } from "@tsed/di";
import { find } from "lodash";

import { IUser } from "../../types";

// Mock table of users
const USERS: IUser[] = [
  {
    admin: false,
    email: "user@example.com",
    password: "$2b$10$B0VaGQAPeGA/B29sTAg53eDG.eqIHveUthPN6HFFxqiBCwMeSD2vS" // password: soleil123
  },
  {
    admin: true,
    email: "admin@example.com",
    password: "$2b$10$qcDSijJ3L5PR8c9iu64Bqe9LtF2ryFk0mNXEp3.l0Qzxns2SCke/." // password: admin
  }
];

@Service()
export class UserRepository {
  public async findByEmail(email: string): Promise<IUser | null> {
    const user = find(USERS, (u: IUser) => u.email === email);

    return user ? user : null;
  }
}
