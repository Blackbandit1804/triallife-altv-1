import * as alt from 'alt';
import * as native from 'natives';

var Command;
(function (Command) {
    Command[(Command['PluginState'] = 0)] = 'PluginState';
    Command[(Command['Initiate'] = 1)] = 'Initiate';
    Command[(Command['Reset'] = 2)] = 'Reset';
    Command[(Command['Ping'] = 3)] = 'Ping';
    Command[(Command['Pong'] = 4)] = 'Pong';
    Command[(Command['InstanceState'] = 5)] = 'InstanceState';
    Command[(Command['SoundState'] = 6)] = 'SoundState';
    Command[(Command['SelfStateUpdate'] = 7)] = 'SelfStateUpdate';
    Command[(Command['PlayerStateUpdate'] = 8)] = 'PlayerStateUpdate';
    Command[(Command['BulkUpdate'] = 9)] = 'BulkUpdate';
    Command[(Command['RemovePlayer'] = 10)] = 'RemovePlayer';
    Command[(Command['TalkState'] = 11)] = 'TalkState';
    Command[(Command['PlaySound'] = 18)] = 'PlaySound';
    Command[(Command['StopSound'] = 19)] = 'StopSound';
    Command[(Command['PhoneCommunicationUpdate'] = 20)] = 'PhoneCommunicationUpdate';
    Command[(Command['StopPhoneCommunication'] = 21)] = 'StopPhoneCommunication';
    Command[(Command['RadioCommunicationUpdate'] = 30)] = 'RadioCommunicationUpdate';
    Command[(Command['StopRadioCommunication'] = 31)] = 'StopRadioCommunication';
    Command[(Command['RadioTowerUpdate'] = 32)] = 'RadioTowerUpdate';
    Command[(Command['MegaphoneCommunicationUpdate'] = 40)] = 'MegaphoneCommunicationUpdate';
    Command[(Command['StopMegaphoneCommunication'] = 41)] = 'StopMegaphoneCommunication';
})(Command || (Command = {}));

var PluginError;
(function (PluginError) {
    PluginError[(PluginError['OK'] = 0)] = 'OK';
    PluginError[(PluginError['InvalidJson'] = 1)] = 'InvalidJson';
    PluginError[(PluginError['NotConnectedToServer'] = 2)] = 'NotConnectedToServer';
    PluginError[(PluginError['AlreadyInGame'] = 3)] = 'AlreadyInGame';
    PluginError[(PluginError['ChannelNotAvailable'] = 4)] = 'ChannelNotAvailable';
    PluginError[(PluginError['NameNotAvailable'] = 5)] = 'NameNotAvailable';
    PluginError[(PluginError['InvalidValue'] = 6)] = 'InvalidValue';
})(PluginError || (PluginError = {}));

let webView = new alt.WebView('http://resource/client/voice/html/index.html');

webView.unfocus();
webView.isVisible = false;

class PluginCommand {
    constructor(command, serverIdentifier, parameter) {
        this.Command = command;
        this.ServerUniqueIdentifier = serverIdentifier;
        this.Parameter = parameter;
    }
}

class GameInstance {
    constructor(serverIdentifier, name, channelId, channelPassword, soundPack, SwissChannelIds) {
        this.ServerUniqueIdentifier = serverIdentifier;
        this.Name = name;
        this.ChannelId = channelId;
        this.ChannelPassword = channelPassword;
        this.SoundPack = soundPack;
        this.SwissChannelIds = SwissChannelIds;
    }
}

class PlayerState {
    constructor(name, position, voiceRange, isAlive, volumeOverride) {
        this.Name = name;
        this.Position = position;
        this.VoiceRange = voiceRange;
        this.IsAlive = isAlive;
        this.VolumeOverride = volumeOverride;
        this.DistanceCulled = false;
        this.Muffle = null;
    }
}

class SelfState {
    constructor(position, rotation, echo) {
        this.Position = position;
        this.Rotation = rotation;
        this.IsAlive = true;
    }
}

class PhoneCommunication {
    constructor(name, signalStrength, volume, direct, relayedBy) {
        this.Name = name;
        this.SignalStrength = signalStrength;
        this.Volume = volume;
        this.Direct = direct;
        this.RelayedBy = relayedBy;
    }
}

class RadioCommunication {
    constructor(name, senderRadioType, ownRadioType, playerMicClick, direct, isSecondary, relayedBy) {
        this.Name = name;
        this.SenderRadioType = senderRadioType;
        this.OwnRadioType = ownRadioType;
        this.PlayMicClick = playerMicClick;
        this.Secondary = isSecondary;
        this.Direct = direct;
        this.RelayedBy = relayedBy;
        this.Volume = 1.2;
    }
}

class Sound {
    constructor(filename, isLoop, handle) {
        this.Filename = filename;
        this.IsLoop = isLoop;
        this.Handle = handle;
    }
}
class VoiceClient {
    constructor(player, tsName, voiceRange) {
        this.Player = player;
        this.TeamSpeakName = tsName;
        this.VoiceRange = voiceRange;
        this.IsAlive = true;
    }
}
class VoiceManager {
    constructor() {
        this.IsEnabled = false;
        this.ServerUniqueIdentifier = null;
        this.SoundPack = null;
        this.IngameChannel = null;
        this.IngameChannelPassword = null;
        this.SwissChannels = null;
        this.TeamSpeakName = null;
        this.VoiceRange = null;
        this.IsTalking = false;
        this.IsMicrophoneMuted = false;
        this.IsSoundMuted = false;
        this.IsConnected = false;
        this.IsReady = false;
        this.IsInGame = false;
        this.NextUpdate = Date.now();
        this.VoiceClients = new Map();
        this.ClientIdMap = new Map();
        this.radioChannels = [];
        this.RadioTowers = {};
        this.VoiceRanges = [0, 3, 8, 15, 32];

        alt.onServer('SaltyChat_Initialize', this.OnInitialize);
        alt.onServer('SaltyChat_UpdateClient', this.OnUpdateVoiceClient);
        alt.onServer('SaltyChat_Disconnected', this.OnPlayerDisconnect);
        alt.onServer('SaltyChat_PlayerDied', this.OnPlayerDied);
        alt.onServer('SaltyChat_PlayerRevived', this.OnPlayerRevived);
        alt.onServer('SaltyChat_EstablishedCall', this.OnEstablishCall);
        alt.onServer('SaltyChat_EstablishedCallRelayed', this.OnEstablishCallRelayed);
        alt.onServer('SaltyChat_EndCall', this.OnEndCall);
        alt.onServer('SaltyChat_JoinRadioChannel', this.OnSetRadioChannel);
        alt.onServer('SaltyChat_LeaveRadioChannel', this.OnLeaveRadioChannel);
        alt.onServer('SaltyChat_LeaveAllRadioChannels', this.OnLeaveAllRadioChannels);
        alt.onServer('SaltyChat_IsSending', this.OnPlayerIsSending);
        alt.onServer('SaltyChat_IsSendingRelayed', this.OnPlayerIsSendingRelayed);
        alt.onServer('SaltyChat_UpdateRadioTowers', this.OnUpdateRadioTowers);
        alt.onServer('SaltyChat_OnDisconnected', this.OnPluginDisconnected);
        alt.onServer('SaltyChat_OnMessage', this.OnPluginMessage);
        alt.onServer('SaltyChat_OnError', this.OnPluginError);
        alt.onServer('SaltyChat_OnConnected', this.OnPluginConnected);
        alt.everyTick(() => {
            this.OnTick();
        });
    }
    OnInitialize = (tsName, serverIdentifier, soundPack, ingameChannel, ingameChannelPassword, swissChannels, radioTowers) => {
        this.TeamSpeakName = tsName;
        this.ServerUniqueIdentifier = serverIdentifier;
        this.SoundPack = soundPack;
        this.IngameChannel = parseInt(ingameChannel);
        this.IngameChannelPassword = ingameChannelPassword;
        this.IsEnabled = true;
        this.SwissChannels = swissChannels;
    };
    OnUpdateVoiceClient = (playerId, tsName, voiceRange) => {
        if (playerId == null) return;

        if (playerId == alt.Player.local.id) {
            this.VoiceRange = voiceRange;
        } else {
            if (this.VoiceClients.has(playerId)) {
                let voiceClient = this.VoiceClients.get(playerId);
                voiceClient.TeamSpeakName = tsName;
                voiceClient.VoiceRange = voiceRange;
            } else {
                let player = alt.Player.all.find((p) => {
                    return p.id == playerId;
                });
                if (player != undefined) {
                    this.VoiceClients.set(playerId, new VoiceClient(player, tsName, voiceRange));
                    this.ClientIdMap.set(tsName, playerId);
                }
            }
        }
    };
    OnPlayerDisconnect = (playerId) => {
        if (this.VoiceClients.has(playerId)) {
            let voiceClient = this.VoiceClients.get(playerId);
            this.ExecuteCommand(
                new PluginCommand(Command.RemovePlayer, this.ServerUniqueIdentifier, new PlayerState(voiceClient.TeamSpeakName, voiceClient.Player.pos, voiceClient.VoiceRange, false, 0))
            );
            this.VoiceClients.delete(playerId);
            this.ClientIdMap.delete(voiceClient.TeamSpeakName);
        }
    };
    OnPlayerTalking = (teamSpeakName, isTalking) => {
        var player = null;
        var voiceClient = this.VoiceClients.get(this.ClientIdMap.get(teamSpeakName));

        if (voiceClient != null) {
            player = voiceClient.Player;
        } else if (teamSpeakName == this.TeamSpeakName) {
            player = alt.Player.local;
            alt.emitServer('Server:SaltyChat_IsTalking', this.VoiceRange > 0 ? isTalking : false);
            alt.emit('client:SaltyChat_IsTalking', this.VoiceRange > 0 ? isTalking : false);
        }
    };
    OnPlayerDied = (playerHandle) => {
        let playerId = parseInt(playerHandle.id);
        if (this.VoiceClients.has(playerId)) {
            let voiceClient = this.VoiceClients.get(playerId);
            voiceClient.IsAlive = false;
            this.ExecuteCommand(
                new PluginCommand(Command.RemovePlayer, this.ServerUniqueIdentifier, new PlayerState(voiceClient.TeamSpeakName, voiceClient.Player.pos, voiceClient.VoiceRange, false, 0))
            );
        }
    };
    OnPlayerRevived = (playerHandle) => {
        let playerId = parseInt(playerHandle.id);
        if (this.VoiceClients.has(playerId)) {
            let voiceClient = this.VoiceClients.get(playerId);
            voiceClient.IsAlive = true;
            this.ExecuteCommand(
                new PluginCommand(Command.RemovePlayer, this.ServerUniqueIdentifier, new PlayerState(voiceClient.TeamSpeakName, voiceClient.Player.pos, voiceClient.VoiceRange, false, 1.0))
            );
        }
    };
    OnEstablishCall = (player) => {
        let playerId = parseInt(player.id);
        if (this.VoiceClients.has(playerId)) {
            let voiceClient = this.VoiceClients.get(playerId);
            let ownPosition = alt.Player.local.pos;
            let playerPosition = player.pos;
            this.ExecuteCommand(
                new PluginCommand(
                    Command.PhoneCommunicationUpdate,
                    this.ServerUniqueIdentifier,
                    new PhoneCommunication(
                        voiceClient.TeamSpeakName,
                        native.getZoneScumminess(native.getZoneAtCoords(ownPosition.x, ownPosition.y, ownPosition.z)) +
                            native.getZoneScumminess(native.getZoneAtCoords(playerPosition.x, playerPosition.y, playerPosition.z)),
                        1.2,
                        true,
                        null
                    )
                )
            );
        }
    };
    OnEstablishCallRelayed = (player, direct, relayJson) => {
        let playerId = parseInt(player.id);
        let relays = relayJson;
        if (this.VoiceClients.has(playerId)) {
            let voiceClient = this.VoiceClients.get(playerId);
            let ownPosition = alt.Player.local.pos;
            let playerPosition = player.pos;
            this.ExecuteCommand(
                new PluginCommand(
                    Command.PhoneCommunicationUpdate,
                    this.ServerUniqueIdentifier,
                    new PhoneCommunication(
                        voiceClient.TeamSpeakName,
                        native.getZoneScumminess(native.getZoneAtCoords(ownPosition.x, ownPosition.y, ownPosition.z)) +
                            native.getZoneScumminess(native.getZoneAtCoords(playerPosition.x, playerPosition.y, playerPosition.z)),
                        1.2,
                        direct,
                        relays
                    )
                )
            );
        }
    };
    OnEndCall = (playerId) => {
        if (this.VoiceClients.has(playerId)) {
            let voiceClient = this.VoiceClients.get(playerId);
            this.ExecuteCommand(new PluginCommand(Command.StopPhoneCommunication, this.ServerUniqueIdentifier, new PhoneCommunication(voiceClient.TeamSpeakName, null, null, true, null)));
        }
    };
    OnSetRadioChannel = (radioChannel) => {
        if (radioChannel != null && radioChannel != '') {
            this.radioChannels.push(radioChannel);
            alt.emitServer('joinradio', radioChannel);
        }
    };
    OnLeaveRadioChannel = (radioChannel) => {
        if (radioChannel != null && radioChannel != '') {
            this.radioChannels = this.radioChannels.filter((x) => x != radioChannel);
            alt.emitServer('leaveradio', radioChannel);
        }
    };
    OnLeaveAllRadioChannels = async () => {
        for (let index = 0; index < radioChannels.length; index++) {
            const channel = radioChannels[index];
            alt.emitServer('leaveradio', channel);
        }
        this.radioChannels = [];
    };
    OnPlayerIsSending = (playerHandle, channel, isOnRadio) => {
        let playerId = parseInt(playerHandle.id);
        let player = playerHandle;
        if (this.radioChannels.indexOf(channel) !== -1) {
            if (player.id != alt.Player.local.id && this.VoiceClients.has(playerId)) {
                let voiceClient = this.VoiceClients.get(playerId);
                this.ExecuteCommand(
                    new PluginCommand(
                        isOnRadio ? Command.RadioCommunicationUpdate : Command.StopRadioCommunication,
                        this.ServerUniqueIdentifier,
                        new RadioCommunication(voiceClient.TeamSpeakName, 4, 4, false, true, false, [])
                    )
                );
            }
        }
    };
    OnPlayerIsSendingRelayed = (playerHandle, channel, isOnRadio, relayJson) => {
        let playerId = parseInt(playerHandle.id);
        let relays = JSON.parse(relayJson);
        let player = playerHandle;
        if (this.radioChannels.indexOf(channel) !== -1) {
            if (player != alt.Player.local && this.VoiceClients.has(playerId)) {
                let voiceClient = this.VoiceClients.get(playerId);
                this.ExecuteCommand(
                    new PluginCommand(
                        isOnRadio ? Command.RadioCommunicationUpdate : Command.StopRadioCommunication,
                        this.ServerUniqueIdentifier,
                        new RadioCommunication(voiceClient.TeamSpeakName, 4, 4, false, true, false, relays)
                    )
                );
            }
        }
    };
    OnUpdateRadioTowers = (radioTowers) => {
        this.RadioTowers = {};
        this.ExecuteCommand(new PluginCommand(Command.RadioTowerUpdate, this.ServerUniqueIdentifier, this.RadioTowers));
    };
    OnPluginConnected = () => {
        this.IsConnected = true;
        this.IsInGame = true;
        this.IsReady = true;
        this.VoiceRange = this.VoiceRanges[1];
        this.Initiate();
    };
    OnPluginDisconnected = () => {
        alt.log('OnPluginDisconnected');
    };
    OnPluginMessage = (messageJson) => {
        let message = JSON.parse(messageJson);

        if (message.ServerUniqueIdentifier != this.ServerUniqueIdentifier) return;

        if (message.Command == Command.Ping) {
            this.ExecuteCommand(new PluginCommand(Command.Pong, this.ServerUniqueIdentifier, null));
            return;
        }

        if (message.Parameter === typeof 'undefined' || message.Parameter == null) return;

        let parameter = message.Parameter;

        switch (message.Command) {
            case Command.PluginState:
                alt.emitServer('SaltyChat_CheckVersion', parameter.Version);
                this.ExecuteCommand(new PluginCommand(Command.RadioTowerUpdate, this.ServerUniqueIdentifier, this.RadioTowers));
                break;
            case Command.Reset:
                if (this.NextUpdate + 1000 > Date.now()) {
                    this.IsInGame = false;
                    this.Initiate();
                }
                break;
            case Command.InstanceState:
                this.IsConnected = parameter.IsConnectedToServer;
                this.IsInGame = true;
                break;
            case Command.SoundState:
                if (parameter.IsMicrophoneMuted != this.IsMicrophoneMuted) {
                    this.IsMicrophoneMuted = parameter.IsMicrophoneMuted;
                    alt.emitServer('SaltyChat_MicStateChanged', this.IsMicrophoneMuted);
                }

                if (parameter.IsMicrophoneEnabled != this.IsMicrophoneEnabled) {
                    this.IsMicrophoneEnabled = parameter.IsMicrophoneEnabled;
                    alt.emitServer('SaltyChat_MicEnabledChanged', this.IsMicrophoneEnabled);
                }

                if (parameter.IsSoundMuted != this.IsSoundMuted) {
                    this.IsSoundMuted = parameter.IsSoundMuted;
                    alt.emitServer('SaltyChat_SoundStateChanged', this.IsSoundMuted);
                }

                if (parameter.IsSoundEnabled != this.IsSoundEnabled) {
                    this.IsSoundEnabled = parameter.IsSoundEnabled;
                    alt.emitServer('SaltyChat_SoundEnabledChanged', this.IsSoundEnabled);
                }

                break;
            case Command.TalkState:
                this.OnPlayerTalking(parameter.Name, parameter.IsTalking);
                break;
        }
    };
    OnPluginError = (errorJson) => {
        try {
            let error = JSON.parse(errorJson);
            if (error.Error == PluginError.AlreadyInGame) {
                this.Initiate();
            } else {
                alt.log('[Salty Chat] Error: ' + error.Error + ' | Message: ' + error.Message);
            }
        } catch {
            alt.log("[Salty Chat] We got an error, but couldn't deserialize it...");
        }
    };
    OnTick = () => {
        native.disableControlAction(1, 243, true);
        native.disableControlAction(1, 249, true);
        if (this.IsConnected && this.IsInGame && Date.now() > this.NextUpdate) {
            this.PlayerStateUpdate();
            this.NextUpdate = Date.now() + 666;
        }
        if (native.isDisabledControlJustPressed(0, 243)) {
            this.ToggleVoiceRange();
        }
    };
    PlaySound = (fileName, loop, handle) => {
        this.ExecuteCommand(new PluginCommand(Command.PlaySound, this.ServerUniqueIdentifier, new Sound(fileName, loop, handle)));
    };
    StopSound = (handle) => {
        this.ExecuteCommand(new PluginCommand(Command.StopSound, this.ServerUniqueIdentifier, new Sound(handle, false, handle)));
    };
    Initiate = () => {
        if (this.IsEnabled) {
            this.ExecuteCommand(
                new PluginCommand(
                    Command.Initiate,
                    this.ServerUniqueIdentifier,
                    new GameInstance(this.ServerUniqueIdentifier, this.TeamSpeakName, this.IngameChannel, this.IngameChannelPassword, this.SoundPack, this.SwissChannels)
                )
            );
        } else {
            alt.setTimeout(() => {
                this.Initiate();
            }, 500);
        }
    };
    PlayerStateUpdate = () => {
        let playerPosition = alt.Player.local.pos;
        try {
            this.VoiceClients.forEach((voiceClient, playerId) => {
                let nPlayerPosition = voiceClient.Player.pos;
                this.ExecuteCommand(
                    new PluginCommand(
                        Command.PlayerStateUpdate,
                        this.ServerUniqueIdentifier,
                        new PlayerState(voiceClient.TeamSpeakName, nPlayerPosition, voiceClient.VoiceRange, voiceClient.IsAlive, 1.0)
                    )
                );
            });
        } catch (error) {}
        this.ExecuteCommand(new PluginCommand(Command.SelfStateUpdate, this.ServerUniqueIdentifier, new SelfState(playerPosition, native.getGameplayCamRot(0).z, false)));
    };
    ToggleVoiceRange = () => {
        let index = this.VoiceRanges.indexOf(this.VoiceRange);
        let newIndex = null;
        if (index < 0) newIndex = 1;
        else if (index + 1 >= this.VoiceRanges.length) newIndex = 0;
        else newIndex = index + 1;

        this.VoiceRange = this.VoiceRanges[newIndex];
        this.PlayerStateUpdate();
        alt.emitServer('SaltyChat_SetVoiceRange', this.VoiceRange);
    };
    ExecuteCommand = (command) => {
        if (this.IsEnabled && this.IsConnected) {
            webView.emit('salty:runCommand', JSON.stringify(command));
        }
    };
}

let voiceManager = new VoiceManager();

webView.on('SaltyChat_OnDisconnected', voiceManager.OnPluginDisconnected);
webView.on('SaltyChat_OnMessage', voiceManager.OnPluginMessage);
webView.on('SaltyChat_OnError', voiceManager.OnPluginError);
