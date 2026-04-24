import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  DailyReminderPayload,
  NotificationChannel,
} from './interfaces/notification-channel.interface';

@Injectable()
export class EmailService implements NotificationChannel {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendDailyReminder(
    to: string,
    payload: DailyReminderPayload,
  ): Promise<void> {
    const { userName, totalCards, subjectSummary } = payload;

    const tableRows = subjectSummary
      .map(
        (s) =>
          `<tr><td style="padding:8px;border:1px solid #ddd">${s.subjectName}</td><td style="padding:8px;border:1px solid #ddd;text-align:center">${s.count}</td></tr>`,
      )
      .join('');

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#333">Daily Review Reminder</h2>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>You have <strong>${totalCards}</strong> card(s) to review today. Here's the breakdown:</p>
        <table style="border-collapse:collapse;width:100%">
          <thead>
            <tr style="background:#f4f4f4">
              <th style="padding:8px;border:1px solid #ddd;text-align:left">Subject</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:center">Cards to Review</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
        <p style="margin-top:20px">Keep up the great work! 🎯</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject: `Leitner Reminder — ${totalCards} card(s) to review today`,
      html,
    });

    this.logger.log(`Daily reminder sent to ${to}`);
  }
}
