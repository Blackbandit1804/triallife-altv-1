/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';

/**
 * Sends an emit event to all players with arguments.
 * @export
 * @param {string} eventName
 * @param {...any[]} args
 */
export function emitAll(eventName: string, ...args: any[]) {
    alt.emitAllClients(eventName, ...args);
}
