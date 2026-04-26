import { CardLogsService } from './card-logs.service';
export declare class CardLogsController {
    private readonly cardLogsService;
    constructor(cardLogsService: CardLogsService);
    getCardLogs(cardId: string, req: any): Promise<import("./schemas/card-log.schema").CardLog[]>;
}
