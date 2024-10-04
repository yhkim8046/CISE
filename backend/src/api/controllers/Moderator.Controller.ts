import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ModeratorService } from '../services/ModeratorService';
import { RegisterDto } from '../dto/Register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly moderatorService: ModeratorService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.moderatorService.register(registerDto);
      return { message: 'Registration successful', user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.moderatorService.login(body.email, body.password);
      return { message: 'Login successful', user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
