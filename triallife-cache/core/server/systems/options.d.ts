import { Database } from 'simplymongo';
import { DiscordID, Options } from '../interface/options';
export declare class OptionsController {
    static db: Database;
    static data: Options;
    static propagateOptions(): Promise<void>;
    static addToWhitelist(id: DiscordID): Promise<boolean>;
    static isWhitelisted(id: DiscordID): boolean;
    static removeFromWhitelist(id: DiscordID): boolean;
}
export default function loader(): void;
