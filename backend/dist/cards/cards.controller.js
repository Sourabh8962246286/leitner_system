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
exports.CardsController = void 0;
const common_1 = require("@nestjs/common");
const cards_service_1 = require("./cards.service");
const create_card_dto_1 = require("./dto/create-card.dto");
const review_card_dto_1 = require("./dto/review-card.dto");
const update_card_dto_1 = require("./dto/update-card.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CardsController = class CardsController {
    cardsService;
    constructor(cardsService) {
        this.cardsService = cardsService;
    }
    create(createCardDto, req) {
        return this.cardsService.create(createCardDto, req.user.userId);
    }
    findAll(tags, subjectId, req) {
        const tagIds = tags ? tags.split(',') : [];
        return this.cardsService.findAll(req.user.userId, tagIds, subjectId);
    }
    handleReview(reviewCardDto, req) {
        return this.cardsService.handleReview(reviewCardDto, req.user.userId);
    }
    update(id, updateCardDto, req) {
        return this.cardsService.update(id, updateCardDto, req.user.userId);
    }
    delete(id, req) {
        return this.cardsService.delete(id, req.user.userId);
    }
};
exports.CardsController = CardsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_card_dto_1.CreateCardDto, Object]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('tags')),
    __param(1, (0, common_1.Query)('subjectId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('review'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [review_card_dto_1.ReviewCardDto, Object]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "handleReview", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_card_dto_1.UpdateCardDto, Object]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CardsController.prototype, "delete", null);
exports.CardsController = CardsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('cards'),
    __metadata("design:paramtypes", [cards_service_1.CardsService])
], CardsController);
//# sourceMappingURL=cards.controller.js.map