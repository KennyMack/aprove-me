import { cnpj, cpf } from 'cpf-cnpj-validator';
import { z } from 'zod';
import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export class BasicValidations {
  public static isValidDate(date: string|Date): boolean {
    let dtValue: string = date.toString();
    if (!(typeof date === 'string')) dtValue = format(date, 'yyyy-MM-dd HH:mm:ss');
    
    const parsedDate = parse(
      dtValue,
      'yyyy-MM-dd HH:mm:ss',
      new Date(2010, 0, 1),
      {
        locale: ptBR,
      },
    );

    return isValid(parsedDate) ?? false;
  }

  public static isValidEmail(email: string): boolean {
    const valid = z.string().email();
    return valid.safeParse(email).success;
  }

  public static isValidCNPJOrCPF(cpfCnpj: string): boolean {
    if (cpf.isValid(cpfCnpj)) return true;
    if (cnpj.isValid(cpfCnpj)) return true;
    return false;
  }
}
