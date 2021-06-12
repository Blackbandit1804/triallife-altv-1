import * as alt from 'alt-client';

// Interfaces - Always Load First
import './extensions/meta';
import './extensions/player';
import './extensions/vehicle';

// Events
import './events/connection-complete';
import './events/disconnect';
import './events/keyup';

// Systems
import './system/animations';
import './system/blip';
import './system/death';
import './system/disable';
import './system/interiors';
import './system/job';
import './system/meta';
import './system/nametag';
import './system/marker';
import './system/noclip';
import './system/particle';
import './system/progress-bar';
import './system/quick-token';
import './system/sound';
import './system/tasks';
import './system/tick';
import './system/textlabel';
import './system/toolbar';
import './system/vehicle';
import './system/world';
import './system/torso';

// Utility
import './utility/notification';
import './utility/reload';
import './utility/screenshot';

// Views
import './views/atm/atm';
import './views/creator/creator';
import './views/characters/characters';
import './views/clothing/clothing';
import './views/inventory/inventory';
import './views/job/job';
import './views/login/login';

// Client Plugins
import '../client-plugins/imports';
