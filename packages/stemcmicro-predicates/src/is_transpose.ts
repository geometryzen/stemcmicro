import { Native, native_sym } from "@stemcmicro/native";
import { is_cons, U } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

const TRANSPOSE = native_sym(Native.transpose);

export function is_transpose(expr: U): boolean {
    return is_cons(expr) && is_cons_opr_eq_sym(expr, TRANSPOSE);
}
