import { SystemError } from "../../runtime/SystemError";
import { is_cons, U } from "../../tree/tree";
import { is_add } from "./is_add";

export function assert_not_add(expr: U): U {
    if (is_cons(expr) && is_add(expr)) {
        throw new SystemError(`${expr}`);
    }
    else {
        return expr;
    }
}