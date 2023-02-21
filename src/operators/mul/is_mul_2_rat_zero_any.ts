import { Cons } from "../../tree/tree";
import { is_rat } from "../rat/rat_extension";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_rat_zero_any(expr: Cons): boolean {
    if (is_mul_2_any_any(expr)) {
        const lhs = expr.lhs;
        return is_rat(lhs) && lhs.isZero();
    }
    return false;
}