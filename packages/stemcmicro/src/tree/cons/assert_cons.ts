import { Cons, is_cons, U } from "@stemcmicro/tree";
import { SystemError } from "../../runtime/SystemError";

export function assert_cons(expr: U): Cons {
    if (is_cons(expr)) {
        return expr;
    } else {
        // Don't need anything fancy here because this is an assertion for dev eyes only.
        throw new SystemError();
    }
}
