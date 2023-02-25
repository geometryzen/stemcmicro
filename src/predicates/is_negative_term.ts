import { is_multiply } from "../runtime/helpers";
import { cadr } from "../tree/helpers";
import { U } from "../tree/tree";
import { is_negative_number } from "./is_negative_number";

export function is_negative_term(p: U): boolean {
    return is_negative_number(p) || (is_multiply(p) && is_negative_number(cadr(p)));
}

