import * as alt from 'alt-server';
import env from 'dotenv';
import fs from 'fs';
import path from 'path';

import { Database, onReady } from 'simplymongo';
import { SystemEvent } from '../shared/enums/system';
import { getVersionIdentifier } from './auth/getRequests';
import { PostController } from './auth/postRequests';
import { Collections } from './interfaces/collections';
import { default as logger, default as Logger } from './utility/tlrpLogger';
import { setAzureEndpoint } from './utility/encryption';
import { TlrpFunctions, InjectedStarter, WASM } from './utility/wasmLoader';
env.config();

setAzureEndpoint(process.env.ENDPOINT ? process.env.ENDPOINT : 'https://ares.stuyk.com');
