import { ExtensionEnv, TFLAG_KEEP } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { Native } from '../../native/Native';
import { native_sym } from '../../native/native_sym';
import { half } from '../../tree/rat/Rat';
import { items_to_cons, U } from '../../tree/tree';

const e = native_sym(Native.E);
const pow = native_sym(Native.pow);

/**
 * expcos(x) = (1/2)*(exp(x*i)+exp(-x*i))
 */
export function expcos(x: U, $: ExtensionEnv): U {
    const exp_pos_x_times_i = items_to_cons(pow, e, $.multiply(x, imu));
    exp_pos_x_times_i.meta |= TFLAG_KEEP;
    const exp_neg_x_times_i = items_to_cons(pow, e, $.multiply($.negate(x), imu));
    exp_neg_x_times_i.meta |= TFLAG_KEEP;
    return $.multiply(half, $.add(exp_pos_x_times_i, exp_neg_x_times_i));
}
