import { Cons } from "../../tree/tree";
import { is_rat } from "../rat/RatExtension";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_rat_one_any(expr: Cons): boolean {
    if (is_mul_2_any_any(expr)) {
        const lhs = expr.lhs;
        return is_rat(lhs) && lhs.isOne();
    }
    return false;
}