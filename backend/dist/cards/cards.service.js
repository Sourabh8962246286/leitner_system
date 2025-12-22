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
const card_schema_1 = require("./schemas/card.schema");
let CardsService = class CardsService {
    cardModel;
    boxesService;
    constructor(cardModel, boxesService) {
        this.cardModel = cardModel;
        this.boxesService = boxesService;
    }
    async create(createCardDto) {
        const firstBox = await this.boxesService.findByLevel(1);
        if (!firstBox) {
            throw new common_1.NotFoundException('Box with level 1 not found. Cannot create card.');
        }
        const newCard = new this.cardModel({
            ...createCardDto,
            currentBoxId: firstBox._id,
        });
        return newCard.save();
    }
    async findAll(tagIds, subjectId) {
        const filter = {};
        if (tagIds && tagIds.length > 0) {
            filter.tags = { $all: tagIds };
        }
        if (subjectId) {
            filter.subjectId = subjectId;
        }
        return this.cardModel.find(filter).exec();
    }
    async handleReview(reviewCardDto) {
        const { cardId, isCorrect } = reviewCardDto;
        const card = await this.cardModel.findById(cardId).populate('currentBoxId').exec();
        if (!card) {
            throw new common_1.NotFoundException(`Card with ID "${cardId}" not found`);
        }
        const currentBox = card.currentBoxId;
        const currentLevel = currentBox.level;
        let nextBox;
        if (isCorrect) {
            console.log(`Correct: Card in Box ${currentLevel}. Moving to next box.`);
            nextBox = await this.boxesService.findByLevel(currentLevel + 1);
            if (!nextBox) {
                console.log(`Correct: Card is in the final box.`);
                nextBox = currentBox;
            }
        }
        else {
            console.log(`Incorrect: Card in Box ${currentLevel}. Moving to Box 1.`);
            nextBox = await this.boxesService.findByLevel(1);
            if (!nextBox) {
                throw new common_1.NotFoundException('Box with level 1 not found.');
            }
        }
        card.currentBoxId = nextBox._id;
        card.lastReviewed = new Date();
        return card.save();
    }
    async update(cardId, updateCardDto) {
        const updatedCard = await this.cardModel.findByIdAndUpdate(cardId, updateCardDto, { new: true }).exec();
        if (!updatedCard) {
            throw new common_1.NotFoundException(`Card with ID "${cardId}" not found`);
        }
        return updatedCard;
    }
    async delete(cardId) {
        const result = await this.cardModel.deleteOne({ _id: cardId }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Card with ID "${cardId}" not found`);
        }
        return { deleted: true, _id: cardId };
    }
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(card_schema_1.Card.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        boxes_service_1.BoxesService])
], CardsService);
//# sourceMappingURL=cards.service.js.map