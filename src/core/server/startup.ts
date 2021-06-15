import * as alt from 'alt-server';
import env from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Database, onReady } from 'simplymongo';
import { SystemEvent } from '../shared/enums/system';
import { getVersionIdentifier } from './tlrp/getRequests';
import { PostManager } from './tlrp/postRequests';
import { Collections } from './interface/collections';
import { default as logger, default as Logger } from './utility/tlrp-logger';
import { setAzureEndpoint } from './utility/encryption';
import { TlrpFunctions, InjectedStarter, WASM } from './utility/wasm-loader';

env.config();

setAzureEndpoint(process.env.ENDPOINT ? process.env.ENDPOINT : 'http://mg-community.ddns.net:7800');

const startTime = Date.now();
const name = 'wasm';
const data = [];
const mongoURL = process.env.MONGO_URL ? process.env.MONGO_URL : `mongodb://localhost:27017`;
const fPath = path.join(alt.getResourcePath(alt.resourceName), '/server/tlrp.wasm');
const collections = [Collections.Accounts, Collections.Characters, Collections.Options, Collections.Interiors];

alt.on('playerConnect', handleEarlyConnect);
alt.on(SystemEvent.BOOTUP_ENABLE_ENTRY, handleEntryToggle);

async function handleFinish() {
    const tmpPath = path.join(alt.getResourcePath(alt.resourceName), `/server/${name}.js`);
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    for (let i = 0; i < data.length; i++) fs.appendFileSync(tmpPath, `import '${data[i]}'; \r\n`);
    import(`./${name}`).then(() => fs.unlinkSync(tmpPath));
    import('./utility/console');
    import('./systems/options').then((res) => res.default());
    import('./systems/discord').then((res) => res.default());
    import('../plugins/imports').then((res) => res.default(startTime));
}

async function runBooter() {
    onReady(() => alt.once(`tlrp:Boot`, handleFinish));
    if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD) new Database(mongoURL, 'tlrp', collections, process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD);
    else new Database(mongoURL, 'tlrp', collections);
}

function handleEntryToggle() {
    alt.off('playerConnect', handleEarlyConnect);
    logger.info(`Server Warmup Complete. Now accepting connections.`);
}

/**
 * Prevent early connections until server is warmed up.
 * @param {alt.Player} player
 * @return {*}  {void}
 */
function handleEarlyConnect(player: alt.Player): void {
    if (!(player instanceof alt.Player) || !player || !player.valid) {
        return;
    }
    try {
        player.kick('[3L:RP] Connected too early. Server still warming up.');
    } catch (err) {
        alt.log(`[3L:RP] A reconnection event happened too early. Try again.`);
    }
}

try {
    const result = fs.readFileSync('package.json').toString();
    const data = JSON.parse(result);
    process.env.ATHENA_VERSION = data.version;
    runBooter();
} catch (err) {
    logger.error(`[3L:RP] Could not fetch version from package.json. Is there a package.json?`);
    process.exit(0);
}
