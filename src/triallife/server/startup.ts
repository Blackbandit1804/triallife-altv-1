import * as alt from 'alt-server';
import env from 'dotenv';
import fs from 'fs';
import path from 'path';

import { Database, onReady } from 'simplymongo';
import { SystemEvent } from '../shared/enums/system';
import { Collections } from './interfaces/collections';
import { default as logger, default as Logger } from './utility/tlrpLogger';
import { setAzureEndpoint } from './utility/encryption';
import { isConsoleOpen } from 'alt-client';

env.config();

setAzureEndpoint(process.env.ENDPOINT ? process.env.ENDPOINT : 'http://mg-community.ddns.net:7800');
const startTime = Date.now();
const mongoURL = process.env.MONGO_URL || `mongodb://localhost:27017`;
const collections = [Collections.Accounts, Collections.Characters, Collections.Options, Collections.Interiors];

alt.on('playerConnect', handleEarlyConnect);
alt.on(SystemEvent.BOOTUP_ENABLE_ENTRY, handleEntryToggle);

async function runBooter() {
    if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD) new Database(mongoURL, 'tlrp', collections, process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD);
    else new Database(mongoURL, 'tlrp', collections);
    onReady(() =>
        LoadFiles().then((res) => {
            import('./system/options').then((res) => res.default());
            import('./system/discord').then((res) => res.default());
            import('../plugins/imports').then((res) => res.default(startTime));
        })
    );
}

async function LoadFiles(): Promise<void> {
    const folders: string[] = fs.readdirSync(path.join(alt.getResourcePath(alt.resourceName), '/server/'));
    const filteredFolders: string[] = folders.filter((x) => !x.includes('.'));
    const filteredFiles: string[] = [];
    for (let i = 0; i < filteredFolders.length; i++) {
        const folder = filteredFolders[i];
        const files = fs.readdirSync(path.join(alt.getResourcePath(alt.resourceName), `/server/${folder}`));
        const folders2 = fs.readdirSync(path.join(alt.getResourcePath(alt.resourceName), `/server/${folder}`)).filter((x) => !x.includes('.') && x.includes('Functions'));
        for (let j = 0; j < folders2.length; j++) {
            const folder2 = folders2[j];
            const files2 = fs.readdirSync(path.join(alt.getResourcePath(alt.resourceName), `/server/${folder}/${folder2}`));
            const filtered2 = files2.filter((x) => x.includes('.js') && !x.includes('options.js') && !x.includes('discord.js'));
            filtered2.forEach((file) => filteredFiles.push(`./${folder}/${folder2}/${file}`));
        }
        const filtered = files.filter((x) => x.includes('.js') && !x.includes('options.js') && !x.includes('discord.js'));
        filtered.forEach((file) => filteredFiles.push(`./${folder}/${file}`));
    }
    filteredFiles.forEach((path) => {
        alt.log(path);
        import(path)
            .catch((err) => {
                alt.log(err);
                alt.log(`~r~File that couldn't load: ~b~${path}`);
                alt.log('~r~Killing process; failed to load a file.');
                process.exit(1);
            })
            .then((loadedResult) => {
                if (!loadedResult) {
                    alt.log(`~r~Failed to load: ~b~${path}`);
                    alt.log('~r~Killing process; failed to load a file.');
                    process.exit(1);
                }
            });
    });
}

function handleEntryToggle(): void {
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
    process.env.TLRP_VERSION = data.version;
    runBooter();
} catch (err) {
    logger.error(`[3L:RP] Could not fetch version from package.json. Is there a package.json?`);
    process.exit(0);
}
