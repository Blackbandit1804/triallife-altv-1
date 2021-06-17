import { Permission } from '../../shared/utility/enums';

export interface Account {
    _id: any;
    discord: string;
    ips: Array<string>;
    hardware: Array<string>;
    lastLogin: number;
    permissionLevel: Permission;
    quickToken: string;
    quickTokenExpiration: number;
    banned: boolean;
    reason: string;
}
