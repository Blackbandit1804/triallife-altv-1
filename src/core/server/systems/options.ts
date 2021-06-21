import { Database, getDatabase } from 'simplymongo';
import { DefaultConfig } from '../configs/settings';
import { Collections } from '../interfaces/collection';
import { defaultOptions, DiscordID, Options } from '../interfaces/option';
import Logger from '../utility/Logger';

export class OptionsManager {
    static db: Database = getDatabase();
    static data: Options = {};

    static async propagateOptions() {
        const databaseData = await OptionsManager.db.fetchAllData<Options>(Collections.Options);
        const currentOptions = !databaseData[0] ? defaultOptions : databaseData[0];
        Object.keys(currentOptions).forEach((key) => (OptionsManager.data[key] = currentOptions[key]));
        if (!databaseData[0]) OptionsManager.data = await OptionsManager.db.insertData(OptionsManager.data, Collections.Options, true);
        if (DefaultConfig.WHITELIST) Logger.info(`Whitelisted Users: ${OptionsManager.data.whitelist.length}`);
    }

    static async addToWhitelist(id: DiscordID) {
        const isWhitelisted = await OptionsManager.isWhitelisted(id);
        if (isWhitelisted) return true;
        OptionsManager.data.whitelist.push(id);
        OptionsManager.db.updatePartialData(OptionsManager.data._id, { whitelist: OptionsManager.data.whitelist }, Collections.Options);
        return true;
    }

    static isWhitelisted(id: DiscordID): boolean {
        const index = OptionsManager.data.whitelist.findIndex((dID) => dID === id);
        if (index >= 0) return true;
        return false;
    }

    static removeFromWhitelist(id: DiscordID): boolean {
        const index = OptionsManager.data.whitelist.findIndex((dID) => dID === id);
        if (index <= -1) return false;
        OptionsManager.data.whitelist.splice(index, 1);
        OptionsManager.db.updatePartialData(OptionsManager.data._id, { whitelist: OptionsManager.data.whitelist }, Collections.Options);
        return true;
    }
}

export default function loader() {
    OptionsManager.propagateOptions();
}
