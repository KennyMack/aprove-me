import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function userSeed(client: PrismaClient) {
  console.log(bcrypt);
  await client.user.upsert({
    where: {
      login: 'aprovame',
    },
    update: {},
    create: {
      updateAt: new Date(),
      createdAt: new Date(),
      id: uuidv4(),
      login: 'aprovame',
      password: bcrypt.hashSync('aprovame', 8),
    },
  });
}
