import { ExtensionEnv } from "../env/ExtensionEnv";
import { is_num } from "../operators/num/is_num";
import { is_sym } from "../operators/sym/is_sym";
import { MULTIPLY } from "../runtime/constants";
import { Num } from "../tree/num/Num";
import { Sym } from "../tree/sym/Sym";
import { Cons } from "../tree/tree";
import { match_binop } from "./match_binop";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function match_num_times_sym(expr: Cons, $: ExtensionEnv): { k: Num, sym: Sym } | undefined {
    const m = match_binop(MULTIPLY, expr);
    if (m) {
        const q = m.lhs;
        const r = m.rhs;
        if (is_sym(r)) {
            if (is_num(q)) {
                return { k: q, sym: r };
            }
        }
    }
    return void 0;
}
