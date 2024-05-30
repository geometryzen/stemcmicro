import { ExtensionEnv } from "../env/ExtensionEnv";
import { is_rat } from "../operators/rat/is_rat";
import { is_real_squared } from "./is_real_squared";
import { Cons } from "../tree/tree";

export function is_square_root_of_real_squared(powerExpr: Cons, $: ExtensionEnv): boolean {
    const expo = powerExpr.expo;
    if (is_rat(expo) && expo.isHalf()) {
        const base = powerExpr.lhs;
        return is_real_squared(base, $);
    } else {
        return false;
    }
}
