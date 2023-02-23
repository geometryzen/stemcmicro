import { compare_factors } from '../../calculators/compare/compare_factors';
import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { MULTIPLY } from "../../runtime/constants";
import { is_add } from "../../runtime/helpers";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { cadr, cddr } from "../../tree/helpers";
import { one, two, zero } from "../../tree/rat/Rat";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { is_mul } from "./is_mul";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

const make_factor_comparator = function ($: ExtensionEnv) {
    return function (a: U, b: U) {
        const sign = compare_factors(a, b, $);
        // console.lg("a", render_as_infix(a, $), "b", render_as_infix(b, $), sign);
        return sign;
    };
};

function args_contain_association_explicit(factors: U[]): boolean {
    return factors.some((factor => is_cons(factor) && is_mul(factor)));
}

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
        // console.lg(this.name, render_as_sexpr(expr, $));
        const hook = (where: string, retval: U): U => {
            // console.lg(this.name, where, decodeMode($.getMode()), render_as_infix(expr, this.$), "=>", render_as_infix(retval, $));
            // console.lg(this.name, where, decodeMode($.getMode()), render_as_sexpr(expr, this.$), "=>", render_as_sexpr(retval, $));
            return retval;
        };
        // The problem we have here is that we are driving an implicit association to an explicit one.
        if ($.isExpanding()) {
            const args = expr.tail();
            if (args.length === 0) {
                // We simplify the nonary case. (*) => 1 (the identity element for multiplication)
                return [TFLAG_DIFF, hook('A', one)];
            }
            if (args.length === 1) {
                // We simplify the unary case. (* a) => a
                return [TFLAG_DIFF, hook('B', args[0])];
            }
            if (args.some(is_add)) {
                // Distributive Law.
                const product = multiply_factors(expr, $);
                if (product.equals(expr)) {
                    return [TFLAG_NONE, hook('C', expr)];
                }
                else {
                    return [TFLAG_DIFF, hook('D', product)];
                }
            }
            else {
                // Fall through.
            }
            if (args.length === 2) {
                if (args_contain_association_explicit(args)) {
                    const retval = items_to_cons(expr.head, ...make_factor_association_implicit(args));
                    return [TFLAG_DIFF, hook('E', retval)];
                }
                else {
                    // We don't do the binary case, leave that to specific matchers.
                    if (expr.lhs.equals(expr.rhs)) {
                        return [TFLAG_DIFF, items_to_cons(MATH_POW, expr.lhs, two)];
                    }
                    else {
                        return [TFLAG_NONE, hook('F', expr)];
                    }
                }
            }
            const factors = expr.tail();
            if (args_contain_association_explicit(factors)) {
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
                return [TFLAG_DIFF, hook('G', retval)];
            }
            else {
                // No possibility of flattening but sorting is possible.
                const args = expr.tail();
                args.sort(make_factor_comparator($));
                multiply_factor_pairs(args, $);
                const retval = items_to_cons(expr.head, ...args);
                const flag = retval.equals(expr) ? TFLAG_NONE : TFLAG_DIFF;
                return [flag, hook('H', retval)];
            }
        }
        else {
            return [TFLAG_NONE, hook('M', expr)];
        }
    }
}

function make_factor_association_implicit(factors: U[]): U[] {
    const args: U[] = [];
    for (const factor of factors) {
        if (is_cons(factor) && is_mul(factor)) {
            args.push(...factor.tail());
        }
        else {
            args.push(factor);
        }
    }
    return args;
}

function multiply_factor_pairs(args: U[], $: ExtensionEnv): void {
    if (args.length > 2) {
        let i = 0;
        while (i < args.length - 1) {
            const lhs = args[i];
            const rhs = args[i + 1];
            // console.lg("lhs", render_as_infix(lhs, $));
            // console.lg("rhs", render_as_infix(rhs, $));
            const p = multiply(lhs, rhs, $);
            const s = $.valueOf(p);
            if (is_factor_pair_changed(s, lhs, rhs)) {
                args.splice(i, 2, s);
            }
            else {
                i++;
            }
        }
    }
    else {
        // It's not our job to perform binary multiplication.
        // Doing so will cause infinite loops.
        return;
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
    // console.lg("argL", render_as_sexpr(argL, $));
    // console.lg("argR", render_as_sexpr(argR, $));
    return $.valueOf(items_to_cons(MATH_MUL, argL, argR));
}

export const mul_varargs = new Builder();
