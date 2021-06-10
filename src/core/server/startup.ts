/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import env from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Database, onReady } from 'simplymongo';
import { SYSTEM_EVENTS } from '../shared/utility/enums';
import { getVersionIdentifier } from './auth/getRequests';
import { PostController } from './auth/postRequests';
import { Collections } from './interface/collections';
import { default as logger, default as Logger } from './utility/tlrpLogger';
import { setAzureEndpoint } from './utility/encryption';
import { TlrpFunctions, InjectedStarter, TLRP } from './utility/tlrpLoader';

env.config();

setAzureEndpoint(process.env.ENDPOINT ? process.env.ENDPOINT : 'https://deathnerotv.github.io/triallife/');

const startTime = Date.now();
const name = 'tlrp';
const data = [];
const mongoURL = process.env.MONGO_URL ? process.env.MONGO_URL : `mongodb://localhost:27017`;
const fPath = path.join(alt.getResourcePath(alt.resourceName), '/server/tlrp.wasm');
const collections = [Collections.Accounts, Collections.Characters, Collections.Options, Collections.Interiors];

alt.on('playerConnect', handleEarlyConnect);
alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, handleEntryToggle);

async function handleFinish() {
    const tmpPath = path.join(alt.getResourcePath(alt.resourceName), `/server/${name}.js`);
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    for (let i = 0; i < data.length; i++) fs.appendFileSync(tmpPath, `import '${data[i]}'; \r\n`);
    import(`./${name}`).then(() => fs.unlinkSync(tmpPath));
    import('./systems/options').then((res) => res.default());
    import('./systems/discord').then((res) => res.default());
    logger.info(`==> Total Bootup Time -- ${Date.now() - startTime}ms`);
    alt.emit(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY);
}

async function runBooter() {
    getVersionIdentifier().then((version) => {
        if (!version) {
            console.error(new Error(`Failed to contact Authenticator endpoint.`));
            process.exit(0);
        }

        logger.info(`Version: ${process.env.VERSION}`);
        if (version !== process.env.VERSION) {
            logger.warning(`--- Version Warning ---`);
            logger.warning(`Your server may be out of date. Please update your server.`);
            logger.warning(`Please pull down the latest changes from the official repository.`);
            logger.warning(`Try merging from the master branch or from the upstream branch of your choice.`);
        }
    });

    const buffer: any = fs.readFileSync(fPath);
    const starterFns = await TLRP.load<InjectedStarter>(buffer);
    alt.once(starterFns.getEvent(), handleEvent);
    starterFns.deploy();
}

async function handleEvent(value: number) {
    const buffer: Buffer = await PostController.postAsync(TLRP.getHelpers().__getString(value));
    if (!buffer) {
        logger.error(`Unable to boot. Potentially invalid license.`);
        process.exit(0);
    }
    await TLRP.load<TlrpFunctions>(buffer).catch((err) => {
        try {
            const data = JSON.parse(buffer.toString());
            logger.error(`Status: ${data.status} | Error: ${data.message}`);
        } catch (err) {
            logger.error(err);
        }
        return null;
    });
    const ext = TLRP.getFunctions<TlrpFunctions>('tlrp');
    if (!ext.isDoneLoading) {
        Logger.error(`Failed to properly load Trial Life binaries.`);
        process.exit(0);
    }
    onReady(() => {
        alt.on(TLRP.getHelpers().__getString(ext.getLoadName()), (value) => {
            data.push(value);
            TLRP.getFunctions<TlrpFunctions>('tlrp').isDoneLoading();
        });
        alt.once(`${ext.getFinishName()}`, handleFinish);
        ext.isDoneLoading();
    });
    new Database(mongoURL, TLRP.getHelpers().__getString(ext.getDatabaseName()), collections);
}

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
    const result = fs.readFileSync('package.json').toString();
    const data = JSON.parse(result);
    process.env.VERSION = data.version;
    runBooter();
} catch (err) {
    logger.error(`[3L:RP] Could not fetch version from package.json. Is there a package.json?`);
    process.exit(0);
}
