import { z } from 'zod';
import { Fails } from 'bme/core/messages/fails';
import { BasicValidations } from 'bme/core/basic-validations';

export const createAssignorSchema = z.object({
  document: z
    .string()
    .max(30)
    .refine((x) => BasicValidations.isValidCNPJOrCPF(x), {
      message: Fails.INVALID_DOCUMENT,
    }),
  email: z.string().max(140).email(),
  phone: z.string().max(20),
  name: z.string().max(140),
});

export const changeAssignorSchema = z
  .object({
    id: z.string().uuid().optional(),
    document: z
      .string()
      .max(30)
      .refine((x) => BasicValidations.isValidCNPJOrCPF(x), {
        message: Fails.INVALID_DOCUMENT,
      }),
    email: z.string().max(140).email(),
    phone: z.string().max(20),
    name: z.string().max(140),
  })
  .required();
