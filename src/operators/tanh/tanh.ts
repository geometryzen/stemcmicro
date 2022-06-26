import { ExtensionEnv } from '../../env/ExtensionEnv';
import { makeList } from '../../makeList';
import { is_flt } from '../flt/is_flt';
import { ARCTANH, TANH } from '../../runtime/constants';
import { wrap_as_flt } from '../../tree/flt/Flt';
import { cadr } from '../../tree/helpers';
import { zero } from '../../tree/rat/Rat';
import { car, U } from '../../tree/tree';

//             exp(2 x) - 1
//  tanh(x) = --------------
//             exp(2 x) + 1
export function Eval_tanh(p1: U, $: ExtensionEnv): U {
    return tanh($.valueOf(cadr(p1)), $);
}

function tanh(p1: U, $: ExtensionEnv): U {
    if (car(p1) === ARCTANH) {
        return cadr(p1);
    }
    if (is_flt(p1)) {
        let d = Math.tanh(p1.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return wrap_as_flt(d);
    }
    if ($.isZero(p1)) {
        return zero;
    }
    return makeList(TANH, p1);
}
