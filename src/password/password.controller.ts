import { Controller, Post, Res, Req, Body, Param, Query } from '@nestjs/common';
import { PasswordService } from './password.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponses } from '../common/decorators/api-error-response.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Response } from 'express';
import { Public } from '../common/decorators/public-guard.decorator';
import { EmailResetPasswordDto } from './dto/email-reset-password.dto';
import { ChangePasswordTokenDto } from './dto/change-password-token.dto';

// This controller is responsible for handling password-related requests
// as change password and reset password.
@ApiTags('Password')
@Controller('password')
export class PasswordController {
  // Inject the PasswordService into the PasswordController
  constructor(private readonly passwordService: PasswordService) {}

  // POST /password/change - change password
  @Post('change')
  @ApiOperation({ summary: 'Change password of the admin or user logged in and then clear the token cookie (admin/user)' })
  @ApiResponse({ status: 200, description: 'Successful change password.' })
  @ApiErrorResponses([400, 401, 404, 500])
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Res() res: Response, @Req() req: any) {
    const { _id, type } = req.user;
    await this.passwordService.changePassword(changePasswordDto, _id, type);
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return res.status(200).send({ message: 'Password changed successfully' });
  }

  // POST /password/reset - reset password
  @Post('reset/:type')
  @Public()
  @ApiOperation({ summary: 'Reset password of the admin or user and send reset code to email (public)' })
  @ApiResponse({ status: 200, description: 'Successful reset password.' })
  @ApiErrorResponses([400, 401, 404, 500])
  async resetPassword(@Body() emailResetPasswordDto: EmailResetPasswordDto, @Param('type') type: string) : Promise<{ message: string }> {
    return await this.passwordService.resetPassword(emailResetPasswordDto.email, type);
  }

  // POST /password/reset/:type - reset password with token
  @Post('change/:type')
  @Public()
  @ApiOperation({ summary: 'Change password of the admin or user with token, email and new password (public)' })
  @ApiResponse({ status: 200, description: 'Successful reset password with token.' })
  @ApiErrorResponses([400, 401, 404, 500])
  async resetPasswordWithToken(
    @Body() changePasswordTokenDto: ChangePasswordTokenDto,
    @Param('type') type: string,
    @Query('email') email: string) : Promise<{ message: string }> {
      return await this.passwordService.changePasswordByToken(email, changePasswordTokenDto, type);
  }
}
