import { CardLogsService } from './card-logs.service';
import { UpdateCardLogDto } from './dto/update-card-log.dto';
export declare class CardLogsController {
    private readonly cardLogsService;
    constructor(cardLogsService: CardLogsService);
    getCardLogs(cardId: string, req: any): Promise<import("./schemas/card-log.schema").CardLog[]>;
    updateLogTimeSpent(logId: string, body: UpdateCardLogDto, req: any): Promise<import("./schemas/card-log.schema").CardLog>;
}
