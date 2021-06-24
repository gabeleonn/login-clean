import bcrypt from 'bcrypt';
import { IEncrypter } from '../../data/protocols/security/encrypter';

export class BcryptAdapter implements IEncrypter {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  async hash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.salt);
    return hashedPassword;
  }
}
