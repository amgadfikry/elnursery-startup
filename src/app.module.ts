import { Module, OnModuleInit, NotFoundException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from './config/database.config';
import { AdminModule } from './admin/admin.module';
import { PasswordModule } from './password/password.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './common/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AdminService } from './admin/admin.service';
import { CommonModule } from './common/common.module';
import { CronJobsModule } from './cron-jobs/cron-jobs.module';
import { TransactionModule } from './transaction/transaction.module';
import { TaskModule } from './task/task.module';
@Module({ 
  // Import the MongooseModule and AdminModule into the AppModule
  imports: [
    MongooseModule.forRoot(databaseConfig.uri),
    CommonModule,
    TransactionModule,
    CronJobsModule,
    PasswordModule,
    AuthModule,
    AdminModule,
    UserModule,
    TaskModule
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },// Provide the AuthGuard as a global guard
  ],
})
export class AppModule implements OnModuleInit {
  private readonly email: string;
  private readonly name: string;

  // Inject the AdminService into the AppModule
  constructor(
    private readonly adminService: AdminService
  ) {
    this.email = process.env.ADMIN_EMAIL;
    this.name = process.env.ADMIN_NAME
  }

  // Create a new admin account when the module is initialized
  async onModuleInit() : Promise<void> {
    try {
      // find if admin account already exists
      const admin = await this.adminService.findOneByEmail(this.email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // create a new admin account
        await this.adminService.create({ email: this.email, name: this.name, roles: ["owner"], });
        console.log('Admin account created successfully');
      } else {
        console.error('Error while creating admin account', error);
      }
    }
  }
}
