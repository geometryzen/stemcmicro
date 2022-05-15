import { SystemError } from "../../runtime/SystemError";
import { U } from "../../tree/tree";
import { Sym } from "../../tree/sym/Sym";
import { is_sym } from "./is_sym";

export function assert_sym(expr: U): Sym {
    if (is_sym(expr)) {
        return expr;
    }
    else {
        // Don't need anything fancy here because this is an assertion for dev eyes only.
        throw new SystemError(`expr => ${expr}`);
    }
}