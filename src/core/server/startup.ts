import * as alt from 'alt-server';
import env from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Database, onReady } from 'simplymongo';
import { SystemEvent } from '../shared/enums/system';
import { getVersionIdentifier } from './ares/getRequests';
import { PostController } from './ares/postRequests';
import { Collections } from './interface/DatabaseCollections';
import { default as logger, default as Logger } from './utility/tlrpLogger';
import { setAzureEndpoint } from './utility/encryption';
import { TlrpFunctions, InjectedStarter, WASM } from './utility/wasmLoader';

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
    if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
    }

    for (let i = 0; i < data.length; i++) {
        fs.appendFileSync(tmpPath, `import '${data[i]}'; \r\n`);
    }

    import(`./${name}`).then(() => {
        fs.unlinkSync(tmpPath);
    });

    import('./utility/console');

    import('./systems/options').then((res) => {
        res.default();
    });

    import('./systems/discord').then((res) => {
        res.default();
    });

    import('../plugins/imports').then((res) => {
        res.default(startTime);
    });
}

async function runBooter() {
    getVersionIdentifier().then((version) => {
        if (!version) {
            console.error(new Error(`Failed to contact Ares endpoint.`));
            process.exit(0);
        }

        logger.info(`Version: ${process.env.ATHENA_VERSION}`);
        if (version !== process.env.ATHENA_VERSION) {
            logger.warning(`--- Version Warning ---`);
            logger.warning(`Your server may be out of date. Please update your server.`);
            logger.warning(`Please pull down the latest changes from the official repository.`);
            logger.warning(`Try merging from the master branch or from the upstream branch of your choice.`);
        }
    });

    const buffer: any = fs.readFileSync(fPath);
    const starterFns = await WASM.load<InjectedStarter>(buffer);
    alt.once(starterFns.getEvent(), handleEvent);
    starterFns.deploy();
}

async function handleEvent(value: number) {
    const buffer: Buffer = await PostController.postAsync(WASM.getHelpers().__getString(value));

    if (!buffer) {
        logger.error(`Unable to boot. Potentially invalid license.`);
        process.exit(0);
    }

    await WASM.load<TlrpFunctions>(buffer).catch((err) => {
        try {
            const data = JSON.parse(buffer.toString());
            logger.error(`Status: ${data.status} | Error: ${data.message}`);
        } catch (err) {}
        return null;
    });

    const ext = WASM.getFunctions<TlrpFunctions>('ares');

    if (!ext.isDoneLoading) {
        Logger.error(`Failed to properly load Athena binaries.`);
        process.exit(0);
    }

    onReady(() => {
        alt.on(WASM.getHelpers().__getString(ext.getLoadName()), (value) => {
            data.push(value);
            WASM.getFunctions<TlrpFunctions>('ares').isDoneLoading();
        });

        alt.once(`${ext.getFinishName()}`, handleFinish);
        ext.isDoneLoading();
    });

    if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD) {
        new Database(
            mongoURL,
            WASM.getHelpers().__getString(ext.getDatabaseName()),
            collections,
            process.env.MONGO_USERNAME,
            process.env.MONGO_PASSWORD
        );
    } else {
        new Database(mongoURL, WASM.getHelpers().__getString(ext.getDatabaseName()), collections);
    }
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
        player.kick('[Athena] Connected too early. Server still warming up.');
    } catch (err) {
        alt.log(`[Athena] A reconnection event happened too early. Try again.`);
    }
}

try {
    const result = fs.readFileSync('package.json').toString();
    const data = JSON.parse(result);
    process.env.ATHENA_VERSION = data.version;
    runBooter();
} catch (err) {
    logger.error(`[Athena] Could not fetch version from package.json. Is there a package.json?`);
    process.exit(0);
}
