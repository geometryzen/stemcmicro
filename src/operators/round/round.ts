import { ExtensionEnv } from '../../env/ExtensionEnv';
import { is_rat_and_integer } from '../../is_rat_and_integer';
import { makeList } from '../../makeList';
import { is_num } from '../num/is_num';
import { ROUND } from '../../runtime/constants';
import { create_flt } from '../../tree/flt/Flt';
import { is_flt } from '../flt/is_flt';
import { cadr } from '../../tree/helpers';
import { create_int } from '../../tree/rat/Rat';
import { Cons, U } from '../../tree/tree';
import { evaluate_as_float } from '../float/float';

export function Eval_round(p1: Cons, $: ExtensionEnv): U {
    const result = yround($.valueOf(cadr(p1)), $);
    return result;
}

function yround(expr: U, $: ExtensionEnv): U {

    if (!is_num(expr)) {
        return makeList(ROUND, expr);
    }

    if (is_flt(expr)) {
        return create_flt(Math.round(expr.d));
    }

    if (is_rat_and_integer(expr)) {
        return expr;
    }

    const retval = evaluate_as_float(expr, $);
    if (is_flt(retval)) {
        return create_int(Math.round(retval.d));
    }
    else {
        return retval;
    }
}
