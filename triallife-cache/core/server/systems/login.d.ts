import * as alt from 'alt-server';
import { Account, DiscordUser } from '../interface/entities';
import '../views/login';
import './tick';
import './voice';
import './job';
import './marker';
import './textlabel';
export declare class LoginController {
    static tryLogin(player: alt.Player, data: Partial<DiscordUser>, account: Partial<Account>): Promise<void>;
    static tryDisconnect(player: alt.Player, reason: string): void;
    static tryDiscordQuickToken(player: alt.Player, discord: string): Promise<void>;
    static handleNoQuickToken(player: alt.Player): Promise<void>;
}
