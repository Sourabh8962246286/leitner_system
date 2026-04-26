import { UsersService } from '../users/users.service';
import { CardsService } from '../cards/cards.service';
import { EmailService } from '../notifications/email.service';
export declare class SchedulerService {
    private readonly usersService;
    private readonly cardsService;
    private readonly emailService;
    private readonly logger;
    constructor(usersService: UsersService, cardsService: CardsService, emailService: EmailService);
    sendDailyReminders(): Promise<void>;
}
