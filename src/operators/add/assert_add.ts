import { SystemError } from "../../runtime/SystemError";
import { Cons, is_cons, U } from "../../tree/tree";
import { is_add } from "./is_add";

export function assert_add(expr: U): Cons {
    if (is_cons(expr) && is_add(expr)) {
        return expr;
    }
    else {
        throw new SystemError(`${expr}`);
    }
}