import bigInt from 'big-integer';
import { ExtensionEnv } from './env/ExtensionEnv';
import { is_rat_and_integer } from './is_rat_integer';
import { makeList } from './makeList';
import { mdiv } from './mmul';
import { is_flt } from './operators/flt/is_flt';
import { is_num } from './operators/num/is_num';
import { is_negative_number } from './predicates/is_negative_number';
import { FLOOR } from './runtime/constants';
import { create_flt } from './tree/flt/Flt';
import { cadr } from './tree/helpers';
import { negOne, Rat } from './tree/rat/Rat';
import { U } from './tree/tree';

export function Eval_floor(p1: U, $: ExtensionEnv): U {
    const result = yfloor($.valueOf(cadr(p1)), $);
    return result;
}

function yfloor(p1: U, $: ExtensionEnv): U {
    return yyfloor(p1, $);
}

function yyfloor(p1: U, $: ExtensionEnv): U {
    if (!is_num(p1)) {
        return makeList(FLOOR, p1);
    }

    if (is_flt(p1)) {
        return create_flt(Math.floor(p1.d));
    }

    if (is_rat_and_integer(p1)) {
        return p1;
    }

    let p3: U = new Rat(mdiv(p1.a, p1.b), bigInt.one);

    if (is_negative_number(p1)) {
        p3 = $.add(p3, negOne);
    }
    return p3;
}
