import { SystemError } from "../../runtime/SystemError";
import { U } from "../tree";
import { is_str } from "./is_str";
import { Str } from "./Str";

export function assert_str(expr: U): Str {
    if (is_str(expr)) {
        return expr;
    }
    else {
        // Don't need anything fancy here because this is an assertion for dev eyes only.
        throw new SystemError(`expr => ${expr}`);
    }
}