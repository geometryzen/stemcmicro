import { is_num_and_negative } from "@stemcmicro/helpers";
import { is_multiply } from "../runtime/helpers";
import { U } from "../tree/tree";

export function is_negative_term(p: U): boolean {
    if (is_num_and_negative(p)) {
        return true;
    }
    return is_multiply(p) && is_num_and_negative(p.argList.head);
}
