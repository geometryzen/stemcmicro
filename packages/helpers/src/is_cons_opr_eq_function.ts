import { Native, native_sym } from "@stemcmicro/native";
import { Cons } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

const FUNCTION = native_sym(Native.function);

export function is_cons_opr_eq_function(expr: Cons): boolean {
    return is_cons_opr_eq_sym(expr, FUNCTION);
}
