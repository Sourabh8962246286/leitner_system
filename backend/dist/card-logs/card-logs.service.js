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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardLogsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const card_log_schema_1 = require("./schemas/card-log.schema");
let CardLogsService = class CardLogsService {
    cardLogModel;
    constructor(cardLogModel) {
        this.cardLogModel = cardLogModel;
    }
    async createLog(createCardLogDto) {
        const newLog = new this.cardLogModel({
            ...createCardLogDto,
            reviewedAt: new Date(),
        });
        return newLog.save();
    }
    async getLogsForCard(cardId, userId) {
        return this.cardLogModel
            .find({ cardId, userId })
            .sort({ reviewedAt: -1 })
            .exec();
    }
    async getStatsForCard(cardId, userId) {
        const logs = await this.cardLogModel.find({ cardId, userId }).exec();
        const totalReviews = logs.length;
        const correctCount = logs.filter((log) => log.isCorrect).length;
        const incorrectCount = totalReviews - correctCount;
        const successRate = totalReviews > 0 ? (correctCount / totalReviews) * 100 : 0;
        const totalTimeSpent = logs.reduce((sum, log) => sum + log.timeSpent, 0);
        return {
            totalReviews,
            correctCount,
            incorrectCount,
            successRate: Math.round(successRate * 100) / 100,
            totalTimeSpent,
        };
    }
    async updateLogTimeSpent(logId, userId, timeSpent) {
        const log = await this.cardLogModel.findOne({ _id: logId, userId });
        if (!log)
            throw new common_1.NotFoundException('Log not found');
        log.timeSpent = timeSpent;
        return log.save();
    }
    async deleteLogsForCard(cardId) {
        await this.cardLogModel.deleteMany({ cardId }).exec();
    }
};
exports.CardLogsService = CardLogsService;
exports.CardLogsService = CardLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(card_log_schema_1.CardLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CardLogsService);
//# sourceMappingURL=card-logs.service.js.map