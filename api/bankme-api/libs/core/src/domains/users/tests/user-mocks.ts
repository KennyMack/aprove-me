import { Sequence } from 'bme/core/sequence';
import { User } from '../entities/users.entity';
import { UserVO } from '../vos/user.vo';
import { faker } from '@faker-js/faker';

export class UserMocks {
  public static getAll(): User[] {
    return new Array(5).fill(undefined).map(this.getUser);
  }

  public static getUser(): User {
    const user = new User();
    user.id = Sequence.getNext();
    user.login = `${faker.string.alphanumeric(3)}_${faker.internet.email()}`;
    user.password = faker.internet.password();
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
