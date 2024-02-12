import { bigInt, create_flt, is_flt, is_num, is_rat, negOne, Rat } from 'math-expression-atoms';
import { items_to_cons, U } from 'math-expression-tree';
import { ExtensionEnv } from './env/ExtensionEnv';
import { mdiv } from './mmul';
import { is_num_and_negative } from './predicates/is_negative_number';
import { FLOOR } from './runtime/constants';
import { cadr } from './tree/helpers';

export function eval_floor(p1: U, $: ExtensionEnv): U {
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
