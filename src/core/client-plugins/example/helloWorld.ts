import * as alt from 'alt-client';
import { SystemEvent } from '../../shared/enums/system';

// This will only turn on your plugin when they've fully logged in.
alt.onServer(SystemEvent.TICKS_START, whatToDoAfterLogin);

// Gets called when the player logs in and spawns.
function whatToDoAfterLogin() {
    alt.log('Loaded Test Plugin: Example');

    // Do other things...
    // Call other functions...
}
