import bcrypt from 'bcrypt';

export class BcryptAdapter {

  static hash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  static compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

}