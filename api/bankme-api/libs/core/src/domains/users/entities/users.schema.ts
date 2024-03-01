import { z } from 'zod';

export const createUserSchema = z
  .object({
    login: z.string().max(120),
    password: z.string(),
  })
  .required();

export const authUserSchema = z
  .object({
    login: z.string().max(120),
    password: z.string(),
  })
  .required();
