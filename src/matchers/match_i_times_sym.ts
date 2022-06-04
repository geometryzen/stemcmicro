import { ExtensionEnv } from "../env/ExtensionEnv";
import { is_sym } from "../operators/sym/is_sym";
import { is_imu } from "../operators/imu/is_imu";
import { MULTIPLY } from "../runtime/constants";
import { Sym } from "../tree/sym/Sym";
import { Cons } from "../tree/tree";
import { match_binop } from "./match_binop";

/**
 * This is currently dead code. That's probably because the more useful case is to factor out reals.
 */
export function match_i_times_sym(expr: Cons, $: ExtensionEnv): { sym: Sym } | undefined {
    const m = match_binop(MULTIPLY, expr, $);
    if (m) {
        const q = m.lhs;
        const r = m.rhs;
        if (is_sym(r)) {
            if (is_imu(q)) {
                return { sym: r };
            }
        }
    }
    return void 0;
}
