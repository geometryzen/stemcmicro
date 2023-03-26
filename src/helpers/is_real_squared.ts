import { ExtensionEnv } from "../env/ExtensionEnv";
import { is_power } from "../runtime/helpers";
import { U } from "../tree/tree";
import { is_rat } from "../operators/rat/is_rat";

export function is_real_squared(expr: U, $: ExtensionEnv): boolean {
    if (is_power(expr)) {
        const expo = expr.expo;
        if (is_rat(expo) && expo.isTwo()) {
            const base = expr.base;
            return $.isreal(base);
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
