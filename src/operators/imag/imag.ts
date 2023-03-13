import { ExtensionEnv, LambdaExpr } from '../../env/ExtensionEnv';
import { IMAG } from '../../runtime/constants';
import { Cons, items_to_cons, U } from '../../tree/tree';
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function imag(z: U, $: ExtensionEnv): U {
    return items_to_cons(IMAG, z);
    /*
    // console.lg(`imag`, $.toInfixString(z));
    if (is_sym(z)) {
        if ($.is_real(z)) {
            return zero;
        }
        else {
            return items_to_cons(IMAG, z);
        }
    }
    // The use of the real() function is elegant but it introduces the risk of infinite recursion.
    const neg_imu = $.valueOf(items_to_cons(MATH_MUL, negOne, imu));
    // console.lg(`neg_imu`, $.toInfixString(neg_imu));
    const neg_imu_times_z = $.valueOf(items_to_cons(MATH_MUL, neg_imu, z));
    // console.lg(`neg_imu_times_z`, $.toInfixString(neg_imu_times_z));
    return real(neg_imu_times_z, $);
    */
}
