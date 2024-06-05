import { is_sym, Sym } from "@stemcmicro/atoms";
import { is_native, Native } from "@stemcmicro/native";
import { Cons2, is_cons, U } from "@stemcmicro/tree";

export function is_power(expr: U): expr is Cons2<Sym, U, U> & { __ts_sym: "MATH_POW" } {
    return is_cons(expr) && is_sym(expr.opr) && is_native(expr.opr, Native.pow);
}
