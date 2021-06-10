/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-client';
import * as native from 'natives';
import { SHARED_CONFIG } from '../../shared/configs/config';
import { SYSTEM_EVENTS } from '../../shared/utility/enums';
import { ActionMenu, Action } from '../../shared/interfaces/actions';
import { Interaction } from '../../shared/interfaces/interaction';
import { distance2d } from '../../shared/utility/vector';
import { KEY_BINDS } from '../events/keyup';
import { drawMarker } from '../utility/marker';
import { ActionsController } from '../views/hud/controllers/actionsController';
import { HelpController } from '../views/hud/controllers/helpController';
import { BaseHUD, HudEventNames } from '../views/hud/hud';
import { VehicleController } from './vehicle';
