/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { Account } from '../../interface/entities';
import { ActionMenu } from '../../../shared/interfaces/actions';
declare function account(player: alt.Player, account: Partial<Account>): Promise<void>;
declare function actionMenu(player: alt.Player, actionMenu: ActionMenu): void;
declare function unconscious(player: alt.Player, killer?: alt.Player, weaponHash?: any): void;
declare function firstConnect(player: alt.Player): Promise<void>;
declare function frozen(player: alt.Player, value: boolean): void;
declare function respawned(player: alt.Player, position?: alt.Vector3): void;
declare const _default: {
    account: typeof account;
    actionMenu: typeof actionMenu;
    unconscious: typeof unconscious;
    firstConnect: typeof firstConnect;
    frozen: typeof frozen;
    respawned: typeof respawned;
};
export default _default;
