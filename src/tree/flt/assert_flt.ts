import { U } from "../tree";
import { Flt } from "./Flt";
import { is_flt } from "./is_flt";

export function assert_flt(expr: U): Flt {
    if (is_flt(expr)) {
        return expr;
    }
    else {
        // Don't need anything fancy here because this is an assertion for dev eyes only.
        throw new Error();
    }
}