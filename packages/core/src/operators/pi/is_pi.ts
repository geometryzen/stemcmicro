import { MATH_PI } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";

export function is_pi(expr: U): expr is Sym & { _type: "" } {
    if (is_sym(expr)) {
        return MATH_PI.equalsSym(expr);
    } else {
        return false;
    }
}
