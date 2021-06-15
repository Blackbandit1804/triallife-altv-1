import * as alt from 'alt-server';
import axios from 'axios';
import { decryptData, getAzureEndpoint, getSharedSecret } from '../utility/encryption'; // Should be able to safely import this.
import { WASM } from '../utility/wasm-loader';
import { generatePosterFormat } from './shared';

export class PostManager {
    static isWindows(): boolean {
        return process.platform.includes('win');
    }

    static async getSecret(): Promise<string | boolean> {
        const sharedSecret = await getSharedSecret();

        if (!sharedSecret) {
            throw new Error(`Could not get shared secret from Ares. Try rebooting.`);
        }

        return sharedSecret;
    }

    static async getPostFormat(data: any): Promise<URLSearchParams> {
        const responseParms = new URLSearchParams();
        const postData = await generatePosterFormat({ isWindows: PostManager.isWindows, ...data });
        responseParms.append('data', JSON.stringify(postData));
        return responseParms;
    }

    static async emitPost(route: string, params: URLSearchParams): Promise<any> {
        return await axios
            .post(`${getAzureEndpoint()}${route}`, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                responseType: 'arraybuffer'
            })
            .catch((err) => {
                alt.log(err);
                return null;
            });
    }

    static validateResponse(response: any): boolean {
        if (!response || !response.data || !response.status) {
            if (response.message && response.message.includes('expired')) {
                alt.logError(`[Athena] ${response.message}`);
                process.exit(0);
            }

            if (response.message) {
                alt.logError(`[Athena] ${response.message}`);
                process.exit(0);
            }

            return false;
        }

        return true;
    }

    static async postAsync<T>(route: string, data: any = {}): Promise<T> {
        if (typeof route === 'number') {
            route = WASM.getHelpers().__getString(route);
        }

        await PostManager.getSecret();

        const params = await PostManager.getPostFormat(data);
        const response = await PostManager.emitPost(route, params);

        if (!PostManager.validateResponse(response)) {
            return null;
        }

        const decrypted = await decryptData(response.data);

        if (!decrypted) {
            return response.data;
        }

        return decrypted;
    }
}
