import { Module, forwardRef } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { AdminModule } from '../admin/admin.module';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    forwardRef(() => AdminModule),
    forwardRef(() => UserModule),
    CommonModule,
  ],
  controllers: [PasswordController],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
