import { ExtensionEnv } from '../env/ExtensionEnv';
import { power_v1 } from '../operators/pow/power_v1';
import { MATH_POW } from '../runtime/ns_math';
import { Cons, items_to_cons, U } from '../tree/tree';

export function Eval_power(expr: Cons, $: ExtensionEnv): U {
    // console.lg("Eval_power", $.toInfixString(expr));
    const argList = expr.argList;
    const baseArg = argList.car;
    const expoArg = argList.cdr.car;
    const base = $.valueOf(baseArg);
    const expo = $.valueOf(expoArg);
    // console.lg("base", $.toInfixString(base));
    // console.lg("expo", $.toInfixString(expo));
    if (base.equals(baseArg) && expo.equals(expoArg)) {
        return power_v1(base, expo, $);
    }
    else {
        return $.valueOf(items_to_cons(MATH_POW, base, expo));
    }
}
