import * as alt from 'alt-client';
import * as native from 'natives';
import { SystemEvent } from '../../shared/utility/enums';

alt.onServer(SystemEvent.Player_Freeze, freezePlayer);

export function freezePlayer(value: boolean): void {
    native.freezeEntityPosition(alt.Player.local.scriptID, value);
}
