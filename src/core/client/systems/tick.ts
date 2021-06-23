import * as alt from 'alt-client';
import { SystemEvent } from '../../shared/utility/enums';

alt.onServer(SystemEvent.Ticks_Start, () => alt.setInterval(() => alt.emitServer(SystemEvent.Player_Tick), 5000));
