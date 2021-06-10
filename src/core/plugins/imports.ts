import * as alt from 'alt-server';
import logger from '../server/utility/tlrpLogger';
import { SYSTEM_EVENTS } from '../shared/utility/enums';

const filePaths = [
    // GAMEMODE IMPORTS -- Remove what you don't want.
    /*'./teleportEffect/teleporter',
    './heist/heist',
    './deathLog/deathLog',
    './actionMenu/actionMenu',
    './interactionExample/index',
    './noMiniGun/index'*/
    // YOUR IMPORTS -- BELOW HERE
];

export default async function loadImports(startTime: number) {
    logger.info(`Loading extras folder...`);
    let extraResourcesCount = 0;
    for (let i = 0; i < filePaths.length; i++) {
        const result = await import(filePaths[i]).catch((err) => {
            console.error(err);
            return null;
        });

        if (!result) {
            logger.error(`Failed to load resource: ${filePaths[i]}`);
            continue;
        }

        if (result.default) {
            result.default();
        }

        logger.log(`Loaded: ${filePaths[i]}`);
        extraResourcesCount += 1;
    }

    logger.info(`Extra Resources Loaded: ${extraResourcesCount}`);
    logger.info(`==> Total Bootup Time -- ${Date.now() - startTime}ms`);
    alt.emit(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY);
}
