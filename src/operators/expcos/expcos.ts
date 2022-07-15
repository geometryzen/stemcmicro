import { ExtensionEnv, TFLAG_KEEP } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { MATH_E, MATH_POW } from '../../runtime/ns_math';
import { half } from '../../tree/rat/Rat';
import { items_to_cons, U } from '../../tree/tree';

/**
 * expcos(x) = (1/2)*(exp(x*i)+exp(-x*i))
 */
export function expcos(x: U, $: ExtensionEnv): U {
    const exp_pos_x_times_i = items_to_cons(MATH_POW, MATH_E, $.multiply(x, imu));
    exp_pos_x_times_i.meta |= TFLAG_KEEP;
    const exp_neg_x_times_i = items_to_cons(MATH_POW, MATH_E, $.multiply($.negate(x), imu));
    exp_neg_x_times_i.meta |= TFLAG_KEEP;
    return $.multiply(half, $.add(exp_pos_x_times_i, exp_neg_x_times_i));
}
