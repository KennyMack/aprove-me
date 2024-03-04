import * as bcrypt from 'bcryptjs';

export class MordorCripto {
  public static Encrypt(text: string): string {
    return bcrypt.hashSync(text, 8);
  }
  public static Compare(text: string, hash: string): boolean {
    return bcrypt.compareSync(text, hash);
  }
}
