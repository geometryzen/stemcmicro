import { ExtensionEnv } from "../../env/ExtensionEnv";
import { is_mul } from "../../operators/mul/is_mul";
import { is_num } from "../../operators/num/is_num";
import { Num } from "../../tree/num/Num";
import { one } from "../../tree/rat/Rat";
import { cons, is_cons, is_nil, U } from "../../tree/tree";
import { canonicalize_mul } from "../canonicalize/canonicalize_unary_mul";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function canonical_factor_lhs(expr: U, $: ExtensionEnv): Num {
    if (is_cons(expr)) {
        if (is_mul(expr)) {
            const argList = expr.argList;
            if (is_nil(argList)) {
                return one;
            }
            else {
                const first = argList.car;
                if (is_num(first)) {
                    return first;
                }
                else {
                    return one;
                }
            }
        }
        else {
            return one;
        }
    }
    else {
        return one;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function canonical_factor_rhs(expr: U, $: ExtensionEnv): U {
    if (is_cons(expr)) {
        if (is_mul(expr)) {
            const argList = expr.argList;
            if (is_nil(argList)) {
                return one;
            }
            else {
                const first = argList.car;
                if (is_num(first)) {
                    // There is a possibility here of creating a unary multiplication expression.
                    // e.g. (* a x) => (* a (* x))
                    return canonicalize_mul(cons(expr.opr, argList.cdr));
                }
                else {
                    return expr;
                }
            }
        }
        else {
            return expr;
        }
    }
    else {
        return expr;
    }
}