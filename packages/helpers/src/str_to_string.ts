import { is_str } from "@stemcmicro/atoms";
import { is_atom, U } from "@stemcmicro/tree";

export function str_to_string(expr: U): string {
    if (is_atom(expr)) {
        if (is_str(expr)) {
            return expr.str;
        } else {
            // The problem here is that expr is Err, it is not propagated.
            throw new Error(`${expr}: ${expr.type}`);
        }
    } else {
        throw new Error(`${expr}`);
    }
}
