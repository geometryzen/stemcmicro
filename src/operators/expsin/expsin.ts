import { divide } from '../../helpers/divide';
import { ExtensionEnv, TFLAG_KEEP } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { MATH_E, MATH_POW } from '../../runtime/ns_math';
import { cadr } from '../../tree/helpers';
import { half } from '../../tree/rat/Rat';
import { items_to_cons, U } from '../../tree/tree';

// Do the exponential sine function.
export function Eval_expsin(p1: U, $: ExtensionEnv): U {
    return expsin($.valueOf(cadr(p1)), $);
}

export function expsin(x: U, $: ExtensionEnv): U {
    const exp_pos_ix = items_to_cons(MATH_POW, MATH_E, $.multiply(imu, x));
    exp_pos_ix.meta |= TFLAG_KEEP;
    const exp_neg_ix = items_to_cons(MATH_POW, MATH_E, $.multiply($.negate(imu), x));
    exp_neg_ix.meta |= TFLAG_KEEP;
    return $.subtract($.multiply(divide(exp_pos_ix, imu, $), half), $.multiply(divide(exp_neg_ix, imu, $), half));
}
