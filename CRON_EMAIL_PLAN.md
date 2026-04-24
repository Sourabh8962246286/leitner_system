# Plan: Daily Email Reminder — Scheduler + Notifications Modules

## Context

The app needs a daily 9AM cron job that emails each user a summary of their Leitner flashcards due for review that day.

- A `notifications` module houses the email service — designed to be extensible to WhatsApp/SMS later via a shared interface.
- A `scheduler` module owns the cron job logic.
- The existing `box.schedule` field (e.g. `['Everyday']`, `['Tuesday', 'Thursday']`, `['Every other Saturday']`, `['First Sunday of the month']`) is currently stored but never evaluated — this plan implements that logic in the backend.

---

## Stack

- **Backend**: NestJS, MongoDB/Mongoose
- **Scheduling**: `@nestjs/schedule` (`@Cron` decorator)
- **Email**: `nodemailer`

---

## New File Structure

```
backend/src/
├── notifications/
│   ├── notifications.module.ts
│   ├── email.service.ts
│   └── interfaces/
│       └── notification-channel.interface.ts
└── scheduler/
    ├── scheduler.module.ts
    └── scheduler.service.ts
```

**Modified files:**
- `backend/src/cards/cards.service.ts` — add `getDueCardsGroupedBySubject(userId)`
- `backend/src/users/users.service.ts` — add `findAll()`
- `backend/src/app.module.ts` — register new modules
- `backend/.env` — add SMTP config vars

---

## Step-by-Step Implementation

### Step 1 — Install packages

```bash
cd backend
npm install @nestjs/schedule nodemailer
npm install -D @types/nodemailer
```

---

### Step 2 — Add email env vars to `backend/.env`

```env
# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="Leitner System <your-email@gmail.com>"
```

> For Gmail, use an **App Password** (not your regular password). Enable 2FA → Google Account → Security → App Passwords.

---

### Step 3 — Create `notifications/interfaces/notification-channel.interface.ts`

Shared contract for all future channels (email, WhatsApp, SMS):

```typescript
export interface DailyReminderPayload {
  userName: string;
  totalCards: number;
  subjectSummary: { subjectName: string; count: number }[];
}

export interface NotificationChannel {
  sendDailyReminder(recipient: string, payload: DailyReminderPayload): Promise<void>;
}
```

---

### Step 4 — Create `notifications/email.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { DailyReminderPayload, NotificationChannel } from './interfaces/notification-channel.interface';

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

  async sendDailyReminder(to: string, payload: DailyReminderPayload): Promise<void> {
    const { userName, totalCards, subjectSummary } = payload;

    const tableRows = subjectSummary
      .map(s => `<tr><td style="padding:8px;border:1px solid #ddd">${s.subjectName}</td><td style="padding:8px;border:1px solid #ddd;text-align:center">${s.count}</td></tr>`)
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
```

---

### Step 5 — Create `notifications/notifications.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class NotificationsModule {}
```

---

### Step 6 — Add `findAll()` to `users/users.service.ts`

```typescript
async findAll(): Promise<UserDocument[]> {
  return this.userModel.find().exec();
}
```

---

### Step 7 — Add `getDueCardsGroupedBySubject()` to `cards/cards.service.ts`

```typescript
async getDueCardsGroupedBySubject(
  userId: string,
): Promise<{ subjectName: string; count: number }[]> {
  const now = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[now.getDay()];
  const todayDate = now.getDate();

  const cards = await this.cardModel
    .find({ userId })
    .populate('currentBoxId')
    .populate('subjectId')
    .exec();

  const dueCards = cards.filter(card => {
    const box = card.currentBoxId as any;
    const schedule: string[] = box?.schedule ?? [];

    // Skip if already reviewed today
    if (card.lastReviewed) {
      const last = new Date(card.lastReviewed);
      const reviewedToday =
        last.getFullYear() === now.getFullYear() &&
        last.getMonth() === now.getMonth() &&
        last.getDate() === now.getDate();
      if (reviewedToday) return false;
    }

    for (const entry of schedule) {
      if (entry === 'Everyday') return true;
      if (entry === todayName) return true;
      if (entry === 'Every other Saturday' && todayName === 'Saturday') {
        if (!card.lastReviewed) return true;
        const daysSince = (now.getTime() - new Date(card.lastReviewed).getTime()) / 86400000;
        if (daysSince >= 7) return true;
      }
      if (entry === 'First Sunday of the month' && todayName === 'Sunday' && todayDate <= 7) {
        return true;
      }
    }
    return false;
  });

  // Group by subject name
  const grouped = new Map<string, number>();
  for (const card of dueCards) {
    const subject = card.subjectId as any;
    const name: string = subject?.name ?? 'Unknown';
    grouped.set(name, (grouped.get(name) ?? 0) + 1);
  }

  return Array.from(grouped.entries()).map(([subjectName, count]) => ({ subjectName, count }));
}
```

> **Note:** `populate('subjectId')` works without importing `SubjectsModule` because the Subject model is already registered in Mongoose globally by `SubjectsModule`.

---

### Step 8 — Create `scheduler/scheduler.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { CardsService } from '../cards/cards.service';
import { EmailService } from '../notifications/email.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly cardsService: CardsService,
    private readonly emailService: EmailService,
  ) {}

  @Cron('0 9 * * *')
  async sendDailyReminders(): Promise<void> {
    this.logger.log('Running daily reminder cron job...');

    const users = await this.usersService.findAll();

    for (const user of users) {
      const subjectSummary = await this.cardsService.getDueCardsGroupedBySubject(
        user._id.toString(),
      );

      if (subjectSummary.length === 0) continue;

      const totalCards = subjectSummary.reduce((sum, s) => sum + s.count, 0);

      await this.emailService.sendDailyReminder(user.email, {
        userName: user.name,
        totalCards,
        subjectSummary,
      });
    }

    this.logger.log(`Daily reminders sent to ${users.length} user(s).`);
  }
}
```

---

### Step 9 — Create `scheduler/scheduler.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { CardsModule } from '../cards/cards.module';

@Module({
  imports: [NotificationsModule, UsersModule, CardsModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
```

---

### Step 10 — Update `app.module.ts`

```typescript
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './notifications/notifications.module';
import { SchedulerModule } from './scheduler/scheduler.module';

// Add to imports array:
ScheduleModule.forRoot(),
NotificationsModule,
SchedulerModule,
```

---

## Email Preview

```
Subject: Leitner Reminder — 8 card(s) to review today

Hi John,

You have 8 card(s) to review today. Here's the breakdown:

┌──────────────────┬──────────────────┐
│ Subject          │ Cards to Review  │
├──────────────────┼──────────────────┤
│ Mathematics      │ 3                │
│ Spanish          │ 2                │
│ History          │ 3                │
└──────────────────┴──────────────────┘

Keep up the great work! 🎯
```

---

## Verification

1. Add `EMAIL_*` vars to `backend/.env`
2. To test immediately without waiting for 9AM, temporarily change the cron expression in `scheduler.service.ts` to `'* * * * *'` (every minute)
3. Restart backend — check terminal logs for `Running daily reminder cron job...`
4. Confirm email arrives with the correct subject/count table
5. Verify users with zero due cards receive **no** email
6. Restore cron to `'0 9 * * *'` before committing

---

## Future Extension Points

To add WhatsApp or SMS notifications later:
1. Create `whatsapp.service.ts` implementing `NotificationChannel`
2. Add it to `NotificationsModule` providers/exports
3. Inject it into `SchedulerService` alongside `EmailService`

No changes needed to `notifications.module.ts` structure or the cron logic itself.
