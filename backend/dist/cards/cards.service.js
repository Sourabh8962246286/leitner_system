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
exports.CardsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const boxes_service_1 = require("../boxes/boxes.service");
const card_logs_service_1 = require("../card-logs/card-logs.service");
const card_schema_1 = require("./schemas/card.schema");
let CardsService = class CardsService {
    cardModel;
    boxesService;
    cardLogsService;
    constructor(cardModel, boxesService, cardLogsService) {
        this.cardModel = cardModel;
        this.boxesService = boxesService;
        this.cardLogsService = cardLogsService;
    }
    async create(createCardDto, userId) {
        const firstBox = await this.boxesService.findByLevel(1);
        if (!firstBox) {
            throw new common_1.NotFoundException('Box with level 1 not found. Cannot create card.');
        }
        const newCard = new this.cardModel({
            ...createCardDto,
            userId,
            currentBoxId: firstBox._id,
        });
        return newCard.save();
    }
    async findAll(userId, tagIds, subjectId) {
        const filter = { userId };
        if (tagIds && tagIds.length > 0) {
            filter.tags = { $all: tagIds };
        }
        if (subjectId) {
            filter.subjectId = subjectId;
        }
        return this.cardModel.find(filter).exec();
    }
    async handleReview(reviewCardDto, userId) {
        const { cardId, isCorrect, timeSpent = 0 } = reviewCardDto;
        const card = await this.cardModel
            .findOne({ _id: cardId, userId })
            .populate('currentBoxId')
            .exec();
        if (!card) {
            throw new common_1.ForbiddenException('Card not found or you do not have permission.');
        }
        const currentBox = card.currentBoxId;
        const currentLevel = currentBox.level;
        let nextBox;
        if (isCorrect) {
            nextBox = await this.boxesService.findByLevel(currentLevel + 1);
            if (!nextBox) {
                nextBox = currentBox;
            }
        }
        else {
            nextBox = await this.boxesService.findByLevel(1);
            if (!nextBox) {
                throw new common_1.NotFoundException('Box with level 1 not found.');
            }
        }
        await this.cardLogsService.createLog({
            cardId: card._id.toString(),
            userId,
            subjectId: card.subjectId.toString(),
            isCorrect,
            timeSpent,
            previousBoxLevel: currentLevel,
            newBoxLevel: nextBox.level,
        });
        card.currentBoxId = nextBox._id;
        card.lastReviewed = new Date();
        return card.save();
    }
    async update(cardId, updateCardDto, userId) {
        const card = await this.cardModel.findOne({ _id: cardId, userId }).exec();
        if (!card) {
            throw new common_1.ForbiddenException('Card not found or you do not have permission.');
        }
        const updatedCard = await this.cardModel
            .findByIdAndUpdate(cardId, updateCardDto, { new: true })
            .exec();
        if (!updatedCard) {
            throw new common_1.NotFoundException(`Card with ID "${cardId}" not found`);
        }
        return updatedCard;
    }
    async delete(cardId, userId) {
        const card = await this.cardModel.findOne({ _id: cardId, userId }).exec();
        if (!card) {
            throw new common_1.ForbiddenException('Card not found or you do not have permission.');
        }
        const result = await this.cardModel.deleteOne({ _id: cardId }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Card with ID "${cardId}" not found`);
        }
        await this.cardLogsService.deleteLogsForCard(cardId);
        return { deleted: true, _id: cardId };
    }
    async getDueCardsGroupedBySubject(userId) {
        const now = new Date();
        const dayNames = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ];
        const todayName = dayNames[now.getDay()];
        const todayDate = now.getDate();
        const cards = await this.cardModel
            .find({ userId })
            .populate('currentBoxId')
            .populate('subjectId')
            .exec();
        const dueCards = cards.filter((card) => {
            const box = card.currentBoxId;
            const schedule = box?.schedule ?? [];
            if (card.lastReviewed) {
                const last = new Date(card.lastReviewed);
                const reviewedToday = last.getFullYear() === now.getFullYear() &&
                    last.getMonth() === now.getMonth() &&
                    last.getDate() === now.getDate();
                if (reviewedToday)
                    return false;
            }
            for (const entry of schedule) {
                if (entry === 'Everyday')
                    return true;
                if (entry === todayName)
                    return true;
                if (entry === 'Every other Saturday' && todayName === 'Saturday') {
                    if (!card.lastReviewed)
                        return true;
                    const daysSince = (now.getTime() - new Date(card.lastReviewed).getTime()) / 86400000;
                    if (daysSince >= 7)
                        return true;
                }
                if (entry === 'First Sunday of the month' &&
                    todayName === 'Sunday' &&
                    todayDate <= 7) {
                    return true;
                }
            }
            return false;
        });
        const grouped = new Map();
        for (const card of dueCards) {
            const subject = card.subjectId;
            const name = subject?.name ?? 'Unknown';
            grouped.set(name, (grouped.get(name) ?? 0) + 1);
        }
        return Array.from(grouped.entries()).map(([subjectName, count]) => ({
            subjectName,
            count,
        }));
    }
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(card_schema_1.Card.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        boxes_service_1.BoxesService,
        card_logs_service_1.CardLogsService])
], CardsService);
//# sourceMappingURL=cards.service.js.map