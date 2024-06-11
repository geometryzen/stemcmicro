import { U } from "@stemcmicro/tree";
import { is_num_and_eq_rational } from "./is_num_and_eq_rational";

export function is_num_and_eq_two(expr: U): boolean {
    return is_num_and_eq_rational(expr, 2, 1);
}
