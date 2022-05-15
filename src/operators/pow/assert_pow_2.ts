import { SystemError } from "../../runtime/SystemError";
import { Cons, is_cons, U } from "../../tree/tree";
import { is_pow_2_any_any } from "./is_pow_2_any_any";

export function assert_pow_2(expr: U): Cons {
    if (is_cons(expr) && is_pow_2_any_any(expr)) {
        return expr;
    }
    else {
        throw new SystemError(`${expr}`);
    }
}