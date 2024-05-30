import { SystemError } from "../../runtime/SystemError";
import { Cons, is_cons, U } from "../../tree/tree";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function assert_mul_2(expr: U): Cons {
    if (is_cons(expr) && is_mul_2_any_any(expr)) {
        return expr;
    } else {
        throw new SystemError(`${expr}`);
    }
}
