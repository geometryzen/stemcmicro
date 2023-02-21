import { Cons } from "../../tree/tree";
import { is_rat } from "../rat/rat_extension";
import { is_add_2_any_any } from "./is_add_2_any_any";

export function is_add_2_rat_rat(expr: Cons): boolean {
    if (is_add_2_any_any(expr)) {
        const lhs = expr.item(1);
        const rhs = expr.item(2);
        return is_rat(lhs) && is_rat(rhs);
    }
    else {
        return false;
    }
}