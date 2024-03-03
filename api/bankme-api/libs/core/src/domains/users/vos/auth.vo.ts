export class AuthVO {
  constructor(
    readonly jwt: string,
    readonly success: boolean,
  ) {}
}
