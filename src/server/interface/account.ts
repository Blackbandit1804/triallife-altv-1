import { Permissions } from '../../shared/utility/enums';

export interface Account {
    _id: any;
    discord: string;
    ips: Array<string>;
    hardware: Array<string>;
    lastLogin: number;
    permissionLevel: Permissions;
    quickToken: string;
    quickTokenExpiration: number;
    banned: boolean;
    reason: string;
}

export interface DiscordUser {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    locale: string;
    mfa_enabled: boolean;
}
