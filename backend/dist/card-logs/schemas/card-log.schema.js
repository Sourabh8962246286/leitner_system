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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardLogSchema = exports.CardLog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
let CardLog = class CardLog {
    cardId;
    userId;
    subjectId;
    isCorrect;
    timeSpent;
    previousBoxLevel;
    newBoxLevel;
    reviewedAt;
};
exports.CardLog = CardLog;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        required: true,
        index: true,
    }),
    __metadata("design:type", String)
], CardLog.prototype, "cardId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }),
    __metadata("design:type", String)
], CardLog.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    }),
    __metadata("design:type", String)
], CardLog.prototype, "subjectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], CardLog.prototype, "isCorrect", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CardLog.prototype, "timeSpent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], CardLog.prototype, "previousBoxLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], CardLog.prototype, "newBoxLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], CardLog.prototype, "reviewedAt", void 0);
exports.CardLog = CardLog = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CardLog);
exports.CardLogSchema = mongoose_1.SchemaFactory.createForClass(CardLog);
exports.CardLogSchema.index({ cardId: 1, userId: 1, reviewedAt: -1 });
exports.CardLogSchema.index({ userId: 1, subjectId: 1, reviewedAt: -1 });
//# sourceMappingURL=card-log.schema.js.map