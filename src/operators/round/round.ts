import { create_int } from 'math-expression-atoms';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { is_rat_and_integer } from '../../is_rat_and_integer';
import { items_to_cons } from '../../makeList';
import { ROUND } from '../../runtime/constants';
import { create_flt } from '../../tree/flt/Flt';
import { cadr } from '../../tree/helpers';
import { Cons, U } from '../../tree/tree';
import { evaluate_as_float } from '../float/float';
import { is_flt } from '../flt/is_flt';
import { is_num } from '../num/is_num';

export function Eval_round(p1: Cons, $: ExtensionEnv): U {
    const result = yround($.valueOf(cadr(p1)), $);
    return result;
}

function yround(expr: U, $: ExtensionEnv): U {

    if (!is_num(expr)) {
        return items_to_cons(ROUND, expr);
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
