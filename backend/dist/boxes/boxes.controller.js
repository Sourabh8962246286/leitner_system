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
exports.BoxesController = void 0;
const common_1 = require("@nestjs/common");
const boxes_service_1 = require("./boxes.service");
let BoxesController = class BoxesController {
    boxesService;
    constructor(boxesService) {
        this.boxesService = boxesService;
    }
    findAll() {
        return this.boxesService.findAll();
    }
};
exports.BoxesController = BoxesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BoxesController.prototype, "findAll", null);
exports.BoxesController = BoxesController = __decorate([
    (0, common_1.Controller)('boxes'),
    __metadata("design:paramtypes", [boxes_service_1.BoxesService])
], BoxesController);
//# sourceMappingURL=boxes.controller.js.map