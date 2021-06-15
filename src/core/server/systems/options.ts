import { Database, getDatabase } from 'simplymongo';
import { DEFAULT_CONFIG } from '../tlrp/main';
import { Collections } from '../interface/DatabaseCollections';
import { defaultOptions, DiscordID, Options } from '../interface/Options';
import Logger from '../utility/tlrpLogger';

export class OptionsController {
    static db: Database = getDatabase();
    static data: Options = {};

    /**
     * Used to initialize options after loading.
     * @static
     * @memberof OptionsController
     */
    static async propagateOptions() {
        const databaseData = await OptionsController.db.fetchAllData<Options>(Collections.Options);
        const currentOptions = !databaseData[0] ? defaultOptions : databaseData[0];

        Object.keys(currentOptions).forEach((key) => {
            OptionsController.data[key] = currentOptions[key];
        });

        if (!databaseData[0]) {
            OptionsController.data = await OptionsController.db.insertData(
                OptionsController.data,
                Collections.Options,
                true
            );
        }

        if (DEFAULT_CONFIG.WHITELIST) {
            Logger.info(`Whitelisted Users: ${OptionsController.data.whitelist.length}`);
        }
    }

    /**
     * Add a user to the whitelist group.
     * @static
     * @param {DiscordID} id
     * @memberof OptionsController
     */
    static async addToWhitelist(id: DiscordID) {
        const isWhitelisted = await OptionsController.isWhitelisted(id);

        if (isWhitelisted) {
            return true;
        }

        OptionsController.data.whitelist.push(id);
        OptionsController.db.updatePartialData(
            OptionsController.data._id,
            { whitelist: OptionsController.data.whitelist },
            Collections.Options
        );

        return true;
    }

    /**
     * Check if a user is whitelisted.
     * @static
     * @param {DiscordID} id
     * @return {*}  {boolean}
     * @memberof OptionsController
     */
    static isWhitelisted(id: DiscordID): boolean {
        const index = OptionsController.data.whitelist.findIndex((dID) => dID === id);

        if (index >= 0) {
            return true;
        }

        return false;
    }

    /**
     * Remove a discord id from the whitelist.
     * @static
     * @param {DiscordID} id
     * @return {*}  {boolean}
     * @memberof OptionsController
     */
    static removeFromWhitelist(id: DiscordID): boolean {
        const index = OptionsController.data.whitelist.findIndex((dID) => dID === id);

        if (index <= -1) {
            return false;
        }

        OptionsController.data.whitelist.splice(index, 1);
        OptionsController.db.updatePartialData(
            OptionsController.data._id,
            { whitelist: OptionsController.data.whitelist },
            Collections.Options
        );

        return true;
    }
}

export default function loader() {
    OptionsController.propagateOptions();
}
