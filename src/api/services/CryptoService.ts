import { Service } from "@tsed/common";
import * as bcrypt from "bcrypt";

@Service()
export class CryptoService {
  public async compare(data: any, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }

  public async hash(data: any): Promise<string> {
    const salt: string = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(data, salt);

    return hash;
  }
}
