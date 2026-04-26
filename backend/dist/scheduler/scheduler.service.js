"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const users_service_1 = require("../users/users.service");
const cards_service_1 = require("../cards/cards.service");
const email_service_1 = require("../notifications/email.service");
let SchedulerService = SchedulerService_1 = class SchedulerService {
    usersService;
    cardsService;
    emailService;
    logger = new common_1.Logger(SchedulerService_1.name);
    constructor(usersService, cardsService, emailService) {
        this.usersService = usersService;
        this.cardsService = cardsService;
        this.emailService = emailService;
    }
    async sendDailyReminders() {
        this.logger.log('Running daily reminder cron job...');
        const users = await this.usersService.findAll();
        for (const user of users) {
            const subjectSummary = await this.cardsService.getDueCardsGroupedBySubject(user._id.toString());
            if (subjectSummary.length === 0)
                continue;
            const totalCards = subjectSummary.reduce((sum, s) => sum + s.count, 0);
            await this.emailService.sendDailyReminder(user.email, {
                userName: user.name,
                totalCards,
                subjectSummary,
            });
        }
        this.logger.log(`Daily reminders sent to ${users.length} user(s).`);
    }
};
exports.SchedulerService = SchedulerService;
__decorate([
    (0, schedule_1.Cron)('0 9 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "sendDailyReminders", null);
exports.SchedulerService = SchedulerService = SchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        cards_service_1.CardsService,
        email_service_1.EmailService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map