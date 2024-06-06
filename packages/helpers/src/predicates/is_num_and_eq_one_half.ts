import { U } from "@stemcmicro/tree";
import { is_num_and_eq_rational } from "./is_num_and_eq_rational";

export function is_num_and_eq_one_half(expr: U): boolean {
    return is_num_and_eq_rational(expr, 1, 2);
}
