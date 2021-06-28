/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { DefaultConfig } from '../configs/settings';
import { getUniquePlayerHash } from '../utility/usefull';
import { SaltyChat, SystemEvent } from '../../shared/utility/enums';
import Logger from '../utility/Logger';
import { TlrpEvent } from '../utility/enums';

class Configuration {
    ServerIdentifier: string;
    SoundPack: string;
    IngameChannel: number;
    IngameChannelPassword: string;
    SwissChannels: number[];
    VoiceRanges: number[];
    RadioTowers: RadioTower[];
    RequestTalkStates: boolean;
    RequestRadioTrafficStates: boolean;
    MinimumPluginVersion: string;
    MegaphoneRange: number;
    NamePattern: string;
    RadioRangeUltraShort: number;
    RadioRangeShort: number;
    RadioRangeLong: number;
}

class RadioChannel {
    name: string;
    members: Array<Partial<RadioChannelMember>> = new Array<Partial<RadioChannelMember>>();

    constructor(name: string, members: Array<Partial<RadioChannelMember>>) {
        this.name = name;
        if (members && members.length > 0) members.forEach((x) => this.members.push(x));
    }

    isMember(voiceClient: Partial<VoiceClient>): boolean {
        return this.members.findIndex((x) => x.voiceClient === voiceClient) !== -1;
    }

    addMember(voiceClient: Partial<VoiceClient>, isPrimary: boolean): void {
        if (this.members.findIndex((x) => x.voiceClient === voiceClient) !== -1) return;
        this.members.push({ radioChannel: this, voiceClient, isPrimary });
        alt.emitClient(voiceClient.player, SaltyChat.SetRadioChannel, this.name);
        this.members.filter((x) => x.isSending).forEach((x) => alt.emitClient(x.voiceClient.player, SaltyChat.IsSending, x.voiceClient.player.id, true, false));
    }

    removeMember(voiceClient: Partial<VoiceClient>): void {
        const index = this.members.findIndex((x) => x.voiceClient === voiceClient);
        if (index === -1) return;
        const member = this.members[index];
        if (!member) return;
        if (member.isSending) {
            if (member.voiceClient.isRadioSpeakerEnabled)
                VoiceManager.voiceClients.forEach((client) =>
                    alt.emitClient(client.player, 'SaltyChat:PlayerIsSendingRelayed', voiceClient.player, this.name, false, true, voiceClient.player.pos, false, new Array<string>())
                );
            else
                VoiceManager.voiceClients.forEach((client) => alt.emitClient(client.player, 'SaltyChat:PlayerIsSending', voiceClient.player, this.name, false, true, voiceClient.player.pos));
        }
        this.members.splice(index, 1);
        this.members
            .filter((x) => x.isSending)
            .forEach((client) => alt.emitClient(voiceClient.player, 'SaltyChat:PlayerIsSending', client.voiceClient.player, this.name, false, false, client.voiceClient.player.pos));
        alt.emitClient(voiceClient.player, 'SaltyChat:RadioLeaveChannel', null, member.isPrimary);
    }

    setSpeaker(voiceClient: VoiceClient, isEnabled: boolean) {
        const member = this.members.find((x) => x.voiceClient == voiceClient);
        if (!member || member.isSpeakerEnabled == isEnabled) return;
        member.isSpeakerEnabled = isEnabled;
        const sendingMembers = this.members.filter((x) => x.isSending);
        if (!sendingMembers || sendingMembers.length === 0) return;
        if (isEnabled || this.members.findIndex((x) => x.isSpeakerEnabled) !== -1) {
            sendingMembers.forEach((sendingMember) => this.send(sendingMember.voiceClient, true));
        } else {
            sendingMembers.forEach((sendingMember) => {
                VoiceManager.voiceClients
                    .filter((x) => this.members.filter((m) => m.voiceClient != x))
                    .forEach((client) => {
                        alt.emitClient(
                            client.player,
                            'SaltyChat:PlayerIsSendingRelayed',
                            sendingMember.voiceClient.player,
                            this.name,
                            false,
                            false,
                            sendingMember.voiceClient.player.pos,
                            false,
                            new Array<string>(0)
                        );
                    });
            });
        }
    }

    send(voiceClient: Partial<VoiceClient>, isSending: boolean) {
        const radioMember = this.members.find((x) => x.voiceClient === voiceClient);
        if (!radioMember) return;
        const stateChanged = radioMember.isSending != isSending;
        radioMember.isSending = isSending;
        const members = this.members;
        const onSpeaker = members.filter((x) => x.voiceClient.isRadioSpeakerEnabled && x.voiceClient !== voiceClient);
        if (onSpeaker.length === 0) {
            members.forEach((member) =>
                alt.emitClient(member.voiceClient.player, 'SaltyChat:PlayerIsSending', voiceClient.player, this.name, isSending, stateChanged, voiceClient.player.pos)
            );
            return;
        }
        const names = members.map((x) => x.voiceClient.teamspeakName);
        VoiceManager.voiceClients.forEach((client) =>
            alt.emitClient(client.player, 'SaltyChat:PlayerIsSendingRelayed', voiceClient.player, this.name, isSending, stateChanged, client.player.pos, this.isMember(client), names)
        );
    }
}

class RadioChannelMember {
    radioChannel: RadioChannel;
    voiceClient: Partial<VoiceClient>;
    isPrimary: boolean;
    isSending: boolean;
    isSpeakerEnabled: boolean;

    constructor(radioChannel: RadioChannel, voiceClient: VoiceClient, isPrimary: boolean) {
        this.radioChannel = radioChannel;
        this.voiceClient = voiceClient;
        this.isPrimary = isPrimary;
    }
}

class RadioTower {
    x: number;
    y: number;
    z: number;
    range: number = 8000;
}

class VoiceClient {
    player: alt.Player;
    teamspeakName: string;
    voiceRange: number;
    isAlive: boolean;
    isRadioSpeakerEnabled: boolean;
    position: alt.Vector3;

    constructor(player: alt.Player, tsName: string, voiceRange: number, isAlive: boolean, pos: alt.Vector3 = null) {
        this.player = player;
        this.teamspeakName = tsName;
        this.voiceRange = voiceRange;
        this.isAlive = isAlive;
        if (pos) this.position = pos;
    }
}

class ClientInitData {
    teamSpeakName: string;
    serverIdentifier: string;
    soundPack: string;
    ingameChannel: number;
    ingameChannelPassword: string;

    constructor(teamspeakName: string) {
        this.teamSpeakName = teamspeakName;
        this.serverIdentifier = VoiceManager.configuration.ServerIdentifier;
        this.soundPack = VoiceManager.configuration.SoundPack;
        this.ingameChannel = VoiceManager.configuration.IngameChannel;
        this.ingameChannelPassword = VoiceManager.configuration.IngameChannelPassword;
    }
}

class ClientSyncData {
    voiceClients: Array<{ id: number; teamSpeakName: string; voiceRange: number; isAlive: boolean; position: { x: number; y: number; z: number } }>;
    constructor(voiceClients: Array<VoiceClient>) {
        voiceClients.forEach((client) => {
            this.voiceClients.push({
                id: client.player.id,
                teamSpeakName: client.teamspeakName,
                voiceRange: client.voiceRange,
                isAlive: client.isAlive,
                position: { x: client.position.x, y: client.position.y, z: client.position.z }
            });
        });
    }
}

export class VoiceManager {
    static configuration: Configuration;
    static voiceClients: Array<VoiceClient> = new Array<VoiceClient>();
    static radioChannels: Array<RadioChannel> = new Array<RadioChannel>();

    static initialize() {
        VoiceManager.configuration = new Configuration();
        VoiceManager.configuration.ServerIdentifier = DefaultConfig.VOICE_SERVER_ID;
        VoiceManager.configuration.SoundPack = DefaultConfig.VOICE_INGAME_CHANNEL_PASSWORD;
        VoiceManager.configuration.IngameChannel = DefaultConfig.VOICE_INGAME_CHANNEL;
        VoiceManager.configuration.IngameChannelPassword = DefaultConfig.VOICE_INGAME_CHANNEL_PASSWORD;
        VoiceManager.configuration.SwissChannels = DefaultConfig.VOICE_SWISS_CHANNELS;
        VoiceManager.configuration.VoiceRanges = [0, 3.0, 8.0, 15.0, 32.0];
        VoiceManager.configuration.RadioTowers = DefaultConfig.VOICE_RADIO_TOWERS;
        VoiceManager.configuration.RequestTalkStates = true;
        VoiceManager.configuration.RequestRadioTrafficStates = false;
        VoiceManager.configuration.MinimumPluginVersion = DefaultConfig.VOICE_PLUGIN_VERSION;
        VoiceManager.configuration.MegaphoneRange = 50.0;
        VoiceManager.configuration.RadioRangeUltraShort = 1800.0;
        VoiceManager.configuration.RadioRangeShort = 3000.0;
        VoiceManager.configuration.RadioRangeLong = 8000.0;
    }

    static connect(player: alt.Player): void {
        const index = VoiceManager.voiceClients.findIndex((x) => x.player.discord.id === player.discord.id);
        const voiceClient = new VoiceClient(player, getTeamspeakName(player), VoiceManager.configuration.VoiceRanges[1], player.data.stats.blood > 2500);
        if (index !== -1) VoiceManager.voiceClients[index] = voiceClient;
        else VoiceManager.voiceClients.push(voiceClient);
        alt.emitClient(player, 'SaltyChat:Initialize', new ClientInitData(voiceClient.teamspeakName));
        const voiceClients = new Array<VoiceClient>();
        VoiceManager.voiceClients
            .filter((x) => x.player.discord.id !== player.discord.id)
            .forEach((client) => {
                voiceClients.push(new VoiceClient(client.player, client.teamspeakName, client.voiceRange, client.isAlive, client.position));
                alt.emitClient(client.player, 'SaltyChat:UpdateClient', player, voiceClient.teamspeakName, voiceClient.voiceRange, voiceClient.isAlive, voiceClient.position);
            });
        alt.emitClient(player, 'SaltyChat:SyncClients', new ClientSyncData(voiceClients));
    }

    static disconnect(player: alt.Player, reason: string = ''): void {
        alt.emitClient(null, 'SaltyChat:RemoveClient', player.id);
        const index = VoiceManager.voiceClients.findIndex((x) => x.player.discord.id === player.discord.id);
        if (index === -1) return;
        const voiceClient: VoiceClient = VoiceManager.voiceClients[index];
        VoiceManager.radioChannels.forEach((channel) => channel.removeMember(voiceClient));
        VoiceManager.voiceClients.splice(index, 1);
    }

    static checkVersion(player: alt.Player, version: string): void {
        const index = VoiceManager.voiceClients.findIndex((x) => x.player.discord.id === player.discord.id);
        if (index === -1) return;
        if (!isVersionAccepted(version)) player.kick(`[Salty Chat] Mindestversion benötigt: ${VoiceManager.configuration.MinimumPluginVersion}`);
    }

    static playerIsSending(player: alt.Player, radioChannelName: string, isSending: boolean): void {
        const index = VoiceManager.voiceClients.findIndex((x) => x.player.discord.id === player.discord.id);
        if (index === -1) return;
        const voiceClient = VoiceManager.voiceClients[index];
        const radioChannel = getRadioChannel(radioChannelName, false);
        if (!radioChannel || !radioChannel.isMember(voiceClient)) return;
        radioChannel.send(voiceClient, isSending);
    }

    static setVoiceRange(player: alt.Player, range: number): void {
        const index = VoiceManager.voiceClients.findIndex((x) => x.player.discord.id === player.discord.id);
        if (index === -1) return;
        if (VoiceManager.configuration.VoiceRanges.findIndex((x) => x === range) == -1) return;
        const voiceClient = VoiceManager.voiceClients[index];
        voiceClient.voiceRange = range;
        alt.emitClient(null, 'SaltyChat:UpdateClientRange', player, range);
    }

    static isUsingMegaphone(player: alt.Player, state: boolean): void {
        const index = VoiceManager.voiceClients.findIndex((x) => x.player.discord.id === player.discord.id);
        if (index === -1) return;
        alt.emitClient(null, 'SaltyChat:IsUsingMegaphone', player, VoiceManager.configuration.MegaphoneRange, state, player.pos);
    }

    static toggleRadioSpeaker(player: alt.Player, state: boolean): void {
        const index = VoiceManager.voiceClients.findIndex((x) => x.player.discord.id === player.discord.id);
        if (index === -1) return;
        const voiceClient = VoiceManager.voiceClients[index];
        voiceClient.isRadioSpeakerEnabled = state;
        getRadioChannelMembership(voiceClient).forEach((member) => member.radioChannel.setSpeaker(voiceClient, state));
    }

    static setPlayerAlive(player: alt.Player, isAlive: boolean): void {
        const index = VoiceManager.voiceClients.findIndex((x) => x.player.discord.id === player.discord.id);
        if (index === -1) return;
        const voiceClient = VoiceManager.voiceClients[index];
        voiceClient.isAlive = isAlive;
        alt.emitClient(null, 'SaltyChat:UpdateClientAlive', voiceClient.player, isAlive);
    }

    static updateRadioTowers(): void {
        alt.emitClient(null, 'SaltyChat:UpdateRadioTowers', VoiceManager.configuration.RadioTowers);
    }

    static joinRadioChannel(player: alt.Player, channelName: string, isPrimary: boolean): void {
        const index = VoiceManager.voiceClients.findIndex((x) => x.player.discord.id === player.discord.id);
        if (index === -1) return;
        const voiceClient = VoiceManager.voiceClients[index];
        if (!channelName) return;
        if (VoiceManager.radioChannels.findIndex((x) => x.members.findIndex((m) => m.voiceClient === voiceClient && m.isPrimary === isPrimary) !== -1) === -1) return;
        const radioChannel = getRadioChannel(channelName, true);
        radioChannel.addMember(voiceClient, isPrimary);
    }

    static leaveRadioChannel(player: alt.Player, channelName: string): void {
        const index = VoiceManager.voiceClients.findIndex((x) => x.player.discord.id === player.discord.id);
        if (index === -1) return;
        const voiceClient = VoiceManager.voiceClients[index];
        getRadioChannelMembership(voiceClient)
            .filter((m) => m.radioChannel.name === channelName)
            .forEach((membership) => {
                membership.radioChannel.removeMember(voiceClient);
                if (membership.radioChannel.members.length !== 0) return;
                const idx = VoiceManager.radioChannels.findIndex((x) => x.name === membership.radioChannel.name);
                if (idx !== -1) VoiceManager.radioChannels.splice(idx, 1);
            });
    }

    static leaveAllRadioChannel(player: alt.Player): void {
        const index = VoiceManager.voiceClients.findIndex((x) => x.player.discord.id === player.discord.id);
        if (index === -1) return;
        const voiceClient = VoiceManager.voiceClients[index];
        getRadioChannelMembership(voiceClient).forEach((membership) => {
            membership.radioChannel.removeMember(voiceClient);
            if (membership.radioChannel.members.length !== 0) return;
            const idx = VoiceManager.radioChannels.findIndex((x) => x.name === membership.radioChannel.name);
            if (idx !== -1) VoiceManager.radioChannels.splice(idx, 1);
        });
    }

    static startCall(caller: alt.Player, called: alt.Player): void {
        alt.emitClient(caller, 'SaltyChat:PhoneEstablish', called, called.pos);
        alt.emitClient(called, 'SaltyChat:PhoneEstablish', caller, caller.pos);
    }

    static endCall(caller: alt.Player, called: alt.Player): void {
        if (caller && caller.valid) alt.emitClient(caller, 'SaltyChat:PhoneEnd', called.id);
        if (called && called.valid) alt.emitClient(called, 'SaltyChat:PhoneEnd', caller.id);
    }
}

function getRadioChannelMembership(voiceClient: VoiceClient): Array<Partial<RadioChannelMember>> {
    const memberships = new Array<Partial<RadioChannelMember>>();
    const channels = VoiceManager.radioChannels.filter((radioChannel) => radioChannel.members.findIndex((m) => m.voiceClient === voiceClient) && radioChannel);
    channels.forEach((channel) => {
        channel.members.forEach((member) => memberships.push(member));
    });
    return memberships;
}

function getRadioChannel(name: string, create: boolean): RadioChannel {
    let radioChannel = VoiceManager.radioChannels.find((x) => x.name === name);
    if (!radioChannel && create) {
        radioChannel = new RadioChannel(name, new Array<RadioChannelMember>());
        VoiceManager.radioChannels.push(radioChannel);
    }
    return radioChannel;
}

function getTeamspeakName(player: alt.Player) {
    let name = getUniquePlayerHash(player, player.discord.id).substring(0, 24);
    return `TLRP_${name}`;
}

function isVersionAccepted(version: string): boolean {
    if (!version || version === '') return false;
    try {
        const minVersion: string[] = VoiceManager.configuration.MinimumPluginVersion.split('.');
        const curVersion: string[] = version.split('.');
        const counter = curVersion.length >= minVersion.length ? curVersion.length : minVersion.length;
        for (let i = 0; i < counter; i++) {
            const min = parseInt(minVersion[i]);
            const cur = parseInt(curVersion[i]);
            return cur > min;
        }
    } catch (err) {
        return false;
    }
    return true;
}

alt.onClient('SaltyChat:CheckVersion', VoiceManager.checkVersion);
alt.onClient('SaltyChat:IsUsingMegaphone', VoiceManager.isUsingMegaphone);
alt.onClient('SaltyChat:PlayerIsSending', VoiceManager.playerIsSending);
alt.onClient('SaltyChat:SetRange', VoiceManager.setVoiceRange);
alt.onClient('SaltyChat:ToggleRadioSpeaker', VoiceManager.toggleRadioSpeaker);
alt.on('playerDisconnect', VoiceManager.disconnect);
alt.on(SystemEvent.Voice_Add, VoiceManager.connect);
alt.on(SystemEvent.Voice_Remove, VoiceManager.disconnect);
alt.on('SaltyChat:SetPlayerAlive', VoiceManager.setPlayerAlive);
alt.on('SaltyChat:UpdateRadioTowers', VoiceManager.updateRadioTowers);
alt.on('SaltyChat:JoinRadioChannel', VoiceManager.joinRadioChannel);
alt.on('SaltyChat:LeaveRadioChannel', VoiceManager.leaveRadioChannel);
alt.on('SaltyChat:LeaveAllRadioChannel', VoiceManager.leaveAllRadioChannel);
alt.on('SaltyChat:StartCall', VoiceManager.startCall);
alt.on('SaltyChat:EndCall', VoiceManager.endCall);

export default function loader(startTime: number) {
    VoiceManager.initialize();
    Logger.info(`voice api loaded`);
    Logger.info(`Total Bootup Time -- ${Date.now() - startTime}ms`);
    alt.emit(TlrpEvent.TLRP_READY);
}
