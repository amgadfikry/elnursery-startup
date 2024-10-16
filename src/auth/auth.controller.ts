import { Body, Controller, Post, Res, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponses } from '../common/decorators/api-error-response.decorator';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Public } from '../common/decorators/public-guard.decorator';

/* AuthController class that contains routes for authentication
    Routes:
      - POST /auth/login/:type - login and set token in cookie
*/
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  // Define cookies object configuration
  private readonly cookieConfig: object;
  // Inject the AuthService to the AuthController
  constructor(private readonly authService: AuthService) {
    // Set the cookie configuration
    this.cookieConfig = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // set secure to true in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // set sameSite to none in production
    };
  }

  // POST /auth/login/:type - login and set token in cookie
  @Public() // Set the route as public
  @Post('login/:type')
  @ApiOperation({ summary: 'Login and set token in cookie' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiErrorResponses([400, 401, 404, 500])
  async login(@Body() loginDto: LoginDto, @Param('type') type: 'admin' | 'user', @Res() res: Response) {
    const token = await this.authService.login(loginDto, type);
    res.cookie('token', token, this.cookieConfig);
    return res.status(200).send({ message: 'Login successful' });
  }

  // POST /auth/logout - logout and clear token in cookie
  @Post('logout')
  @ApiOperation({ summary: 'Logout and clear token in cookie' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiErrorResponses([400, 401, 404, 500])
  async logout(@Res() res: Response) {
    res.clearCookie('token', this.cookieConfig);
    return res.status(200).send({ message: 'Logout successful' });
  }
}
