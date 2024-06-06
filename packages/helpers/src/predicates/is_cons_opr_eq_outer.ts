import { Native, native_sym } from "@stemcmicro/native";
import { Cons } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

const OUTER = native_sym(Native.outer);

export function is_cons_opr_eq_outer(expr: Cons): boolean {
    return is_cons_opr_eq_sym(expr, OUTER);
}
