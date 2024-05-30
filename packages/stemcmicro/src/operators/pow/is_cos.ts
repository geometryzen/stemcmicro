import { is_sym, Sym } from "math-expression-atoms";
import { is_native, Native } from "math-expression-native";
import { Cons, U } from "math-expression-tree";
import { Cons1 } from "../helpers/Cons1";

export function is_cos(expr: Cons): expr is Cons1<Sym, U> {
    const opr = expr.opr;
    if (is_sym(opr)) {
        return is_native(opr, Native.cos);
    } else {
        return false;
    }
}
