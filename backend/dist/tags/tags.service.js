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
exports.TagsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tag_schema_1 = require("./schemas/tag.schema");
let TagsService = class TagsService {
    tagModel;
    constructor(tagModel) {
        this.tagModel = tagModel;
    }
    async create(createTagDto, userId) {
        const { name, subjectId } = createTagDto;
        const newTag = new this.tagModel({ ...createTagDto, userId });
        try {
            return await newTag.save();
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException(`Tag "${name}" already exists for this subject.`);
            }
            throw error;
        }
    }
    async findAll(userId, subjectId) {
        const filter = { userId };
        if (subjectId) {
            filter.subjectId = subjectId;
        }
        return this.tagModel.find(filter).exec();
    }
    async delete(id, userId) {
        const tag = await this.tagModel.findOne({ _id: id, userId }).exec();
        if (!tag) {
            throw new common_1.ForbiddenException('Tag not found or you do not have permission.');
        }
        const result = await this.tagModel.deleteOne({ _id: id, userId }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Tag with ID "${id}" not found`);
        }
        return { deleted: true, _id: id };
    }
};
exports.TagsService = TagsService;
exports.TagsService = TagsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tag_schema_1.Tag.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TagsService);
//# sourceMappingURL=tags.service.js.map