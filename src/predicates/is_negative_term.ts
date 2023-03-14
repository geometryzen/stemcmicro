import { is_multiply } from "../runtime/helpers";
import { cadr } from "../tree/helpers";
import { U } from "../tree/tree";
import { is_num_and_negative } from "./is_negative_number";

export function is_negative_term(p: U): boolean {
    return is_num_and_negative(p) || (is_multiply(p) && is_num_and_negative(cadr(p)));
}

