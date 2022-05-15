import { Cons } from "../../tree/tree";
import { is_rat } from "../rat/RatExtension";
import { is_add_2_any_any } from "./is_add_2_any_any";

export function is_add_2_any_zero(expr: Cons): boolean {
    if (is_add_2_any_any(expr)) {
        const rhs = expr.item(2);
        if (is_rat(rhs)) {
            return rhs.isZero();
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}