import * as alt from 'alt-client';
import * as native from 'natives';

class VoiceManager {
    public IsEnabled: boolean = false;
    public ServerUniqueIdentifier: string = null;
    public SoundPack: string = null;
    public IngameChannel: number = null;
    public IngameChannelPassword: string = null;
    public TeamSpeakName: string = null;
    public VoiceRange: number = null;
    public RadioChannel: string = null;
    public IsTalking: boolean = false;
    public IsMicrophoneMuted: boolean = false;
    public IsSoundMuted: boolean = false;
    private Cef: alt.WebView = null;
    private IsConnected: boolean = false;
    private IsInGame: boolean = false;
    private NextUpdate: number = Date.now();
    private VoiceClients = new Map();
    static VoiceRanges: number[] = [0.0, 3.0, 8.0, 15.0, 32.0];

    constructor() {
        alt.onServer('SaltyChat_Initialize', this.OnInitialize);
        alt.onServer('SaltyChat_UpdateClient', (playerHandle: string, tsName: string, voiceRange: number) => this.OnUpdateVoiceClient(playerHandle, tsName, voiceRange));
        alt.onServer('SaltyChat_Disconnected', (playerHandle: string) => this.OnPlayerDisconnect(playerHandle));
        alt.onServer('SaltyChat_IsTalking', (playerHandle: string, isTalking: boolean) => this.OnPlayerTalking(playerHandle, isTalking));
        alt.onServer('SaltyChat_PlayerDied', (playerHandle: string) => this.OnPlayerDied(playerHandle));
        alt.onServer('SaltyChat_PlayerRevived', (playerHandle: string) => this.OnPlayerRevived(playerHandle));
        // Phone Handling
        alt.onServer('SaltyChat_EstablishedCall', (playerHandle: string) => this.OnEstablishCall(playerHandle));
        alt.onServer('SaltyChat_EstablishedCallRelayed', (playerHandle: string, direct: boolean, relayJson: string) => this.OnEstablishCallRelayed(playerHandle, direct, relayJson));
        alt.onServer('SaltyChat_EndCall', (playerHandle: string) => this.OnEndCall(playerHandle));
        // Radio Handling
        alt.onServer('SaltyChat_SetRadioChannel', (radioChannel: string) => this.OnSetRadioChannel(radioChannel));
        alt.onServer('SaltyChat_IsSending', (playerHandle: string, isOnRadio: boolean) => this.OnPlayerIsSending(playerHandle, isOnRadio));
        alt.onServer('SaltyChat_IsSendingRelayed', (playerHandle: string, isOnRadio: boolean, stateChange: boolean, direct: boolean, relayJson: string) =>
            this.OnPlayerIsSendingRelayed(playerHandle, isOnRadio, stateChange, direct, relayJson)
        );
        alt.onServer('SaltyChat_UpdateRadioTowers', (radioTowerJson: string) => this.OnUpdateRadioTowers(radioTowerJson));
        // Plugin Handling
        alt.on('SaltyChat_OnConnected', () => this.OnPluginConnected());
        alt.on('SaltyChat_OnDisconnected', () => this.OnPluginDisconnected());
        alt.on('SaltyChat_OnMessage', (messageJson: string) => this.OnPluginMessage(messageJson));
        alt.on('SaltyChat_OnError', (errorJson: string) => this.OnPluginError(errorJson));
        // On tick
        alt.everyTick(() => this.OnTick);
    }

    private OnInitialize(tsName: string, serverIdentifier: string, soundPack: string, ingameChannel: string, ingameChannelPassword: string): void {
        this.TeamSpeakName = tsName;
        this.ServerUniqueIdentifier = serverIdentifier;
        this.SoundPack = soundPack;
        this.IngameChannel = parseInt(ingameChannel);
        this.IngameChannelPassword = ingameChannelPassword;

        this.IsEnabled = true;
        this.Cef = new alt.WebView('http://resource/client/views/voice/html/index.html');
        this.Cef.unfocus();
        this.Cef.isVisible = false;
    }

    private OnUpdateVoiceClient(playerHandle: string, tsName: string, voiceRange: number): void {
        let playerId: number = parseInt(playerHandle);
        let player: alt.Player = alt.Player.getByID(playerId);
        if (!player) return;
        if (player == alt.Player.local) {
            this.VoiceRange = voiceRange;
            alt.Player.local.meta.voice = voiceRange;
        } else {
            if (this.VoiceClients.has(playerId)) {
                let voiceClient: VoiceClient = this.VoiceClients.get(playerId);
                voiceClient.TeamSpeakName = tsName;
                voiceClient.VoiceRange = voiceRange;
            } else this.VoiceClients.set(playerId, new VoiceClient(player, tsName, voiceRange, true));
        }
    }

    private OnPlayerDisconnect(playerHandle: string): void {
        let playerId: number = parseInt(playerHandle);
        if (this.VoiceClients.has(playerId)) {
            let voiceClient: VoiceClient = this.VoiceClients.get(playerId);
            this.ExecuteCommand(new PluginCommand(Command.RemovePlayer, this.ServerUniqueIdentifier, new PlayerState(voiceClient.TeamSpeakName, null, null, null, false, null)));
            this.VoiceClients.delete(playerId);
        }
    }

    private OnPlayerTalking(playerHandle: string, isTalking: boolean): void {
        let playerId: number = parseInt(playerHandle);
        let player: alt.Player = alt.Player.getByID(playerId);
        if (player == null) return;
        if (isTalking) native.playFacialAnim(player.scriptID, 'mic_chatter', 'mp_facial');
        else native.playFacialAnim(player.scriptID, 'mood_normal_1', 'facials@gen_male@variations@normal');
    }

    private OnPlayerDied(playerHandle: string): void {
        let playerId: number = parseInt(playerHandle);
        if (this.VoiceClients.has(playerId)) {
            let voiceClient: VoiceClient = this.VoiceClients.get(playerId);
            voiceClient.IsAlive = false;
        }
    }

    private OnPlayerRevived(playerHandle: string): void {
        let playerId: number = parseInt(playerHandle);
        if (this.VoiceClients.has(playerId)) {
            let voiceClient: VoiceClient = this.VoiceClients.get(playerId);
            voiceClient.IsAlive = true;
        }
    }

    private OnEstablishCall(playerHandle: string): void {
        let playerId: number = parseInt(playerHandle);
        if (this.VoiceClients.has(playerId)) {
            let voiceClient: VoiceClient = this.VoiceClients.get(playerId);
            let player: alt.Player = alt.Player.getByID(playerId);
            let ownPosition: alt.Vector3 = alt.Player.local.pos;
            let playerPosition: alt.Vector3 = player.pos;
            this.ExecuteCommand(
                new PluginCommand(
                    Command.PhoneCommunicationUpdate,
                    this.ServerUniqueIdentifier,
                    new PhoneCommunication(
                        voiceClient.TeamSpeakName,
                        native.getZoneScumminess(native.getZoneAtCoords(ownPosition.x, ownPosition.y, ownPosition.z)) +
                            native.getZoneScumminess(native.getZoneAtCoords(playerPosition.x, playerPosition.y, playerPosition.z)),
                        null,
                        true,
                        null
                    )
                )
            );
        }
    }

    private OnEstablishCallRelayed(playerHandle: string, direct: boolean, relayJson: string): void {
        let playerId: number = parseInt(playerHandle);
        let relays: string[] = JSON.parse(relayJson);
        if (this.VoiceClients.has(playerId)) {
            let voiceClient: VoiceClient = this.VoiceClients.get(playerId);
            let player: alt.Player = alt.Player.getByID(playerId);
            let ownPosition: alt.Vector3 = alt.Player.local.pos;
            let playerPosition: alt.Vector3 = player.pos;
            this.ExecuteCommand(
                new PluginCommand(
                    Command.PhoneCommunicationUpdate,
                    this.ServerUniqueIdentifier,
                    new PhoneCommunication(
                        voiceClient.TeamSpeakName,
                        native.getZoneScumminess(native.getZoneAtCoords(ownPosition.x, ownPosition.y, ownPosition.z)) +
                            native.getZoneScumminess(native.getZoneAtCoords(playerPosition.x, playerPosition.y, playerPosition.z)),
                        null,
                        direct,
                        relays
                    )
                )
            );
        }
    }

    private OnEndCall(playerHandle: string): void {
        let playerId: number = parseInt(playerHandle);
        if (this.VoiceClients.has(playerId)) {
            let voiceClient: VoiceClient = this.VoiceClients.get(playerId);
            this.ExecuteCommand(new PluginCommand(Command.StopPhoneCommunication, this.ServerUniqueIdentifier, new PhoneCommunication(voiceClient.TeamSpeakName, null, null, true, null)));
        }
    }

    private OnSetRadioChannel(radioChannel: string): void {
        if (typeof radioChannel === 'string' && radioChannel != '') {
            this.RadioChannel = radioChannel;
            this.PlaySound('enterRadioChannel', false, 'radio');
        } else {
            this.RadioChannel = null;
            this.PlaySound('leaveRadioChannel', false, 'radio');
        }
    }

    private OnPlayerIsSending(playerHandle: string, isOnRadio: boolean): void {
        let playerId: number = parseInt(playerHandle);
        let player: alt.Player = alt.Player.getByID(playerId);
        if (player == alt.Player.local) this.PlaySound('selfMicClick', false, 'MicClick');
        else if (this.VoiceClients.has(playerId)) {
            let voiceClient: VoiceClient = this.VoiceClients.get(playerId);
            if (isOnRadio) {
                this.ExecuteCommand(
                    new PluginCommand(
                        Command.RadioCommunicationUpdate,
                        this.ServerUniqueIdentifier,
                        new RadioCommunication(voiceClient.TeamSpeakName, RadioType.LongRange | RadioType.Distributed, RadioType.LongRange | RadioType.Distributed, true, null, true, null)
                    )
                );
            } else {
                this.ExecuteCommand(
                    new PluginCommand(
                        Command.StopRadioCommunication,
                        this.ServerUniqueIdentifier,
                        new RadioCommunication(voiceClient.TeamSpeakName, RadioType.None, RadioType.None, true, null, true, null)
                    )
                );
            }
        }
    }

    private OnPlayerIsSendingRelayed(playerHandle: string, isOnRadio: boolean, stateChange: boolean, direct: boolean, relayJson: string): void {
        let playerId: number = parseInt(playerHandle);
        let relays: string[] = JSON.parse(relayJson);
        let player: alt.Player = alt.Player.getByID(playerId);
        if (player == alt.Player.local) this.PlaySound('selfMicClick', false, 'MicClick');
        else if (this.VoiceClients.has(playerId)) {
            let voiceClient: VoiceClient = this.VoiceClients.get(playerId);
            if (isOnRadio) {
                this.ExecuteCommand(
                    new PluginCommand(
                        Command.RadioCommunicationUpdate,
                        this.ServerUniqueIdentifier,
                        new RadioCommunication(
                            voiceClient.TeamSpeakName,
                            RadioType.LongRange | RadioType.Distributed,
                            RadioType.LongRange | RadioType.Distributed,
                            stateChange,
                            null,
                            direct,
                            relays
                        )
                    )
                );
            } else {
                this.ExecuteCommand(
                    new PluginCommand(
                        Command.StopRadioCommunication,
                        this.ServerUniqueIdentifier,
                        new RadioCommunication(voiceClient.TeamSpeakName, RadioType.None, RadioType.None, stateChange, null, true, null)
                    )
                );
            }
        }
    }

    private OnUpdateRadioTowers(radioTowerJson: string): void {
        let radioTowers: alt.Vector3[] = JSON.parse(radioTowerJson);
        this.ExecuteCommand(new PluginCommand(Command.RadioTowerUpdate, this.ServerUniqueIdentifier, new RadioTower(radioTowers)));
    }

    private OnPluginConnected(): void {
        this.IsConnected = true;
        this.Initiate();
    }

    private OnPluginDisconnected(): void {
        this.IsConnected = false;
    }

    private OnPluginMessage(messageJson: string): void {
        let message = JSON.parse(messageJson);
        if (message.ServerUniqueIdentifier != this.ServerUniqueIdentifier) return;
        if (message.Command == Command.Ping && this.NextUpdate + 1000 > Date.now()) {
            this.ExecuteCommand(new PluginCommand(Command.Pong, this.ServerUniqueIdentifier, null));
            return;
        }
        if (message.Parameter === typeof 'undefined' || message.Parameter == null) return;
        let parameter = message.Parameter;
        if (parameter.IsReady && !this.IsInGame) {
            alt.emitServer('SaltyChat_CheckVersion', parameter.UpdateBranch, parameter.Version);
            this.IsInGame = parameter.IsReady;
        }
        if (parameter.IsTalking != this.IsTalking) {
            this.IsTalking = parameter.IsTalking;
            alt.emitServer('SaltyChat_IsTalking', this.IsTalking);
        }
        if (parameter.IsMicrophoneMuted != this.IsMicrophoneMuted) this.IsMicrophoneMuted = parameter.IsMicrophoneMuted;
        if (parameter.IsSoundMuted != this.IsSoundMuted) this.IsSoundMuted = parameter.IsSoundMuted;
    }

    private OnPluginError(errorJson: string): void {
        try {
            let error = JSON.parse(errorJson);
            if (error.Error == PluginError.AlreadyInGame) this.Initiate();
            else alt.log('[Salty Chat] Error: ' + error.Error + ' | Message: ' + error.Message);
        } catch {
            alt.log("[Salty Chat] We got an error, but couldn't deserialize it...");
        }
    }

    private OnTick(): void {
        native.disableControlAction(1, 243, true); // disable ^ - voice range
        native.disableControlAction(1, 249, true); // disable N - radio
        if (this.IsConnected && this.IsInGame && Date.now() > this.NextUpdate) {
            this.PlayerStateUpdate();
            this.NextUpdate = Date.now() + 300;
        }
        if (this.RadioChannel != null) {
            if (native.isDisabledControlJustPressed(1, 249)) alt.emitServer('SaltyChat_IsSending', this.RadioChannel, true);
            else if (native.isDisabledControlJustReleased(1, 249)) alt.emitServer('SaltyChat_IsSending', this.RadioChannel, false);
        }
        if (native.isDisabledControlJustPressed(0, 243)) this.ToggleVoiceRange();
    }

    public PlaySound(fileName: string, loop: boolean, handle: string) {
        this.ExecuteCommand(new PluginCommand(Command.PlaySound, this.ServerUniqueIdentifier, new Sound(fileName, loop, handle)));
    }

    public StopSound(handle: string) {
        this.ExecuteCommand(new PluginCommand(Command.StopSound, this.ServerUniqueIdentifier, new Sound(handle, false, handle)));
    }

    private Initiate(): void {
        this.ExecuteCommand(
            new PluginCommand(
                Command.Initiate,
                this.ServerUniqueIdentifier,
                new GameInstance(this.ServerUniqueIdentifier, this.TeamSpeakName, this.IngameChannel, this.IngameChannelPassword, this.SoundPack)
            )
        );
    }

    private PlayerStateUpdate(): void {
        let playerPosition: alt.Vector3 = alt.Player.local.pos;
        this.VoiceClients.forEach((voiceClient: VoiceClient, playerId: number) => {
            let nPlayerPosition: alt.Vector3 = voiceClient.Player.pos;
            this.ExecuteCommand(
                new PluginCommand(
                    Command.PlayerStateUpdate,
                    this.ServerUniqueIdentifier,
                    new PlayerState(voiceClient.TeamSpeakName, nPlayerPosition, null, voiceClient.VoiceRange, voiceClient.IsAlive, null)
                )
            );
        });
        this.ExecuteCommand(new PluginCommand(Command.SelfStateUpdate, this.ServerUniqueIdentifier, new PlayerState(null, playerPosition, native.getGameplayCamRot(0).z, null, false, null)));
    }

    private ToggleVoiceRange(): void {
        let index: number = VoiceManager.VoiceRanges.indexOf(this.VoiceRange);
        if (index < 0) alt.emitServer('SaltyChat_SetVoiceRange', VoiceManager.VoiceRanges[1]);
        else if (index + 1 >= VoiceManager.VoiceRanges.length) alt.emitServer('SaltyChat_SetVoiceRange', VoiceManager.VoiceRanges[0]);
        else alt.emitServer('SaltyChat_SetVoiceRange', VoiceManager.VoiceRanges[index + 1]);
    }

    private ExecuteCommand(command: PluginCommand): void {
        if (this.IsEnabled && this.IsConnected) {
            this.Cef.emit("runCommand('" + JSON.stringify(command) + "')");
        }
    }
}

let voiceManager: VoiceManager = new VoiceManager();

enum Command {
    Initiate = 0,
    Ping = 1,
    Pong = 2,
    StateUpdate = 3,
    SelfStateUpdate = 4,
    PlayerStateUpdate = 5,
    RemovePlayer = 6,
    PhoneCommunicationUpdate = 7,
    StopPhoneCommunication = 8,
    RadioTowerUpdate = 9,
    RadioCommunicationUpdate = 10,
    StopRadioCommunication = 11,
    PlaySound = 12,
    StopSound = 13
}

enum PluginError {
    OK = 0,
    InvalidJson = 1,
    NotConnectedToServer = 2,
    AlreadyInGame = 3,
    ChannelNotAvailable = 4,
    NameNotAvailable = 5,
    InvalidValue = 6
}

enum UpdateBranch {
    Stable = 0,
    Testing = 1,
    PreBuild = 2
}

enum RadioType {
    None = 1 << 0,
    ShortRange = 1 << 1,
    LongRange = 1 << 2,
    Distributed = 1 << 3,
    UltraShortRange = 1 << 4
}

class PluginCommand {
    public Command: Command;
    public ServerUniqueIdentifier: string;
    public Parameter: object;
    constructor(command: Command, serverIdentifier: string, parameter: object) {
        this.Command = command;
        this.ServerUniqueIdentifier = serverIdentifier;
        this.Parameter = parameter;
    }
    public Serialize(): string {
        return JSON.stringify(this);
    }
}

class GameInstance {
    public ServerUniqueIdentifier: string;
    public Name: string;
    public ChannelId: number;
    public ChannelPassword: string;
    public SoundPack: string;

    constructor(serverIdentifier: string, name: string, channelId: number, channelPassword: string, soundPack: string) {
        this.ServerUniqueIdentifier = serverIdentifier;
        this.Name = name;
        this.ChannelId = channelId;
        this.ChannelPassword = channelPassword;
        this.SoundPack = soundPack;
    }
}

class PlayerState {
    public Name: string;
    public Position: alt.Vector3;
    public Rotation: number;
    public VoiceRange: number;
    public IsAlive: boolean;
    public VolumeOverride: number;

    constructor(name: string, position: alt.Vector3, rotation: number, voiceRange: number, isAlive: boolean, volumeOverride: number) {
        this.Name = name;
        this.Position = position;
        this.Rotation = rotation;
        this.VoiceRange = voiceRange;
        this.IsAlive = isAlive;
        this.VolumeOverride = volumeOverride;
    }
}

class PhoneCommunication {
    public Name: string;
    public SignalStrength: number;
    public Volume: number;
    public Direct: boolean;
    public RelayedBy: string[];

    constructor(name: string, signalStrength: number, volume: number, direct: boolean, relayedBy: string[]) {
        this.Name = name;
        this.SignalStrength = signalStrength;
        this.Volume = volume;
        this.Direct = direct;
        this.RelayedBy = relayedBy;
    }
}

class RadioCommunication {
    public Name: string;
    public SenderRadioType: RadioType;
    public OwnRadioType: RadioType;
    public PlayMicClick: boolean;
    public Volume: number;
    public Direct: boolean;
    public RelayedBy: string[];

    constructor(name: string, senderRadioType: RadioType, ownRadioType: RadioType, playerMicClick: boolean, volume: number, direct: boolean, relayedBy: string[]) {
        this.Name = name;
        this.SenderRadioType = senderRadioType;
        this.OwnRadioType = ownRadioType;
        this.PlayMicClick = playerMicClick;
        this.Volume = volume;
        this.Direct = direct;
        this.RelayedBy = relayedBy;
    }
}

class RadioTower {
    public Towers: alt.Vector3[];

    constructor(towers: alt.Vector3[]) {
        this.Towers = towers;
    }
}

class Sound {
    public Filename: string;
    public IsLoop: boolean;
    public Handle: string;

    constructor(filename: string, isLoop: boolean, handle: string) {
        this.Filename = filename;
        this.IsLoop = isLoop;
        this.Handle = handle;
    }
}

class VoiceClient {
    public Player: alt.Player;
    public TeamSpeakName: string;
    public VoiceRange: number;
    public IsAlive: boolean;

    constructor(player: alt.Player, tsName: string, voiceRange: number, isAlive: boolean) {
        this.Player = player;
        this.TeamSpeakName = tsName;
        this.VoiceRange = voiceRange;
        this.IsAlive = isAlive;
    }
}
