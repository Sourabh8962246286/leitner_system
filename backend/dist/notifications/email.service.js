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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    transporter;
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('EMAIL_HOST'),
            port: this.configService.get('EMAIL_PORT'),
            secure: false,
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASS'),
            },
        });
    }
    async sendDailyReminder(to, payload) {
        const { userName, totalCards, subjectSummary } = payload;
        const tableRows = subjectSummary
            .map((s) => `<tr><td style="padding:8px;border:1px solid #ddd">${s.subjectName}</td><td style="padding:8px;border:1px solid #ddd;text-align:center">${s.count}</td></tr>`)
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
            from: this.configService.get('EMAIL_FROM'),
            to,
            subject: `Leitner Reminder — ${totalCards} card(s) to review today`,
            html,
        });
        this.logger.log(`Daily reminder sent to ${to}`);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map