import { SharedConfig } from '../../shared/configs/settings';

export const DefaultConfig = {
    WHITELIST: false,
    USE_DISCORD_BOT: false,
    VOICE_ON: SharedConfig.VOICE_ON,
    VOICE_MAX_DISTANCE: 35,
    CHARACTER_SELECT_POS: { x: 36.19486618041992, y: 859.3850708007812, z: 197.71343994140625 },
    CHARACTER_SELECT_ROT: { x: 0, y: 0, z: -0.1943807601928711 },
    PLAYER_MAX_CHARACTER_SLOTS: 5,
    CHARACTER_CREATOR_POS: { x: -673.5911254882812, y: -227.51573181152344, z: 37.090972900390625 },
    CHARACTER_CREATOR_ROT: { x: 0, y: 0, z: 1.302026629447937 },
    PLAYER_NEW_SPAWN_POS: { x: -867.1437377929688, y: -172.6201934814453, z: 37.799232482910156 },
    PLAYER_CASH: 500,
    PLAYER_BANK: 4500,
    RESPAWN_TIME: SharedConfig.RESPAWN_TIME,
    RESPAWN_LOSE_WEAPONS: true,
    RESPAWN_HEALTH: 3500,
    RESPAWN_ARMOUR: 0,
    MAX_INTERACTION_DISTANCE: 3,
    BOOTUP_HOUR: 9,
    BOOTUP_MINUTE: 0,
    MINUTES_PER_MINUTE: 5,
    TIME_BETWEEN_INVENTORY_UPDATES: 10000,
    TIME_BETWEEN_FOOD_UPDATES: 10000,
    WATER_REMOVAL_RATE: 0.08,
    FOOD_REMOVAL_RATE: 0.05,
    MOOD_REMOVAL_RATE: 0.01,
    VALID_HOSPITALS: [
        { x: -248.01309204101562, y: 6332.01513671875, z: 33.0750732421875 },
        { x: 1839.15771484375, y: 3672.702392578125, z: 34.51904296875 },
        { x: 297.4647521972656, y: -584.7089233398438, z: 44.292724609375 },
        { x: -677.0172119140625, y: 311.7821350097656, z: 83.601806640625 },
        { x: 1151.2904052734375, y: -1529.903564453125, z: 36.3017578125 }
    ],
    WEATHER_ROTATION: [
        'EXTRASUNNY',
        'EXTRASUNNY',
        'CLEAR',
        'CLOUDS',
        'OVERCAST',
        'RAIN',
        'THUNDER',
        'RAIN',
        'FOGGY',
        'OVERCAST',
        'CLEARING'
    ],
    TIME_BETWEEN_VEHICLE_UPDATES: 10000,
    TIME_BETWEEN_VEHICLE_SAVES: 30000,
    FUEL_LOSS_PER_PLAYER_TICK: 0.15,
    VEHICLE_DEALERSHIP_SPAWNS: {
        boat: { x: -877.3353271484375, y: -1357.1688232421875, z: 4.00537109375 },
        speedboat: { x: -877.3353271484375, y: -1357.1688232421875, z: 4.00537109375 },
        commercial: { x: 1270.839599609375, y: -3211.898193359375, z: 5.9010396003723145 },
        compact: { x: -11.356627464294434, y: -1085.3214111328125, z: 26.691791534423828 },
        coupe: { x: -11.356627464294434, y: -1085.3214111328125, z: 26.691791534423828 },
        cycle: { x: -1105.5673828125, y: -1688.4227294921875, z: 4.3033366203308105 },
        emergency: { x: 419.75384521484375, y: -1024.2294921875, z: 29.041784286499023 },
        industrial: { x: 1270.839599609375, y: -3211.898193359375, z: 5.9010396003723145 },
        military: { x: -2246.874755859375, y: 3245.732177734375, z: 32.81018829345703 },
        motorcycle: { x: 1770.909912109375, y: 3341.8837890625, z: 41.18528366088867 },
        muscle: { x: -230.79527282714844, y: -1388.4603271484375, z: 31.258228302001953 },
        offroad: { x: 1981.775146484375, y: 3776.6796875, z: 32.18091583251953 },
        aircraft: { x: -1052.5650634765625, y: -2964.5654296875, z: 18.8182373046875 },
        suv: { x: -11.356627464294434, y: -1085.3214111328125, z: 26.691791534423828 },
        sedan: { x: -11.356627464294434, y: -1085.3214111328125, z: 26.691791534423828 },
        service: { x: 419.75384521484375, y: -1024.2294921875, z: 29.041784286499023 },
        sport: { x: -11.356627464294434, y: -1085.3214111328125, z: 26.691791534423828 },
        sportclassic: { x: -11.356627464294434, y: -1085.3214111328125, z: 26.691791534423828 },
        super: { x: -11.356627464294434, y: -1085.3214111328125, z: 26.691791534423828 },
        trailer: { x: 1270.839599609375, y: -3211.898193359375, z: 5.9010396003723145 },
        train: { x: 0, y: 0, z: 0 },
        utility: { x: 1270.839599609375, y: -3211.898193359375, z: 5.9010396003723145 },
        van: { x: -230.79527282714844, y: -1388.4603271484375, z: 31.258228302001953 }
    }
};
