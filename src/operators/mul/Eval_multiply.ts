import { contains_single_blade } from "../../calculators/compare/contains_single_blade";
import { extract_single_blade } from "../../calculators/compare/extract_single_blade";
import { multiply_num_num } from "../../calculators/mul/multiply_num_num";
import { remove_factors } from "../../calculators/remove_factors";
import { ExtensionEnv, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { is_zero_num } from "../../is_zero_rational_or_double";
import { render_as_infix } from "../../print/print";
import { OPERATOR } from "../../runtime/constants";
import { is_add, is_multiply, is_power } from "../../runtime/helpers";
import { MATH_MUL } from "../../runtime/ns_math";
import { caddr, cadr, cdddr, cddr } from "../../tree/helpers";
import { Num } from "../../tree/num/Num";
import { one, zero } from "../../tree/rat/Rat";
import { car, cdr, cons, Cons, is_cons, is_cons_not_nil, is_nil, items_to_cons, U } from "../../tree/tree";
import { is_blade } from "../blade/is_blade";
import { is_num } from "../num/is_num";
import { is_rat } from "../rat/is_rat";
import { is_tensor } from "../tensor/is_tensor";
import { is_uom } from "../uom/is_uom";

export function Eval_multiply(expr: Cons, $: ExtensionEnv): U {
    const temp = $.valueOf(cadr(expr));
    const p1 = cddr(expr);
    if (is_cons(p1)) {
        return [...p1].reduce((acc: U, p: U) => multiply(acc, $.valueOf(p), $), temp);
    }
    return temp;
}
export function multiply(arg1: U, arg2: U, $: ExtensionEnv): U {
    if (is_num(arg1) && is_num(arg2)) {
        return multiply_num_num(arg1, arg2);
    }
    return yymultiply(arg1, arg2, $);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function yymultiply(lhs: U, rhs: U, $: ExtensionEnv): U {

    // console.lg("lhs", render_as_infix(lhs, $));
    // console.lg("rhs", render_as_infix(rhs, $));
    // is either operand zero?
    if (is_zero_num(lhs) || is_zero_num(rhs)) {
        return zero;
    }

    // is either operand a sum?
    if ($.isExpanding() && is_add(lhs)) {
        return lhs
            .tail()
            .reduce((a: U, b: U) => $.add(a, multiply(b, rhs, $)), zero);
    }

    if ($.isExpanding() && is_add(rhs)) {
        return rhs
            .tail()
            .reduce((a: U, b: U) => $.add(a, multiply(lhs, b, $)), zero);
    }

    const compareFactors = $.compareFn(MATH_MUL);

    // Dealing with Blades avoids issues with non-commutativity later on.
    if (contains_single_blade(lhs) && contains_single_blade(rhs)) {
        const bladeL = extract_single_blade(lhs);
        const bladeR = extract_single_blade(rhs);
        const blade = bladeL.mul(bladeR);
        const residueL = remove_factors(lhs, is_blade);
        const residueR = remove_factors(rhs, is_blade);
        return $.multiply($.multiply(residueL, residueR), blade);
    }

    if (is_uom(lhs) && is_uom(rhs)) {
        return lhs.mul(rhs);
    }

    // scalar times tensor?
    if (!is_tensor(lhs) && is_tensor(rhs)) {
        // return scalar_times_tensor(lhs, rhs);
        return $.multiply(lhs, rhs);
    }

    // tensor times scalar?
    if (is_tensor(lhs) && !is_tensor(rhs)) {
        // return tensor_times_scalar(lhs, rhs);
        return $.multiply(lhs, rhs);
    }

    // adjust operands - they are both now lists.
    let p1: Cons = is_multiply(lhs) ? lhs.cdr : items_to_cons(lhs);
    let p2: Cons = is_multiply(rhs) ? rhs.cdr : items_to_cons(rhs);

    const factors: U[] = [];

    // handle numerical coefficients
    if (is_num(car(p1)) && is_num(car(p2))) {
        const arg1 = car(p1) as Num;
        const arg2 = car(p2) as Num;
        factors.push(multiply_num_num(arg1, arg2));
        p1 = p1.cdr;
        p2 = p2.cdr;
    }
    else if (is_num(car(p1))) {
        factors.push(car(p1));
        p1 = p1.cdr;
    }
    else if (is_num(car(p2))) {
        factors.push(car(p2));
        p2 = p2.cdr;
    }
    else {
        factors.push(one);
    }

    while (is_cons(p1) && is_cons(p2)) {
        const head1 = p1.car;
        const head2 = p2.car;
        const [baseL, powerL] = base_and_power(head1);
        const [baseR, powerR] = base_and_power(head2);
        if (car(head1).equals(OPERATOR) && car(head2).equals(OPERATOR)) {
            factors.push(cons(OPERATOR, append(cdr(head1), cdr(head2))));
            p1 = p1.cdr;
            p2 = p2.cdr;
            continue;
        }

        // We can get the ordering wrong here. e.g. lhs = (power 2 1/2), rhs = imu
        // We end up comparing 2 and i and the 2 gets pushed first and the i waits
        // for the next loop iteration.
        // console.lg("head1", render_as_infix(head1, $));
        // console.lg("head2", render_as_infix(head2, $));
        // console.lg("baseL", render_as_infix(baseL, $));
        // console.lg("baseR", render_as_infix(baseR, $));
        // console.lg("powerL", render_as_infix(powerL, $));
        // console.lg("powerR", render_as_infix(powerR, $));

        // If the head elements are the same then the bases will be the same.
        // On the other hand, the heads can be different but the bases the same.
        // e.g. head1 = x, head2 = 1/x = (power x -1)
        if (baseL.equals(baseR)) {
            combine_factors(factors, baseR, powerL, powerR, $);
            p1 = p1.cdr;
            p2 = p2.cdr;
        }
        else {
            switch (compareFactors(head1, head2)) {
                case SIGN_LT: {
                    factors.push(head1);
                    p1 = p1.cdr;
                    break;
                }
                case SIGN_GT: {
                    factors.push(head2);
                    p2 = p2.cdr;
                    break;
                }
                default: {
                    // Equality here means stable sorting of the head elements.
                    // If we end up here then we already know that the bases are different.
                    // So we definitely can't combine assuming base equality.
                    // This can happen for non-commuting elements. e.g. Blade(s), Tensor(s).
                    // Remove factors that don't commute earlier? Or do we handle them here?
                    throw new Error(`${render_as_infix(baseL, $)} ${render_as_infix(powerL, $)} ${render_as_infix(baseR, $)} ${render_as_infix(powerR, $)}`);
                }
            }
        }
    }

    // push remaining factors, if any
    if (is_cons(p1)) {
        factors.push(...p1);
    }
    if (is_cons(p2)) {
        factors.push(...p2);
    }

    // normalize radical factors
    // example: 2*2(-1/2) -> 2^(1/2)
    // must be done after merge because merge may produce radical
    // example: 2^(1/2-a)*2^a -> 2^(1/2)
    __normalize_radical_factors(factors);

    if ($.isExpanding()) {
        for (let i = 0; i < factors.length; i++) {
            if (is_add(factors[i])) {
                return multiply_all(factors, $);
            }
        }
    }

    // n is the number of result factors on the stack
    const n = factors.length;
    if (n === 1) {
        return assert_not_undefined(factors.pop());
    }

    // discard integer 1
    const first = factors[0];
    if (is_rat(first) && first.isOne()) {
        if (n === 2) {
            return assert_not_undefined(factors.pop());
        }
        else {
            factors[0] = MATH_MUL;
            return items_to_cons(...factors);
        }
    }

    return cons(MATH_MUL, items_to_cons(...factors));
}

/**
 * Decomposes an expression into a base and power (power may be one).
 */
function base_and_power(expr: U): [base: U, power: U] {
    if (is_power(expr)) {
        const argList = expr.cdr;
        return [car(argList), cadr(argList)];
    }
    else {
        return [expr, one];
    }
}

export function append(p1: U, p2: U): U {
    // from https://github.com/gbl08ma/eigenmath/blob/8be989f00f2f6f37989bb7fd2e75a83f882fdc49/src/append.cpp
    const arr: U[] = [];
    if (is_cons(p1)) {
        arr.push(...p1);
    }
    if (is_cons(p2)) {
        arr.push(...p2);
    }
    return items_to_cons(...arr);
}
export function multiply_all(n: U[], $: ExtensionEnv): U {
    if (n.length === 1) {
        return n[0];
    }
    if (n.length === 0) {
        return one;
    }
    let temp = n[0];
    for (let i = 1; i < n.length; i++) {
        temp = multiply(temp, n[i], $);
    }
    return temp;
}

function combine_factors(factors: U[], base: U, powerL: U, powerR: U, $: ExtensionEnv): void {
    const X = $.power(base, $.add(powerL, powerR));
    if (is_num(X)) {
        factors[0] = multiply_num_num(assert_is_num(factors[0]), X);
    }
    else if (is_multiply(X)) {
        // power can return number * factor (i.e. -1 * i)
        const candidate = cadr(X);
        if (is_num(candidate) && is_nil(cdddr(X))) {
            const arg1 = assert_is_num(factors[0]);
            const arg2 = candidate;
            factors[0] = multiply_num_num(arg1, arg2);
            factors.push(caddr(X));
        }
        else {
            factors.push(X);
        }
    }
    else {
        factors.push(X);
    }
}

/**
 * A runtime check to ensure that a value is not undefined.
 */
function assert_not_undefined<T>(arg: T | undefined): T {
    if (typeof arg === 'undefined') {
        throw new Error();
    }
    else {
        return arg;
    }
}

function assert_is_num(expr: U): Num {
    if (is_num(expr)) {
        return expr;
    }
    else {
        throw new Error();
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function __normalize_radical_factors(factors: U[]): void {
    // TODO
}