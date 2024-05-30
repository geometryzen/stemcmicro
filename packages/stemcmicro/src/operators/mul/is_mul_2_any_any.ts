import { Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons, Cons2, U } from "math-expression-tree";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";

export function is_mul_2_any_any(expr: Cons): expr is Cons2<Sym, U, U> {
    return is_opr_2_any_any(native_sym(Native.multiply))(expr);
}
