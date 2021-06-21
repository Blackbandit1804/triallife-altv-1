import * as alt from 'alt-server';
import dotenv from 'dotenv';
import { Database, onReady } from 'simplymongo';
import { SystemEvent } from '../shared/utility/enums';
import { Collections } from './interfaces/collection';
import { TlrpEvent } from './utility/enums';
import Logger from './utility/Logger';

dotenv.config();
const neededValues = [
    'ENDPOINT',
    'MONGO_URL',
    'MONGO_USERNAME',
    'MONGO_PASSWORD',
    'TLRP_READY',
    'DISCORD_BOT_ID',
    'DISCORD_BOT_SECRET',
    'DISCORD_BOT',
    'DISCORD_SERVER_ID',
    'DISCORD_WHITELIST_ROLE'
];
const startTime = Date.now();
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const collections = [Collections.Accounts, Collections.Characters, Collections.Options, Collections.Interiors];
const imports = ['./extensions/player', './extensions/vehicle', './events/server', './systems/login', './systems/world', './views/character'];

neededValues.forEach((value) => {
    if (!(value in process.env)) {
        Logger.warning(`the needed key '${value}' is missing in .env file`);
        process.exit(0);
    }
});

alt.on('playerConnect', handleEarlyConnect);
alt.on(TlrpEvent.TLRP_READY, handleBootup);

function handleEarlyConnect(player: alt.Player): void {
    if (!(player instanceof alt.Player) || !player || !player.valid) return;
    try {
        player.kick('[3L:RP] Zu früh verbunden. Server ist noch am aufwärmen ;)');
    } catch (err) {
        Logger.log(`A reconnection event happened too early. Try again.`);
    }
}

function handleBootup() {
    alt.off('playerConnect', handleEarlyConnect);
    Logger.info(`Server Warmup Complete. Now accepting connections.`);
}

async function handleFinish() {
    for (let i = 0; i < imports.length; i++) import(`${imports[i]}`);
    import('./utility/console');
    import('./systems/options').then((res) => res.default());
    import('./systems/discord').then((res) => res.default());
    import('./express');
    Logger.info(`Total Bootup Time -- ${Date.now() - startTime}ms`);
    alt.emit(TlrpEvent.TLRP_READY);
}

function startup() {
    onReady(() => handleFinish);
    if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD) new Database(mongoURL, 'tlrp', collections, process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD);
    else new Database(mongoURL, 'tlrp', collections);
}
startup();
