import { Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, Cons2, U } from "@stemcmicro/tree";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";

export function is_mul_2_any_any(expr: Cons): expr is Cons2<Sym, U, U> {
    return is_opr_2_any_any(native_sym(Native.multiply))(expr);
}
