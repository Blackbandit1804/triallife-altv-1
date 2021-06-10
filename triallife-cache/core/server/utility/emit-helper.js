import * as alt from 'alt-server';
export function emitAll(eventName, ...args) {
    alt.emitAllClients(eventName, ...args);
}
