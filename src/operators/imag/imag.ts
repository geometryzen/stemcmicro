import { ExtensionEnv, LambdaExpr } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { IMAG } from '../../runtime/constants';
import { MATH_MUL } from '../../runtime/ns_math';
import { negOne, zero } from '../../tree/rat/Rat';
import { Cons, items_to_cons, U } from '../../tree/tree';
import { real } from '../real/real';
import { is_sym } from '../sym/is_sym';
/**
 * expr = (real arg)
 * @param expr 
 * @param $ 
 * @returns 
 */
export function Eval_imag(expr: Cons, $: ExtensionEnv): U {

    // Do we evaluate the arguments or real_lambda?
    return imag_lambda(expr.argList, $);
}

/**
 * argList = (arg)
 * @param argList 
 * @param $ 
 * @returns 
 */
export const imag_lambda: LambdaExpr = function (argList: Cons, $: ExtensionEnv) {
    // We could/should check the numbr of arguments.
    const arg = $.valueOf(argList.car);
    return imag(arg, $);
};

/**
 * Im(z) = Re(-i*z) is going to be our strategy in order to reuse the real implementation.
 */
/**
 * 
 * @param z An expression that has already been evaluated.
 * @param $ 
 * @returns 
 */
export function imag(z: U, $: ExtensionEnv): U {
    // The use of the real() function is elegant but it introduces the risk of infinite recursion.
    if (is_sym(z)) {
        if ($.isReal(z)) {
            return zero;
        }
        else {
            return items_to_cons(IMAG, z);
        }
    }
    const neg_imu = $.valueOf(items_to_cons(MATH_MUL, negOne, imu));
    const neg_imu_times_z = $.valueOf(items_to_cons(MATH_MUL, neg_imu, z));
    return real(neg_imu_times_z, $);
}
