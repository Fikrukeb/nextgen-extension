import { Injectable } from '@nestjs/common';
import { AuthService } from '@mguay/nestjs-better-auth';

export interface UserDto {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly auth: AuthService) {}

  async createUser(data: UserDto) {
    // Check if your Auth provider supports this
    const user = await this.auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    return user;
  }
}
