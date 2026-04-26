import { ConfigService } from '@nestjs/config';
import { DailyReminderPayload, NotificationChannel } from './interfaces/notification-channel.interface';
export declare class EmailService implements NotificationChannel {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    sendDailyReminder(to: string, payload: DailyReminderPayload): Promise<void>;
}
