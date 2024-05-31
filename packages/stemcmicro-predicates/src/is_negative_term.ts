import { U } from "@stemcmicro/tree";
import { is_multiply } from "./is_multiply";
import { is_num_and_negative } from "./is_num_and_negative";

export function is_negative_term(p: U): boolean {
    if (is_num_and_negative(p)) {
        return true;
    }
    return is_multiply(p) && is_num_and_negative(p.argList.head);
}
