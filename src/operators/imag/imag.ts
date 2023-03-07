import { ExtensionEnv } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { MATH_MUL } from '../../runtime/ns_math';
import { negOne } from '../../tree/rat/Rat';
import { items_to_cons, U } from '../../tree/tree';
import { real } from '../real/real';

/**
 * Im(z) = Re(-i*z) is going to be our strategy in order to reuse the real implementation.
 */
export function imag(z: U, $: ExtensionEnv): U {
    const neg_imu = $.valueOf(items_to_cons(MATH_MUL, negOne, imu));
    const neg_imu_times_z = $.valueOf(items_to_cons(MATH_MUL, neg_imu, z));
    return real(neg_imu_times_z, $);
}
