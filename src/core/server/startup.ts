import * as alt from 'alt-server';
import env from 'dotenv';
import { Database, onReady } from 'simplymongo';
import { SystemEvent } from '../shared/enums/system';
import { Collections } from './interface/collections';
import { default as logger, default as Logger } from './utility/tlrp-logger';
import { setAzureEndpoint } from './utility/encryption';

env.config();
setAzureEndpoint(process.env.ENDPOINT ? process.env.ENDPOINT : 'http://mg-community.ddns.net:7800');
const name = 'tlrp';
const startTime = Date.now();
const collections = [Collections.Accounts, Collections.Characters, Collections.Options, Collections.Interiors];

alt.on('playerConnect', handleEarlyConnect);
alt.on(SystemEvent.BOOTUP_ENABLE_ENTRY, handleEntryToggle);

onReady(async () => {
    import(`./${name}`);
    import('./utility/console');
    import('./systems/options').then((res) => res.default());
    import('./systems/discord').then((res) => res.default());
    import('../plugins/imports').then((res) => res.default(startTime));
    alt.emit(SystemEvent.BOOTUP_ENABLE_ENTRY);
});

function handleEntryToggle() {
    alt.off('playerConnect', handleEarlyConnect);
    logger.info(`Server Warmup Complete. Now accepting connections.`);
}

function handleEarlyConnect(player: alt.Player): void {
    if (!(player instanceof alt.Player) || !player || !player.valid) return;
    try {
        player.kick('[3L:RP] Connected too early. Server still warming up.');
    } catch (err) {
        alt.log(`[3L:RP] A reconnection event happened too early. Try again.`);
    }
}

try {
    const mongoURL = process.env.MONGO_URL;
    if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD) new Database(mongoURL, 'tlrp', collections, process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD);
    else new Database(mongoURL, 'tlrp', collections);
} catch (err) {
    logger.error(`[3L:RP] Could not fetch version from package.json. Is there a package.json?`);
    process.exit(0);
}
