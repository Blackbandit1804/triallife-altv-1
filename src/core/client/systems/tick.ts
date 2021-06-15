import * as alt from 'alt-client';
import { SystemEvent } from '../../shared/enums/system';

const pingEvery = 5000;

alt.onServer(SystemEvent.TICKS_START, startTick);

function startTick() {
    alt.setInterval(handlePing, pingEvery);
}

/**
 * Pings the server every 5 minutes.
 */
function handlePing() {
    alt.emitServer(SystemEvent.PLAYER_TICK);
}
