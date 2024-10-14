import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { CronJobsService } from "./cron-jobs.service";
import { UserModule } from "src/user/user.module";

// Module for the cron jobs service
@Module({
  imports: [
    ScheduleModule.forRoot(),
    UserModule
  ],
  providers: [CronJobsService],
})
export class CronJobsModule {}
