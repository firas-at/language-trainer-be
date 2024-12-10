export class AuthResponseDto {
  token: string;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}
