import { Injectable } from "@nestjs/common";
import * as mailgun from 'mailgun-js';

// EmailService class that contains email sending logic
@Injectable()
export class EmailService {
  // Initialize Mailgun client
  private mg: mailgun.Mailgun;
  private sender: string;

  constructor() {
    // Initialize sender email address
    this.sender = 'Elnursey Platform';
    // Initialize Mailgun client with API key and domain
    this.mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });
  }

  /* Send account confirmation email
      Parameters:
      - name: name of the user
      - email: email of the user
      - password: password of the user
      Returns: 
        - Mailgun response
      Errors:
        - Failed to send confirmation email
  */
  async sendAccountCredentials(name: string, email: string, password: string): Promise<mailgun.messages.SendResponse> {
    const data = {
      from: this.sender,
      to: email,
      subject: 'Account Credentials',
      template: "account_credentials",
      'h:X-Mailgun-Variables': JSON.stringify({ name, email, password }),
    };
    return await this.sendEmail(data);
  }

  /* Send password reset email
      Parameters:
      - name: name of the user
      - email: email of the user
      - code: password reset token
      Returns:
        - Mailgun response
      Errors:
        - Failed to send password reset email
  */
  async sendPasswordResetEmail(name: string, email: string, code: number): Promise<mailgun.messages.SendResponse> {
    const data = {
      from: this.sender,
      to: email,
      subject: 'Password Reset',
      template: "reset_password",
      'h:X-Mailgun-Variables': JSON.stringify({ name, code }),
    };
    return await this.sendEmail(data);
  }

  /* sendEmail function to send email using Mailgun
      Parameters:
        - data: email data to send email
      Returns:
        - Mailgun response
      Errors:
        - Failed to send email
  */
  private async sendEmail(data: mailgun.messages.SendData): Promise<mailgun.messages.SendResponse> {
    try {
      const response = await this.mg.messages().send(data);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to send email');
    }
  }
}