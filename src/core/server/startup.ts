import * as alt from 'alt-server';
import env from 'dotenv';
import { Database, onReady } from 'simplymongo';
import { DefaultConfig } from './configs/settings';
import { SystemEvent } from '../shared/enums/system';
import { Collections } from './interface/collections';
import { default as logger, default as Logger } from './utility/tlrp-logger';
import { setAzureEndpoint } from './utility/encryption';

env.config();

const needed = ['MONGO_URL', 'ENDPOINT', 'TLRP_READY', 'MONGO_DATABASE'];

if (DefaultConfig.USE_DISCORD_BOT) needed.push('DISCORD_BOT_CLIENT', 'DISCORD_BOT', 'DISCORD_SERVER_ID');
if (DefaultConfig.WHITELIST) needed.push('WHITELIST_ROLE');

for (let i = 0; i < needed.length; i++) {
    if (needed[i] in process.env) continue;
    logger.error(`[3L:RP] Could not fetch entry from .env file Is there an entry for '${needed[i]}' in .env?`);
    process.exit(0);
}

setAzureEndpoint(process.env.ENDPOINT);
const name = 'tlrp';
const mongoURL = process.env.MONGO_URL;
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
    if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD)
        new Database(mongoURL, process.env.MONGO_DATABASE, collections, process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD);
    else new Database(mongoURL, process.env.MONGO_DATABASE, collections);
} catch (err) {
    logger.error(`[3L:RP] Could not create database.`);
    process.exit(0);
}
