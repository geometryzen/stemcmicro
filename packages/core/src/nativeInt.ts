import { is_flt, is_rat, is_str, Num } from "@stemcmicro/atoms";
import { is_rat_and_integer, is_safe_integer_range } from "@stemcmicro/predicates";
import { is_atom, U } from "@stemcmicro/tree";
import { ProgrammingError } from "./programming/ProgrammingError";

export function nativeStr(expr: U): string {
    if (is_atom(expr)) {
        if (is_str(expr)) {
            return expr.str;
        } else {
            // The problem here is that expr is Err, it is not propagated.
            throw new ProgrammingError(`${expr}: ${expr.type}`);
        }
    } else {
        throw new ProgrammingError(`${expr}`);
    }
}

export function is_integer_and_in_safe_number_range(num: Num): boolean {
    if (is_rat(num)) {
        if (is_rat_and_integer(num) && is_safe_integer_range(num.a)) {
            return true;
        } else {
            return false;
        }
    } else if (is_flt(num)) {
        if (Math.floor(num.d) === num.d) {
            return true;
        } else {
            return false;
        }
    } else {
        throw new Error();
    }
}
