import * as alt from 'alt-client';
import * as native from 'natives';

alt.onServer('notification:Show', showNotification);

export function showNotification(text: string): void {
    native.beginTextCommandThefeedPost('STRING');
    native.addTextComponentSubstringPlayerName(text);
    native.endTextCommandThefeedPostTicker(false, true);
}
