import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "./Cons2";
import { GUARD } from "./GUARD";
import { is_opr_2_any_any } from "./is_opr_2_any_any";

export function is_opr_2_any_rhs<R extends U>(sym: Sym, guardR: GUARD<U, R>): (expr: Cons, $: ExtensionEnv) => expr is Cons2<Sym, U, R> {
    return function (expr: Cons, $: ExtensionEnv): expr is Cons2<Sym, U, R> {
        return is_opr_2_any_any(sym)(expr) && guardR(expr.rhs, $);
    };
}