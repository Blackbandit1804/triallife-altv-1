import * as alt from 'alt-client';
import { Command, DeviceState, RadioType } from './salty-chat';
import { Voice } from './voice';

export class Configuration {
    public serverIdentifier: string;
    public teamSpeakName: string;
    public soundPack: string;
    public ingameChannel: number;
    public ingameChannelPassword: string;
    public swissChannels: number[];
    public voiceRanges: number[];
    public radioTowers: RadioTower[];
    public requestTalkStates: boolean;
    public requestRadioTrafficStates: boolean;
    public radioRangeUltraShort: number;
    public radioRangeShort: number;
    public radioRangeLong: number;
}

export class BulkUpdate {
    public playerStates: PlayerState[];
    public selfState: SelfState;

    constructor(playerStates: PlayerState[], selfState: SelfState) {
        this.playerStates = playerStates;
        this.selfState = selfState;
    }
}

export class EchoEffect {
    public duration: number;
    public rolloff: number;
    public delay: number;

    constructor(duration: number = 100, rolloff: number = 0.3, delay: number = 250) {
        this.duration = duration;
        this.rolloff = rolloff;
        this.delay = delay;
    }
}

export class GameInstance {
    public serverUniqueIdentifier: string;
    public name: string;
    public channelId: number;
    public channelPassword: string;
    public soundPack: string;
    public swissChannelIds: number[];
    public sendTalkStates: boolean;
    public sendRadioTrafficStates: boolean;
    public ultraShortRangeDistance: number;
    public shortRangeDistance: number;
    public longRangeDistance: number;

    constructor(
        serverUniqueIdentifier: string,
        name: string,
        channelId: number,
        channelPassword: string,
        soundPack: string,
        swissChannels: number[],
        sendTalkStates: boolean,
        sendRadioTrafficStates: boolean,
        rRangeUltraShort: number,
        rRangeShort: number,
        rRangeLong: number
    ) {
        this.serverUniqueIdentifier = serverUniqueIdentifier;
        this.name = name;
        this.channelId = channelId;
        this.channelPassword = channelPassword;
        this.soundPack = soundPack;
        this.swissChannelIds = swissChannels;
        this.sendTalkStates = sendTalkStates;
        this.sendRadioTrafficStates = sendRadioTrafficStates;
        this.ultraShortRangeDistance = rRangeUltraShort;
        this.shortRangeDistance = rRangeShort;
        this.longRangeDistance = rRangeLong;
    }
}

export class MegaphoneCommunication {
    public name: string;
    public range: number;
    public volume: number = null;

    constructor(name: string, range: number, volume: number = null) {
        this.name = name;
        this.range = range;
        if (volume != null) this.volume = volume;
    }
}

export class MuffleEffect {
    public intensity: number;

    constructor(intensity: number) {
        this.intensity = intensity;
    }
}

export class PhoneCommunication {
    public name: string;
    public signalStrength: number = null;
    public volume: number = null;
    public direct: boolean;
    public relayedBy: string[] = null;

    constructor(name: string, direct: boolean, signalStrength: number = null, volume: number = null, relayedBy: string[] = null) {
        this.name = name;
        this.direct = direct;
        if (signalStrength != null) this.signalStrength = signalStrength;
        if (volume != null) this.volume = volume;
        if (relayedBy != null) this.relayedBy = relayedBy;
    }
}

export class PlayerState {
    public name: string;
    public position: alt.Vector3;
    public voiceRange: number;
    public isAlive: boolean;
    public volumeOverride: number = null;
    public distanceCulled: boolean;
    public muffle: MuffleEffect;

    constructor(
        name: string,
        position?: alt.Vector3,
        voiceRange?: number,
        isAlive?: boolean,
        distanceCulled: boolean = false,
        muffleIntensity: number = null,
        volumeOverride: number = null
    ) {
        this.name = name;
        if (position) this.position = position;
        if (voiceRange) this.voiceRange = voiceRange;
        if (isAlive != null) this.isAlive = isAlive;
        this.distanceCulled = distanceCulled;
        if (muffleIntensity != null) this.muffle = new MuffleEffect(muffleIntensity);
        if (volumeOverride != null) {
            if (volumeOverride > 1.6) this.volumeOverride = 1.6;
            else if (volumeOverride < 0) this.volumeOverride = 0;
            else this.volumeOverride = volumeOverride;
        }
    }
}

export class PluginCommand {
    public command: Command;
    public serverUniqueIdentifier: string;
    public parameter: any;

    constructor(command: Command, parameter?: any) {
        this.command = command;
        if (parameter) this.parameter = parameter;
    }
}

export class RadioCommunication {
    public name: string;
    public senderRadioType: RadioType;
    public ownRadioType: RadioType;
    public playMicClick: boolean;
    public direct: boolean;
    public secondary: boolean;
    public relayedBy: string[] = null;
    public volume: number = null;

    constructor(name: string, senderRadioType: RadioType, ownRadioType: RadioType, playMicClick: boolean, isSecondary: boolean, direct: boolean, relayedBy?: string[], volume?: number) {
        this.name = name;
        this.senderRadioType = senderRadioType;
        this.ownRadioType = ownRadioType;
        this.playMicClick = playMicClick;
        this.secondary = isSecondary;
        this.direct = direct;
        if (relayedBy != null) this.relayedBy = relayedBy;
        if (volume != null) this.volume = volume;
    }
}

export class RadioConfiguration {
    public primaryChannel: string;
    public secondaryChannel: string;
    public volume: number = 1;
    public usingPrimaryRadio: boolean;
    public usingSecondaryRadio: boolean;
    public speakerEnabled: boolean;
}

export class RadioTower {
    public x: number;
    public y: number;
    public z: number;
    public range: number;

    constructor(x: number, y: number, z: number, range: number = 8000) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.range = range;
    }
}

export class RadioTowers {
    public towers: RadioTower[];

    constructor(towers: RadioTower[]) {
        this.towers = towers;
    }
}

export class RadioTrafficState {
    public name: string;
    public isSending: boolean;
    public isPrimaryChannel: boolean;
    public activeRelay: string;
}

export class SelfState {
    public Position: alt.Vector3;
    public Rotation: number;
    public IsAlive: boolean;
    public Echo: EchoEffect;

    constructor(position: alt.Vector3, rotation: number, echo: boolean = false) {
        this.Position = position;
        this.Rotation = rotation;
        this.IsAlive = true;
        if (echo) this.Echo = new EchoEffect();
    }
}

export class Sound {
    public filename: string;
    public isLoop: boolean;
    public handle: string;

    constructor(fileName: string, loop?: boolean, handle?: string) {
        this.filename = fileName;
        this.isLoop = loop;
        this.handle = handle ? handle : fileName;
    }
}

export class SoundState {
    public microphoneMuted: boolean = false;
    public microphoneEnabled: boolean = false;
    public soundMuted: boolean = false;
    public soundEnabled: boolean = false;
    public usingMegaphone: boolean = false;

    public get microphone(): DeviceState {
        if (!this.microphoneEnabled) return DeviceState.disabled;
        else if (this.microphoneMuted) return DeviceState.muted;
        else return DeviceState.enabled;
    }

    public get speaker(): DeviceState {
        if (!this.soundEnabled) return DeviceState.disabled;
        else if (this.soundMuted) return DeviceState.muted;
        else return DeviceState.enabled;
    }
}

export class VoiceClient {
    public player: alt.Player;
    public teamSpeakName: string;
    public voiceRange: number;
    public isAlive: boolean;
    public lastPosition: alt.Vector3;
    public distanceCulled: boolean;

    constructor(player: alt.Player, teamSpeakName: string, voiceRange: number, isAlive: boolean, lastPosition: alt.Vector3) {
        this.player = player;
        this.teamSpeakName = teamSpeakName;
        this.voiceRange = voiceRange;
        this.isAlive = isAlive;
        this.lastPosition = lastPosition;
    }

    public SendPlayerStateUpdate(): void {
        Voice.GetInstance().executeCommand(new PluginCommand(Command.playerStateUpdate, new PlayerState(this.teamSpeakName, this.lastPosition, this.voiceRange, this.isAlive)));
    }
}

export class VoiceClientServer {
    public id: number;
    public teamSpeakName: string;
    public voiceRange: number;
    public isAlive: boolean;
    public position: alt.Vector3;
}

export class Config {
    public static radioRange: RadioType = RadioType.longRange;
    public static enableRadioAnimation: boolean = true;
    public static enableLipSync: boolean = true;
    public static enableMuffling: boolean = true;
    public static enableSignalStrength: boolean = true;
    public static enableRadioSound: boolean = true;
    public static enableOverlay: boolean = true;
    public static overlayAddress: string = 'gremmler86.zap-ts3.com';
    public static automaticPlayerHealth: boolean = true;
}
