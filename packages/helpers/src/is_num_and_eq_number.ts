import { is_flt, is_rat } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { is_rat_eq_number } from "./is_rat_eq_number";

export function is_num_and_eq_number(expr: U, n: number): boolean {
    if (expr !== null) {
        if (is_rat(expr)) {
            return is_rat_eq_number(expr, n);
        } else if (is_flt(expr)) {
            return expr.d === n;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
