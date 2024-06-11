import { Native, native_sym } from "@stemcmicro/native";
import { Cons } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

const ADD = native_sym(Native.add);

export function is_cons_opr_eq_add(expr: Cons): boolean {
    return is_cons_opr_eq_sym(expr, ADD);
}
