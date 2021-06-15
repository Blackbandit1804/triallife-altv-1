import * as alt from 'alt-server';
import { TLRP_EVENTS_PLAYER } from '../../server/enums/tlrp';
import { EventController } from '../../server/systems/tlrp-event';

EventController.onPlayer(TLRP_EVENTS_PLAYER.DIED, (player: alt.Player) => {
    alt.log(`[Death Log] ${player.data.name} has died.`);
});
