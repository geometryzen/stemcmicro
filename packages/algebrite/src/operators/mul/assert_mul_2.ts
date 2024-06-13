import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { Cons, is_cons, U } from "@stemcmicro/tree";
import { SystemError } from "../../runtime/SystemError";

export function assert_mul_2(expr: U): Cons {
    if (is_cons(expr) && is_mul_2_any_any(expr)) {
        return expr;
    } else {
        throw new SystemError(`${expr}`);
    }
}
