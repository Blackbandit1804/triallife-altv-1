/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { EconomyTypes } from '../../../shared/enums/economy';
import { TlrpFunctions, TLRP } from '../../utility/tlrpLoader';
import save from './save';
import emit from './emit';

const tlrp = TLRP.getFunctions<TlrpFunctions>('tlrp');

function add(player: alt.Player, type: EconomyTypes, amount: number): boolean {
    if (tlrp.Math.isGreater(amount, Number.MAX_SAFE_INTEGER)) amount = Number.MAX_SAFE_INTEGER - 1;
    try {
        const originalValue = player.data[type];
        player.data[type] = parseFloat(tlrp.Math.add(player.data[type], amount).toFixed(2));
        // Verify that the value was updated.
        if (tlrp.Math.isGreater(originalValue, player.data[type])) {
            player.data[type] = originalValue;
            return false;
        }
        emit.meta(player, type, player.data[type]);
        save.field(player, type, player.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

function sub(player: alt.Player, type: EconomyTypes, amount: number): boolean {
    if (tlrp.Math.isGreater(amount, Number.MAX_SAFE_INTEGER)) amount = Number.MAX_SAFE_INTEGER - 1;
    try {
        const originalValue = player.data[type];
        player.data[type] = parseFloat(tlrp.Math.sub(player.data[type], amount).toFixed(2));
        if (!tlrp.Math.isLesser(player.data[type], originalValue)) {
            player.data[type] = originalValue;
            return false;
        }
        emit.meta(player, type, player.data[type]);
        save.field(player, type, player.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

function set(player: alt.Player, type: EconomyTypes, amount: number): boolean {
    if (tlrp.Math.isGreater(amount, Number.MAX_SAFE_INTEGER)) amount = Number.MAX_SAFE_INTEGER - 1;
    try {
        player.data[type] = amount;
        emit.meta(player, type, player.data[type]);
        save.field(player, type, player.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

function subAllCurrencies(player: alt.Player, amount: number): boolean {
    if (tlrp.Math.add(player.data.cash, player.data.bank) < amount) return false;
    let amountLeft = amount;
    if (tlrp.Math.sub(player.data.cash, amountLeft) <= -1) {
        amountLeft = tlrp.Math.sub(amountLeft, player.data.cash);
        player.data.cash = 0;
    } else {
        player.data.cash = tlrp.Math.sub(player.data.cash, amountLeft);
        amountLeft = 0;
    }
    if (amountLeft >= 1) player.data.bank = tlrp.Math.sub(player.data.bank, amountLeft);
    save.field(player, EconomyTypes.CASH, player.data[EconomyTypes.CASH]);
    save.field(player, EconomyTypes.BANK, player.data[EconomyTypes.BANK]);
    emit.meta(player, EconomyTypes.BANK, player.data[EconomyTypes.BANK]);
    emit.meta(player, EconomyTypes.CASH, player.data[EconomyTypes.CASH]);
    return true;
}

export default {
    set,
    sub,
    add,
    subAllCurrencies
};
