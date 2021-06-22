import * as alt from 'alt-client';
import { SystemEvent } from '../../shared/utility/enums';

alt.onServer(SystemEvent.Meta_Emit, emitMeta);

function emitMeta(key, value) {
    if (!alt.Player.local.meta) alt.Player.local.meta = {};
    alt.emit(SystemEvent.Meta_Changed, key, value, alt.Player.local.meta[key]);
    alt.Player.local.meta[key] = value;
}
