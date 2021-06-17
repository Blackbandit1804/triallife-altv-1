import * as alt from 'alt-server';
import { EconomyType } from '../../../shared/utility/enums';
import save from './save';
import emit from './emit';

function add(player: alt.Player, type: EconomyType, amount: number): boolean {
    if (amount > Number.MAX_SAFE_INTEGER) amount = Number.MAX_SAFE_INTEGER - 1;

    try {
        const originalValue = type === EconomyType.BANK ? player.data.bank[0].balance : player.data.money;
        let money: number = type === EconomyType.BANK ? player.data.bank[0].balance + amount : player.data.money + amount;
        if (originalValue > money) {
            money = originalValue;
            if (type === EconomyType.BANK) player.data.bank[0].balance = money;
            else player.data.money = money;
            return false;
        }
        if (type === EconomyType.BANK) player.data.bank[0].balance = money;
        else player.data.money = money;
        emit.meta(player, type, player.data[type]);
        save.field(player, type, player.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

function sub(player: alt.Player, type: EconomyType, amount: number): boolean {
    if (amount > Number.MAX_SAFE_INTEGER) amount = Number.MAX_SAFE_INTEGER - 1;
    try {
        const originalValue = type === EconomyType.BANK ? player.data.bank[0].balance : player.data.money;
        let money: number = type === EconomyType.BANK ? player.data.bank[0].balance - amount : player.data.money - amount;
        if (money > originalValue) {
            money = originalValue;
            if (type === EconomyType.BANK) player.data.bank[0].balance = money;
            else player.data.money = money;
            return false;
        }
        if (type === EconomyType.BANK) player.data.bank[0].balance = money;
        else player.data.money = money;
        emit.meta(player, type, player.data[type]);
        save.field(player, type, player.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

function set(player: alt.Player, type: EconomyType, amount: number): boolean {
    if (amount > Number.MAX_SAFE_INTEGER) amount = Number.MAX_SAFE_INTEGER - 1;
    try {
        if (type === EconomyType.BANK) player.data.bank[0].balance = amount;
        else player.data.money = amount;
        emit.meta(player, type, player.data[type]);
        save.field(player, type, player.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

function subAllCurrencies(player: alt.Player, amount: number): boolean {
    if (player.data.money + player.data.bank[0].balance < amount) {
        return false;
    }
    let amountLeft = amount;
    if (player.data.money - amountLeft <= -1) {
        amountLeft = amountLeft - player.data.money;
        player.data.money = 0;
    } else {
        player.data.money = player.data.money - amountLeft;
        amountLeft = 0;
    }
    if (amountLeft >= 1) {
        player.data.bank[0].balance = player.data.bank[0].balance - amountLeft;
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
