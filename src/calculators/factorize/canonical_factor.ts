import { ExtensionEnv } from "../../env/ExtensionEnv";
import { is_mul } from "../../operators/mul/is_mul";
import { is_num } from "../../operators/num/is_num";
import { render_as_sexpr } from "../../print/render_as_sexpr";
import { Num } from "../../tree/num/Num";
import { one } from "../../tree/rat/Rat";
import { cons, is_cons, is_nil, U } from "../../tree/tree";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function canonical_factor_lhs(expr: U, $: ExtensionEnv): Num {
    if (is_cons(expr)) {
        if (is_mul(expr)) {
            const argList = expr.argList;
            if (is_nil(argList)) {
                return one;
            }
            else if (is_cons(argList)) {
                const first = argList.car;
                if (is_num(first)) {
                    return first;
                }
                else {
                    return one;
                }
            }
            else {
                throw new Error(render_as_sexpr(argList, $));
            }
        }
        else {
            throw new Error(render_as_sexpr(expr, $));
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
            else if (is_cons(argList)) {
                const first = argList.car;
                if (is_num(first)) {
                    return cons(expr.opr, argList.cdr);
                }
                else {
                    return expr;
                }
            }
            else {
                throw new Error(render_as_sexpr(argList, $));
            }
        }
        else {
            throw new Error(render_as_sexpr(expr, $));
        }
    }
    else {
        return expr;
    }
}