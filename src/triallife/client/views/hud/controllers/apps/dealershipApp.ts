import * as alt from 'alt-client';
import { PhoneEvents } from '../../../../../shared/enums/phoneEvent';
import { SystemEvent } from '../../../../../shared/enums/system';
import { VehicleData } from '../../../../../shared/configs/vehicle-list';
import { BaseHUD } from '../../hud';

export class DealershipAppController {
    static init() {
        BaseHUD.view.on('phone:Dealership:Populate', DealershipAppController.populate);
    }

    static populate() {
        BaseHUD.view.emit('phone:Dealership:Vehicles', VehicleData);
    }
}
