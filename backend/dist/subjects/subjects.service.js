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
exports.SubjectsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const subject_schema_1 = require("./schemas/subject.schema");
const card_schema_1 = require("../cards/schemas/card.schema");
const tag_schema_1 = require("../tags/schemas/tag.schema");
let SubjectsService = class SubjectsService {
    subjectModel;
    cardModel;
    tagModel;
    constructor(subjectModel, cardModel, tagModel) {
        this.subjectModel = subjectModel;
        this.cardModel = cardModel;
        this.tagModel = tagModel;
    }
    async create(createSubjectDto) {
        const createdSubject = new this.subjectModel(createSubjectDto);
        return createdSubject.save();
    }
    async findAll() {
        return this.subjectModel.find().exec();
    }
    async delete(id) {
        const cardCount = await this.cardModel.countDocuments({ subjectId: id }).exec();
        if (cardCount > 0) {
            throw new common_1.ConflictException(`Cannot delete subject with ID "${id}" because it is associated with ${cardCount} card(s).`);
        }
        const result = await this.subjectModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Subject with ID "${id}" not found`);
        }
        await this.tagModel.deleteMany({ subjectId: id }).exec();
        return { deleted: true, _id: id };
    }
};
exports.SubjectsService = SubjectsService;
exports.SubjectsService = SubjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(subject_schema_1.Subject.name)),
    __param(1, (0, mongoose_1.InjectModel)(card_schema_1.Card.name)),
    __param(2, (0, mongoose_1.InjectModel)(tag_schema_1.Tag.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SubjectsService);
//# sourceMappingURL=subjects.service.js.map