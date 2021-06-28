import * as alt from 'alt-client';
import * as native from 'natives';
import { HudEventNames, SystemEvent } from '../../../shared/utility/enums';
import { handleFrontendSound } from '../../systems/sound';
import { disableAllAttacks, disableAllControls } from '../../utility/disable-control';
import { freezePlayer } from '../../utility/freeze';
import { ActionManager } from './managers/action';
import './managers/audio';
import './managers/help';

const url = `http://resource/client/views/hud/html/index.html`;

let interval: number;

export class HUD {
    static isOpen: boolean = false;
    static view: alt.WebView;

    static createView() {
        if (!HUD.view) {
            HUD.view = new alt.WebView(url, false);
            HUD.view.isVisible = false;
            HUD.view.on('actions:Navigate', ActionManager.navigate);
            HUD.view.on('actions:Close', ActionManager.closed);
            HUD.view.on('actions:LeftRight', ActionManager.leftRight);
            HUD.view.on('actions:Trigger', ActionManager.trigger);
            //HUD.view.on('phone:Event', PhoneManager.routeFromPhone);
            HUD.view.on('play:Sound', handleFrontendSound);
            //initialize phone manager apps
            alt.setTimeout(() => {
                if (native.isScreenFadedOut()) native.doScreenFadeIn(2000);
            }, 1000);
        }
        freezePlayer(false);
        native.displayRadar(false);
        HUD.view.unfocus();
    }

    static setHudStatus(name: HudEventNames, value: any) {
        if (!HUD.view) return;
        HUD.view.emit(name, value);
        if (name !== HudEventNames.SetVehicle) return;
        native.displayRadar(value);
        if (!value) return;
        HUD.setHudStatus(HudEventNames.Fuel, alt.Player.local.vehicle.fuel);
    }

    static appendMessage(message: string) {}

    static updateSpeed(speed: string) {
        if (!HUD.view) return;
        if (!alt.Player.local.vehicle) return;
        HUD.view.emit(HudEventNames.Speed, speed);
        HUD.view.emit(HudEventNames.Fuel, alt.Player.local.vehicle.fuel);
        if (alt.Player.local.vehicle) {
            HUD.view.emit(HudEventNames.Lock, alt.Player.local.vehicle.lockStatus);
            HUD.view.emit(HudEventNames.Engine, alt.Player.local.vehicle.engineStatus);
            const [_, lightsOn, highBeams] = native.getVehicleLightsState(alt.Player.local.vehicle.scriptID, false, false);
            HUD.view.emit(HudEventNames.Lights, lightsOn || highBeams ? true : false);
        }
    }

    static processMetaChange(key: string, value: any, oldValue: any) {
        if (!HUD.view) return;
        if (key === 'hunger') HUD.view.emit(HudEventNames.Food, value);
        if (key === 'thirst') HUD.view.emit(HudEventNames.Water, value);
        if (key === 'mood') HUD.view.emit(HudEventNames.Mood, value);
        if (key === 'blood') HUD.view.emit(HudEventNames.Blood, value);
        if (key === 'voice') HUD.view.emit(HudEventNames.Voice, value);
    }

    static pauseStreamPlayer() {
        HUD.view.emit('hud:PauseStream');
    }

    static adjustStreamPlayer(identifier: string, volume: number, startTime: number) {
        HUD.view.emit('hud:AudioStream', identifier, volume, startTime);
    }

    static setHudVisibility(value: boolean) {
        if (!HUD.view) return;
        if (!value) {
            HUD.view.isVisible = false;
            return;
        }
        HUD.view.isVisible = true;
        return;
    }

    static handleFocus(shouldFocus: boolean, focusName: string): void {
        if (alt.isConsoleOpen()) return;
        try {
            alt.showCursor(shouldFocus);
        } catch (err) {
            return;
        }
        if (shouldFocus) {
            HUD.view.focus();
            interval = alt.setInterval(() => {
                native.disableControlAction(0, 1, true);
                native.disableControlAction(0, 2, true);
                native.disableControlAction(0, 3, true);
                native.disableControlAction(0, 4, true);
                native.disableControlAction(0, 5, true);
                native.disableControlAction(0, 6, true);
                native.disableControlAction(0, 24, true);
                native.disableControlAction(0, 25, true);
                native.disableControlAction(0, 68, true);
                native.disableControlAction(0, 69, true);
                native.disableControlAction(0, 70, true);
                native.disableControlAction(0, 91, true);
                native.disableControlAction(0, 92, true);
                native.disableControlAction(0, 114, true);
                native.disableControlAction(0, 142, true);
            }, 0);
            alt.Player.local[focusName] = true;
            disableAllAttacks(true);
            return;
        }
        if (interval) alt.clearInterval(interval);
        alt.Player.local[focusName] = false;
        HUD.view.unfocus();
        disableAllAttacks(false);
    }
}

alt.on('enteredVehicle', () => HUD.setHudStatus(HudEventNames.SetVehicle, true));
alt.on('leftVehicle', () => HUD.setHudStatus(HudEventNames.SetVehicle, false));
alt.on(SystemEvent.Meta_Changed, HUD.processMetaChange);
alt.onServer(SystemEvent.Ticks_Start, HUD.createView);
alt.onServer(SystemEvent.Hud_Message_Append, HUD.appendMessage);
