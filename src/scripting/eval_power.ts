import { Native, native_sym } from 'math-expression-native';
import { Cons, items_to_cons, U } from 'math-expression-tree';
import { ExtensionEnv } from '../env/ExtensionEnv';
import { power_v1 } from '../operators/pow/power_v1';

export function Eval_power(expr: Cons, $: ExtensionEnv): U {
    const baseArg = expr.base;
    const expoArg = expr.expo;
    const expo = $.valueOf(expoArg);
    const base = $.valueOf(baseArg);
    if (base.equals(baseArg) && expo.equals(expoArg)) {
        return power_v1(base, expo, $);
    }
    else {
        // Give other operators a crack based on the changed arguments.
        return $.valueOf(items_to_cons(native_sym(Native.pow), base, expo));
    }
}
