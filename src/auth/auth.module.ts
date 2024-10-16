import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PasswordModule } from '../password/password.module';
import { AdminModule } from '../admin/admin.module';
import { UserModule } from '../user/user.module';

// get JWT_SECRET from .env file
const JWT_SECRET = process.env.JWT_SECRET;

@Module({
  // import admin data model and schema into the AuthModule and jwt module
  imports: [ PasswordModule, AdminModule, UserModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' }, // 1 day
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
