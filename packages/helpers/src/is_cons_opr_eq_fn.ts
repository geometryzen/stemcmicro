import { Native, native_sym } from "@stemcmicro/native";
import { Cons } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

const FN = native_sym(Native.fn);

export function is_cons_opr_eq_fn(expr: Cons): boolean {
    return is_cons_opr_eq_sym(expr, FN);
}
