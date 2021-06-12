import * as alt from 'alt-server';
import { EconomyType } from '../../../shared/enums/economyTypes';
import save from './save';
import emit from './emit';
import * as TlrpMath from '../../utility/math';

function add(player: alt.Player, type: EconomyType, amount: number): boolean {
    if (TlrpMath.isGreater(amount, Number.MAX_SAFE_INTEGER)) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        const originalValue = player.data[type];
        player.data[type] = parseFloat(TlrpMath.add(player.data[type], amount).toFixed(2));

        // Verify that the value was updated.
        if (TlrpMath.isGreater(originalValue, player.data[type])) {
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

function sub(player: alt.Player, type: EconomyType, amount: number): boolean {
    if (TlrpMath.isGreater(amount, Number.MAX_SAFE_INTEGER)) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        const originalValue = player.data[type];
        player.data[type] = parseFloat(TlrpMath.sub(player.data[type], amount).toFixed(2));

        // Verify that the value was updated.
        if (!TlrpMath.isLesser(player.data[type], originalValue)) {
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

function set(player: alt.Player, type: EconomyType, amount: number): boolean {
    if (TlrpMath.isGreater(amount, Number.MAX_SAFE_INTEGER)) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

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
    if (TlrpMath.add(player.data.cash, player.data.bank) < amount) {
        return false;
    }

    let amountLeft = amount;

    if (TlrpMath.sub(player.data.cash, amountLeft) <= -1) {
        amountLeft = TlrpMath.sub(amountLeft, player.data.cash);
        player.data.cash = 0;
    } else {
        player.data.cash = TlrpMath.sub(player.data.cash, amountLeft);
        amountLeft = 0;
    }

    if (amountLeft >= 1) {
        player.data.bank = TlrpMath.sub(player.data.bank, amountLeft);
    }

    save.field(player, EconomyType.CASH, player.data[EconomyType.CASH]);
    save.field(player, EconomyType.BANK, player.data[EconomyType.BANK]);
    emit.meta(player, EconomyType.BANK, player.data[EconomyType.BANK]);
    emit.meta(player, EconomyType.CASH, player.data[EconomyType.CASH]);
    return true;
}

export default {
    set,
    sub,
    add,
    subAllCurrencies
};
