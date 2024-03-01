import * as bcrypt from 'bcryptjs';

export class MordorCripto {
  public static Encrypt(text: string) {
    return bcrypt.hashSync(text, 8);
  }
  public static Compare(text: string, hash: string) {
    return bcrypt.compareSync(text, hash);
  }
}
