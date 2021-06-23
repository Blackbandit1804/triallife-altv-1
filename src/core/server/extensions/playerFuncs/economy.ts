import * as alt from 'alt-server';
import { EconomyType } from '../../../shared/utility/enums';
import * as TlrpMath from '../../utility/math';
import save from './save';
import emit from './emit';

function add(player: alt.Player, type: EconomyType, amount: number): boolean {
    if (TlrpMath.isGreater(amount, Number.MAX_SAFE_INTEGER)) amount = Number.MAX_SAFE_INTEGER - 1;
    try {
        const originalValue = type === EconomyType.BANK ? player.data.bank.balance : player.data.inventory.money;
        if (type === EconomyType.BANK) {
            player.data.bank.balance = parseFloat(TlrpMath.add(player.data.bank.balance, amount).toFixed(2));
            if (TlrpMath.isGreater(originalValue, player.data.bank.balance)) {
                player.data.bank.balance = originalValue;
                return false;
            }
            emit.meta(player, 'bank', player.data.bank);
            save.field(player, 'bank', player.data.bank);
            return true;
        } else {
            player.data.inventory.money = parseFloat(TlrpMath.add(player.data.inventory.money, amount).toFixed(2));
            if (TlrpMath.isGreater(originalValue, player.data.inventory.money)) {
                player.data.inventory.money = originalValue;
                return false;
            }
            emit.meta(player, 'inventory', player.data.inventory);
            save.field(player, 'inventory', player.data.inventory);
            return true;
        }
    } catch (err) {
        return false;
    }
}

function sub(player: alt.Player, type: EconomyType, amount: number): boolean {
    if (TlrpMath.isGreater(amount, Number.MAX_SAFE_INTEGER)) amount = Number.MAX_SAFE_INTEGER - 1;
    try {
        const originalValue = type === EconomyType.BANK ? player.data.bank.balance : player.data.inventory.money;
        if (type === EconomyType.BANK) {
            player.data.bank.balance = parseFloat(TlrpMath.sub(player.data.bank.balance, amount).toFixed(2));
            if (!TlrpMath.isLesser(player.data.bank.balance, originalValue)) {
                player.data.bank.balance = originalValue;
                return false;
            }
            emit.meta(player, 'bank', player.data.bank);
            save.field(player, 'bank', player.data.bank);
            return true;
        } else {
            player.data.inventory.money = parseFloat(TlrpMath.sub(player.data.inventory.money, amount).toFixed(2));
            if (!TlrpMath.isLesser(player.data.inventory.money, originalValue)) {
                player.data.inventory.money = originalValue;
                return false;
            }
            emit.meta(player, 'inventory', player.data.inventory);
            save.field(player, 'inventory', player.data.inventory);
            return true;
        }
    } catch (err) {
        return false;
    }
}

function set(player: alt.Player, type: EconomyType, amount: number): boolean {
    if (TlrpMath.isGreater(amount, Number.MAX_SAFE_INTEGER)) amount = Number.MAX_SAFE_INTEGER - 1;
    try {
        if (type === EconomyType.BANK) player.data.bank.balance;
        else player.data.inventory.money = amount;
        emit.meta(player, 'bank', player.data.bank);
        save.field(player, 'inventory', player.data.inventory);
        return true;
    } catch (err) {
        return false;
    }
}

function subAllCurrencies(player: alt.Player, amount: number): boolean {
    if (TlrpMath.add(player.data.inventory.money, player.data.bank.balance) < amount) return false;
    let amountLeft = amount;
    if (TlrpMath.sub(player.data.inventory.money, amountLeft) <= -1) {
        amountLeft = TlrpMath.sub(amountLeft, player.data.inventory.money);
        player.data.inventory.money = 0;
    } else {
        player.data.inventory.money = TlrpMath.sub(player.data.inventory.money, amountLeft);
        amountLeft = 0;
    }
    if (amountLeft >= 1) player.data.bank.balance = TlrpMath.sub(player.data.bank.balance, amountLeft);
    save.field(player, 'inventory', player.data.inventory);
    save.field(player, 'bank', player.data.bank);
    emit.meta(player, 'inventory', player.data.inventory);
    emit.meta(player, 'bank', player.data.bank);
    return true;
}

export default { set, sub, add, subAllCurrencies };
