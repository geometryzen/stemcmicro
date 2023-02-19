import { compare_factors } from '../../calculators/compare/compare_factors';
import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { MULTIPLY } from "../../runtime/constants";
import { is_add } from "../../runtime/helpers";
import { MATH_MUL } from "../../runtime/ns_math";
import { cadr, cddr } from "../../tree/helpers";
import { zero } from "../../tree/rat/Rat";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { is_mul } from "./is_mul";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

const make_factor_comparator = function ($: ExtensionEnv) {
    return function (a: U, b: U) {
        return compare_factors(a, b, $);
    };
};

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_varargs', MULTIPLY, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const hook = (where: string, retval: U): U => {
            // console.lg(this.name, where, decodeMode($.getMode()), render_as_sexpr(expr, this.$), "=>", render_as_sexpr(retval, $));
            return retval;
        };
        // The problem we have here is that we are driving an implicit association to an explicit one.
        if ($.isExpanding()) {
            if (expr.tail().some(is_add)) {
                // Distributive Law.
                const product = multiply_factors(expr, $);
                if (product.equals(expr)) {
                    return [TFLAG_NONE, hook('A', expr)];
                }
                else {
                    return [TFLAG_DIFF, hook('B', product)];
                }
            }
            else {
                if ($.isAssociationImplicit()) {
                    const factors = expr.tail();
                    if (factors.some((factor => is_cons(factor) && is_mul(factor)))) {
                        const args: U[] = [];
                        for (const factor of factors) {
                            if (is_cons(factor) && is_mul(factor)) {
                                args.push(...factor.tail());
                            }
                            else {
                                args.push(factor);
                            }
                        }
                        args.sort(make_factor_comparator($));
                        multiply_factor_pairs(args, $);
                        const retval = items_to_cons(expr.head, ...args);
                        return [TFLAG_NONE, hook('C', retval)];
                    }
                    else {
                        return [TFLAG_NONE, hook('D', expr)];
                    }
                }
                else {
                    return [TFLAG_NONE, hook('E', expr)];
                }
            }
        }
        else if ($.isImplicating()) {
            return [TFLAG_NONE, hook('F', expr)];
        }
        else {
            return [TFLAG_NONE, hook('G', expr)];
        }
    }
}
function multiply_factor_pairs(retval: U[], $: ExtensionEnv): void {
    let i = 0;
    while (i < retval.length - 1) {
        const lhs = retval[i];
        const rhs = retval[i + 1];
        const s = $.valueOf(multiply(lhs, rhs, $));
        if (is_factor_pair_changed(s, lhs, rhs)) {
            retval.splice(i, 2, s);
        }
        else {
            i++;
        }
    }
}


function is_factor_pair_changed(s: U, lhs: U, rhs: U): boolean {
    if (is_cons(s) && is_mul_2_any_any(s)) {
        if (s.item(1).equals(lhs) && s.item(2).equals(rhs)) {
            return false;
        }
        else if (s.item(1).equals(rhs) && s.item(2).equals(lhs)) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}

function multiply_factors(expr: Cons, $: ExtensionEnv): U {
    let p = $.valueOf(cadr(expr));
    const remainder = cddr(expr);
    if (is_cons(remainder)) {
        const initialValue = p;
        const items: U[] = [...remainder];
        p = items.reduce((previousValue: U, currentValue: U) => $.valueOf(multiply(previousValue, $.valueOf(currentValue), $)), initialValue);
    }
    return p;
}

function multiply(argL: U, argR: U, $: ExtensionEnv): U {
    // console.lg("argL", render_as_infix(argL, $));
    // console.lg("argR", render_as_infix(argR, $));
    // console.lg(decodePhase($.getFocus()));
    // Handle distributive law for *,+ (but only when expanding).
    if ($.isExpanding()) {
        if (is_add(argL)) {
            return argL
                .tail()
                .reduce((a: U, b: U) => $.add(a, multiply(b, argR, $)), zero);
        }
        if (is_add(argR)) {
            return argR
                .tail()
                .reduce((a: U, b: U) => $.add(a, multiply(argL, b, $)), zero);
        }
    }
    // console.lg("argL", render_as_infix(argL, $));
    // console.lg("argR", render_as_infix(argR, $));
    return $.valueOf(items_to_cons(MATH_MUL, argL, argR));
}

export const mul_varargs = new Builder();
