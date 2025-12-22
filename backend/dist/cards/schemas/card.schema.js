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
exports.CardSchema = exports.Card = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
const box_schema_1 = require("../../boxes/schemas/box.schema");
let Card = class Card {
    front;
    back;
    currentBoxId;
    subjectId;
    lastReviewed;
    tags;
    color;
};
exports.Card = Card;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Card.prototype, "front", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Card.prototype, "back", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true }),
    __metadata("design:type", box_schema_1.Box)
], Card.prototype, "currentBoxId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    }),
    __metadata("design:type", String)
], Card.prototype, "subjectId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Card.prototype, "lastReviewed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }] }),
    __metadata("design:type", Array)
], Card.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Card.prototype, "color", void 0);
exports.Card = Card = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Card);
exports.CardSchema = mongoose_1.SchemaFactory.createForClass(Card);
//# sourceMappingURL=card.schema.js.map