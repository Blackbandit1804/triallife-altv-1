import * as alt from 'alt-client';
import * as native from 'natives';
import { SystemEvent } from '../../shared/enums/system';

alt.onServer(SystemEvent.PLAYER_EMIT_NOTIFICATION, showNotification);

export function showNotification(text: string): void {
    native.beginTextCommandThefeedPost('STRING');
    native.addTextComponentSubstringPlayerName(text);
    native.endTextCommandThefeedPostTicker(false, true);
}
