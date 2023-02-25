import { is_add } from "../runtime/helpers";
import { cadr } from "../tree/helpers";
import { U } from "../tree/tree";
import { is_negative_term } from "./is_negative_term";

/**
 *
 */
export function is_negative(expr: U): boolean {
    return (is_add(expr) && is_negative_term(cadr(expr))) || is_negative_term(expr);
}
