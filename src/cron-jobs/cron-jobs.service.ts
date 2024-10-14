import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UserService } from "src/user/user.service";

// Service for the cron jobs module
@Injectable()
export class CronJobsService {
  // Inject the UserService into the service
  constructor(private readonly userService: UserService) {}

  // Cron job to run every every day at 12:00 AM of user time zone
  // to check for users who activation has expired and deactivate them
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  /* deactivateExpiredUsers cron job function that runs every day at 12:00 AM
      to deactivate users who activation has expired
  */
  async deactivateExpiredUsers() {
    console.log('Running cron job to deactivate expired users');
    // Create a new date object and set it to 3 months ago
    const dateAgo = new Date();
    dateAgo.setMonth(dateAgo.getMonth() - 3);
    const result = await this.userService.deactivateExpiredUsers(dateAgo);
    console.log(result);
  }
}
