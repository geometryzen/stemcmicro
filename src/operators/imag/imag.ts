import { ExprContext, LambdaExpr } from 'math-expression-context';
import { Cons, items_to_cons, U } from 'math-expression-tree';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { IMAG } from '../../runtime/constants';
/**
 * expr = (real arg)
 * @param expr 
 * @param $ 
 * @returns 
 */
export function eval_imag(expr: Cons, $: ExtensionEnv): U {

    // Do we evaluate the arguments or real_lambda?
    return imag_lambda(expr.argList, $);
}

/**
 * argList = (arg)
 * @param argList 
 * @param $ 
 * @returns 
 */
export const imag_lambda: LambdaExpr = function (argList: Cons, $: ExprContext): U {
    const env: ExtensionEnv = $ as unknown as ExtensionEnv;
    // We could/should check the numbr of arguments.
    const arg = env.valueOf(argList.car);
    return im(arg, env);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function im(z: U, $: ExtensionEnv): U {
    return items_to_cons(IMAG, z);
    /*
    // console.lg(`imag`, $.toInfixString(z));
    if (is_sym(z)) {
        if ($.is_real(z)) {
            return zero;
        }
        else {
            return items_to_cons(IM, z);
        }
    }
    // The use of the re() function is elegant but it introduces the risk of infinite recursion.
    const neg_imu = $.valueOf(items_to_cons(MATH_MUL, negOne, imu));
    // console.lg(`neg_imu`, $.toInfixString(neg_imu));
    const neg_imu_times_z = $.valueOf(items_to_cons(MATH_MUL, neg_imu, z));
    // console.lg(`neg_imu_times_z`, $.toInfixString(neg_imu_times_z));
    return re(neg_imu_times_z, $);
    */
}
