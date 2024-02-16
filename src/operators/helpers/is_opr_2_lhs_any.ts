import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "./Cons2";
import { GUARD } from "./GUARD";
import { is_opr_2_any_any } from "./is_opr_2_any_any";

export function is_opr_2_lhs_any<L extends U>(sym: Sym, guardL: GUARD<U, L>): (expr: Cons, $: ExtensionEnv) => expr is Cons2<Sym, L, U> {
    return function (expr: Cons, $: ExtensionEnv): expr is Cons2<Sym, L, U> {
        return is_opr_2_any_any(sym)(expr) && guardL(expr.lhs, $);
    };
}