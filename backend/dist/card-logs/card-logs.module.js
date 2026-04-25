"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardLogsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const card_log_schema_1 = require("./schemas/card-log.schema");
const card_logs_service_1 = require("./card-logs.service");
const card_logs_controller_1 = require("./card-logs.controller");
let CardLogsModule = class CardLogsModule {
};
exports.CardLogsModule = CardLogsModule;
exports.CardLogsModule = CardLogsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: card_log_schema_1.CardLog.name, schema: card_log_schema_1.CardLogSchema }]),
        ],
        controllers: [card_logs_controller_1.CardLogsController],
        providers: [card_logs_service_1.CardLogsService],
        exports: [card_logs_service_1.CardLogsService],
    })
], CardLogsModule);
//# sourceMappingURL=card-logs.module.js.map