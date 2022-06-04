import { is_rat } from "../rat/is_rat";
import { Cons } from "../../tree/tree";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_any_rat(expr: Cons): boolean {
    return is_mul_2_any_any(expr) && is_rat(expr.rhs);
}