import { U } from "@stemcmicro/tree";
import { is_add } from "../runtime/helpers";
import { is_negative_term } from "./is_negative_term";

/**
 *
 */
export function is_negative(expr: U): boolean {
    if (is_add(expr)) {
        if (is_negative_term(expr.argList.head)) {
            return true;
        }
        /*
        if (every_term_is_negative(expr.tail())) {
            return true;
        }
        */
    }
    return is_negative_term(expr);
}
/*
function every_term_is_negative(terms: U[]): boolean {
    return terms.every(is_negative);
}
*/
