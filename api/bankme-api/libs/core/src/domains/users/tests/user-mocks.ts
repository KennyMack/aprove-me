import { Sequence } from 'bme/core/sequence';
import { User } from '../entities/users.entity';
import { UserVO } from '../vos/user.vo';

export class UserMocks {
  public static getAll(): User[] {
    return [];
  }

  public static getUser(): User {
    const user = new User();
    user.id = Sequence.getNext();
    user.login = 'login@liame.com';
    user.password = '123456';
    user.createdAt = new Date();
    user.updateAt = new Date();

    return user;
  }

  public static convertUserToVO(user: User): UserVO {
    return new UserVO(
      user.id,
      user.login,
      user.password,
      user.createdAt,
      user.updateAt,
    );
  }
}
