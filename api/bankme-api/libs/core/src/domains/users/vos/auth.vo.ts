export class AuthVO {
  constructor(
    readonly id: string,
    readonly login: string,
    readonly success: boolean,
  ) {}
}
