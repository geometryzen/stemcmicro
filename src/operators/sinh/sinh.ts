import { ExtensionEnv } from '../../env/ExtensionEnv';
import { items_to_cons } from '../../makeList';
import { ARCSINH, SINH } from '../../runtime/constants';
import { create_flt } from '../../tree/flt/Flt';
import { cadr } from '../../tree/helpers';
import { zero } from '../../tree/rat/Rat';
import { car, U } from '../../tree/tree';
import { is_flt } from '../flt/is_flt';

//            exp(x) - exp(-x)
//  sinh(x) = ----------------
//                   2

/**
 * sinh(x) = (1/2) * (exp(x) - exp(-x))
 */
export function sinh(expr: U, $: ExtensionEnv): U {
    if (car(expr).equals(ARCSINH)) {
        return cadr(expr);
    }
    if (is_flt(expr)) {
        let d = Math.sinh(expr.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return create_flt(d);
    }
    if ($.iszero(expr)) {
        return zero;
    }
    return items_to_cons(SINH, expr);
}
