import { Native, native_sym } from "math-expression-native";
import { Cons, is_nil, items_to_cons, U } from "math-expression-tree";
import { ExtensionEnv } from "../env/ExtensionEnv";
import { power_base_expo } from "../operators/pow/power_base_expo";
import { ProgrammingError } from "../programming/ProgrammingError";

export function eval_power(expr: Cons, $: ExtensionEnv): U {
    const baseArg = expr.base;
    const expoArg = expr.expo;
    if (is_nil(baseArg)) {
        throw new ProgrammingError("base MUST be something.");
    }
    if (is_nil(expoArg)) {
        throw new ProgrammingError("expo MUST be something.");
    }
    try {
        const expo = $.valueOf(expoArg);
        const base = $.valueOf(baseArg);
        try {
            if (base.equals(baseArg) && expo.equals(expoArg)) {
                return power_base_expo(base, expo, $);
            } else {
                // Give other operators a crack based on the changed arguments.
                return $.valueOf(items_to_cons(native_sym(Native.pow), base, expo));
            }
        } finally {
            base.release();
            expo.release();
        }
    } finally {
        baseArg.release();
        expoArg.release();
    }
}
