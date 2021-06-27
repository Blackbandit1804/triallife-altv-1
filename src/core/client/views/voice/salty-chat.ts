import * as alt from 'alt-client';
import * as native from 'natives';

export enum Command {
    pluginState = 0,
    initiate = 1,
    reset = 2,
    ping = 3,
    pong = 4,
    instanceState = 5,
    soundState = 6,
    selfStateUpdate = 7,
    playerStateUpdate = 8,
    bulkUpdate = 9,
    removePlayer = 10,
    talkState = 11,
    playSound = 18,
    stopSound = 19,
    phoneCommunicationUpdate = 20,
    stopPhoneCommunication = 21,
    radioCommunicationUpdate = 30,
    stopRadioCommunication = 31,
    radioTowerUpdate = 32,
    radioTrafficState = 33,
    megaphoneCommunicationUpdate = 40,
    stopMegaphoneCommunication = 41
}

export enum GameInstanceState {
    notInitiated = -1,
    notConnected = 0,
    connected = 1,
    ingame = 2,
    inSwissChannel = 3
}

export enum RadioType {
    none = 1,
    shortRange = 2,
    longRange = 4,
    distributed = 8,
    ultraShortRange = 16
}

export enum FromClient {
    useRadio = 'SaltyChat:UseRadio',
    useMegaphone = 'SaltyChat:UseMegaphone',
    toggleRange = 'SaltyChat:ToggleRange',
    setRadioVolume = 'SaltyChat:SetRadioVolume',
    toggleRadioSpeaker = 'SaltyChat:ToggleRadioSpeaker',
    playSound = 'SaltyChat:PlaySound',
    stopSound = 'SaltyChat:StopSound'
}

export enum FromServer {
    initialize = 'SaltyChat:Initialize',
    syncClients = 'SaltyChat:SyncClients',
    updateClient = 'SaltyChat:UpdateClient',
    updateClientAlive = 'SaltyChat:UpdateClientAlive',
    updateClientRange = 'SaltyChat:UpdateClientRange',
    removeClient = 'SaltyChat:RemoveClient',
    phoneEstablish = 'SaltyChat:PhoneEstablish',
    phoneEnd = 'SaltyChat:PhoneEnd',
    radioSetChannel = 'SaltyChat:RadioSetChannel',
    radioLeaveChannel = 'SaltyChat:RadioLeaveChannel',
    playerIsSending = 'SaltyChat:PlayerIsSending',
    playerIsSendingRelayed = 'SaltyChat:PlayerIsSendingRelayed',
    updateRadioTowers = 'SaltyChat:UpdateRadioTowers',
    isUsingMegaphone = 'SaltyChat:IsUsingMegaphone'
}

export enum ToClient {
    radioChanged = 'SaltyChat:RadioChanged',
    stateChanged = 'SaltyChat:StateChanged',
    voiceRangeChanged = 'SaltyChat:VoiceRangeChanged'
}

export enum ToServer {
    checkVersion = 'SaltyChat:CheckVersion',
    isUsingMegaphone = 'SaltyChat:IsUsingMegaphone',
    playerIsSending = 'SaltyChat:PlayerIsSending',
    setRange = 'SaltyChat:SetRange',
    toggleRadioSpeaker = 'SaltyChat:ToggleRadioSpeaker'
}

export enum DeviceState {
    enabled = 0,
    muted = 1,
    disabled = 2
}

export function hasOpening(vehicle: alt.Vehicle): boolean {
    if (native.isThisModelABike(vehicle.model)) return true;
    if (native.isThisModelABoat(vehicle.model)) return true;
    if (native.isThisModelABicycle(vehicle.model)) return true;
    if (native.isThisModelAQuadbike(vehicle.model)) return true;
    if (!native.areAllVehicleWindowsIntact(vehicle.scriptID)) return true;
    if (native.isVehicleAConvertible(vehicle.scriptID, false) && native.getConvertibleRoofState(vehicle.scriptID) != 0) return true;
    if (!native.doesVehicleHaveRoof(vehicle.scriptID)) return true;
    return false;
}

export function loadAnimDict(animDict: string): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
        if (!native.doesAnimDictExist(animDict)) {
            rej('Invalid animation dictionary');
            return;
        }
        if (native.hasAnimDictLoaded(animDict)) {
            res(true);
            return;
        }
        let tries = 0;
        let interval = alt.setInterval(() => {
            if (tries >= 100) {
                alt.clearInterval(interval);
                rej(`Timeout reached loading dictionary ${animDict}`);
            } else {
                if (!native.hasAnimDictLoaded(animDict)) {
                    native.requestAnimDict(animDict);
                    tries++;
                } else {
                    alt.clearInterval(interval);
                    res(true);
                }
            }
        }, 50);
    });
}
