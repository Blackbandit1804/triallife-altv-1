import * as alt from 'alt-client';
import { PhoneEvents } from '../../../../../shared/enums/phone-events';
import { SYSTEM_EVENTS } from '../../../../../shared/enums/system';
import { VehicleData } from '../../../../../shared/information/vehicle-data';
import { BaseHUD } from '../../hud';

export class DealershipAppController {
    static init() {
        BaseHUD.view.on('phone:Dealership:Populate', DealershipAppController.populate);
    }

    static populate() {
        BaseHUD.view.emit('phone:Dealership:Vehicles', VehicleData);
    }
}
