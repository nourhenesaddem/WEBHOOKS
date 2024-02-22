export class CreateUserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly password: string;
  readonly email: string;
  readonly organizationId: number;
}
