import { ExtensionEnv } from './env/ExtensionEnv';
import { items_to_cons } from './makeList';
import { mdiv } from './mmul';
import { is_flt } from './operators/flt/is_flt';
import { is_num } from './operators/num/is_num';
import { is_rat } from './operators/rat/is_rat';
import { is_num_and_negative } from './predicates/is_negative_number';
import { FLOOR } from './runtime/constants';
import { create_flt } from './tree/flt/Flt';
import { cadr } from './tree/helpers';
import { bigInt } from './tree/rat/big-integer';
import { negOne, Rat } from './tree/rat/Rat';
import { U } from './tree/tree';

export function Eval_floor(p1: U, $: ExtensionEnv): U {
    const result = yfloor($.valueOf(cadr(p1)), $);
    return result;
}

function yfloor(p1: U, $: ExtensionEnv): U {
    return yyfloor(p1, $);
}

function yyfloor(x: U, $: ExtensionEnv): U {
    if (!is_num(x)) {
        return items_to_cons(FLOOR, x);
    }

    if (is_flt(x)) {
        return create_flt(Math.floor(x.d));
    }

    if (is_rat(x) && x.isInteger()) {
        return x;
    }

    const p3: U = new Rat(mdiv(x.a, x.b), bigInt.one);

    if (is_num_and_negative(x)) {
        return $.add(p3, negOne);
    }
    else {
        return p3;

    }
}
