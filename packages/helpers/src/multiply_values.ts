import { create_sym, is_blade, is_flt, is_num, is_rat, is_tensor, is_uom, Num, one, zero } from "@stemcmicro/atoms";
import { ExprContext, SIGN_GT, SIGN_LT } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { Native, native_sym } from "@stemcmicro/native";
import { cddr, cdr, cons, Cons, is_atom, is_cons, is_nil, items_to_cons, U } from "@stemcmicro/tree";
import { add } from "./add";
import { contains_single_blade } from "./contains_single_blade";
import { contains_single_uom } from "./contains_single_uom";
import { extract_single_blade } from "./extract_single_blade";
import { extract_single_uom } from "./extract_single_uom";
import { is_cons_opr_eq_add } from "./is_cons_opr_eq_add";
import { is_cons_opr_eq_multiply } from "./is_cons_opr_eq_multiply";
import { is_cons_opr_eq_power } from "./is_cons_opr_eq_power";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";
import { is_expanding } from "./is_expanding";
import { multiply } from "./multiply";
import { multiply_num_num } from "./multiply_num_num";
import { power } from "./power";
import { remove_factors } from "./remove_factors";

const MULTIPLY = native_sym(Native.multiply);
const OPERATOR = create_sym("operator");

/**
 * Multiplication of values that are assumed to have been evaluated already.
 */
export function multiply_values(values: Cons, $: ExprContext): U {
    // For multiplication, the expression (*) evaluates to 1.
    if (values.isnil) {
        return one;
    } else {
        // const factors = [...vals];
        // flatten factors
        // sort
        // perform pairwise multiplication
        // recombine
        const head = values.head;
        const rest = values.rest;
        if (is_cons(rest)) {
            return [...rest].reduce((prev: U, curr: U) => multiplyLR(prev, curr, $), head);
        } else {
            return head;
        }
    }
}

function multiplyLR(lhs: U, rhs: U, $: ExprContext): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        return retval;
    };

    if (is_atom(lhs) && is_atom(rhs)) {
        const lhsExt = $.handlerFor(lhs);
        const rhsExt = $.handlerFor(rhs);
        const binLhs = lhsExt.binL(lhs, MULTIPLY, rhs, $);
        if (is_nil(binLhs)) {
            const binRhs = rhsExt.binR(rhs, MULTIPLY, lhs, $);
            if (is_nil(binRhs)) {
                // console.lg("combine_atoms", `${lhs}`, `${rhs}`, `${lhsExt}`, `${rhsExt}`, `${lhs.type}`, `${rhs.type}`);
                const err = diagnostic(Diagnostics.Operator_0_cannot_be_applied_to_types_1_and_2, MULTIPLY, create_sym(lhs.type), create_sym(rhs.type));
                return hook(err, "A");
            } else {
                if (is_cons(binRhs) && is_cons_opr_eq_multiply(binRhs)) {
                    // Ignore.
                } else {
                    return hook(binRhs, "B");
                }
            }
        } else {
            if (is_cons(binLhs) && is_cons_opr_eq_multiply(binLhs)) {
                // Ignore.
            } else {
                return hook(binLhs, "C");
            }
        }
    }

    // This will be dead code because it is handled by the atom && atom code.
    if (is_num(lhs) && is_num(rhs)) {
        return hook(multiply_num_num(lhs, rhs), "D");
    }

    return hook(yymultiply(lhs, rhs, $), "E");
}

function yymultiply(lhs: U, rhs: U, $: ExprContext): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        return retval;
    };

    // We should have something similar for simplifying floats.
    if (is_rat(lhs)) {
        if (lhs.isZero()) {
            return hook(lhs, "B0");
        } else if (lhs.isOne()) {
            return hook(rhs, "B1");
        }
    }
    if (is_flt(lhs)) {
        if (lhs.isZero()) {
            return hook(lhs, "B2");
        }
    }
    if (is_rat(rhs)) {
        if (rhs.isZero()) {
            return hook(zero, "C0");
        } else if (rhs.isOne()) {
            return hook(lhs, "C1");
        }
    }
    if (is_flt(rhs)) {
        if (rhs.isZero()) {
            return hook(zero, "C2");
        }
    }

    // Right Distributive Law  (x1 + x2 + ...) * R => x1 * R + x2 * R + ...
    if (is_expanding($)) {
        if (is_cons(lhs) && is_cons_opr_eq_add(lhs)) {
            return lhs.tail().reduce((a: U, b: U) => add($, a, multiply($, b, rhs)), zero);
        }
    }

    // Left Distributive Law  L * (x1 + x2 + ...) => L * x1 + L * x2 + ...
    if (is_expanding($)) {
        if (is_cons(rhs) && is_cons_opr_eq_add(rhs)) {
            return rhs.tail().reduce((a: U, b: U) => add($, a, multiply($, lhs, b)), zero);
        }
    }

    // Dealing with Blades avoids issues with non-commutativity later on.
    if (contains_single_blade(lhs) && contains_single_blade(rhs)) {
        const bladeL = extract_single_blade(lhs);
        const bladeR = extract_single_blade(rhs);
        const blade = bladeL.mul(bladeR);
        const residueL = remove_factors(lhs, is_blade);
        const residueR = remove_factors(rhs, is_blade);
        return hook(multiply($, multiply($, residueL, residueR), blade), "F");
    }

    if (contains_single_uom(lhs) && contains_single_uom(rhs)) {
        const uomL = extract_single_uom(lhs);
        const uomR = extract_single_uom(rhs);
        const uom = uomL.mul(uomR);
        const residueL = remove_factors(lhs, is_uom);
        const residueR = remove_factors(rhs, is_uom);
        return hook(multiply($, multiply($, residueL, residueR), uom), "G");
    }

    // Units of Measure shortcut.
    if (is_uom(lhs) && is_uom(rhs)) {
        return hook(lhs.mul(rhs), "H");
    }

    if (!is_tensor(lhs) && is_tensor(rhs)) {
        return hook(
            rhs.map((e) => multiply($, lhs, e)),
            "I"
        );
    }

    if (is_tensor(lhs) && !is_tensor(rhs)) {
        return hook(
            lhs.map((e) => multiply($, e, rhs)),
            "J"
        );
    }

    // adjust operands - they are both now lists.
    let p1: Cons = is_cons(lhs) && is_cons_opr_eq_multiply(lhs) ? lhs.cdr : items_to_cons(lhs);
    let p2: Cons = is_cons(rhs) && is_cons_opr_eq_multiply(rhs) ? rhs.cdr : items_to_cons(rhs);

    const factors: U[] = [];

    // handle numerical coefficients
    const c1 = p1.head;
    const c2 = p2.head;
    if (is_num(c1) && is_num(c2)) {
        factors.push(multiply_num_num(c1, c2));
        p1 = p1.cdr;
        p2 = p2.cdr;
    } else if (is_num(c1)) {
        factors.push(c1);
        p1 = p1.cdr;
    } else if (is_num(c2)) {
        factors.push(c2);
        p2 = p2.cdr;
    } else {
        factors.push(one);
    }

    // Let's get this now before going into the while loop...
    const compareFactors = $.compareFn(MULTIPLY);

    while (is_cons(p1) && is_cons(p2)) {
        const head1 = p1.car;
        const head2 = p2.car;

        // TODO: What is going on here with "operator"?
        if (is_cons(head1) && is_cons_opr_eq_sym(head1, OPERATOR) && is_cons(head2) && is_cons_opr_eq_sym(head2, OPERATOR)) {
            factors.push(cons(OPERATOR, append(cdr(head1), cdr(head2))));
            p1 = p1.cdr;
            p2 = p2.cdr;
            continue;
        }

        const [baseL, expoL] = base_and_expo(head1);
        const [baseR, expoR] = base_and_expo(head2);

        // We can get the ordering wrong here. e.g. lhs = (pow 2 1/2), rhs = imu
        // We end up comparing 2 and i and the 2 gets pushed first and the i waits
        // for the next loop iteration.

        // If the head elements are the same then the bases will be the same.
        // On the other hand, the heads can be different but the bases the same.
        // e.g. head1 = x, head2 = 1/x = (pow x -1)
        if (baseL.equals(baseR)) {
            combine_exponentials_with_common_base(factors, baseL, expoL, expoR, $);
            p1 = p1.cdr;
            p2 = p2.cdr;
        } else {
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
                    throw new Error();
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

    if (is_expanding($)) {
        for (let i = 0; i < factors.length; i++) {
            const factor = factors[i];
            if (is_cons(factor) && is_cons_opr_eq_add(factor)) {
                return multiply_factors_array(factors, $);
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
        } else {
            // factors[0] is Rat(1) so we'll just replace it with the multiplication operand
            // so that we can easily built the multiplicative expression from the factors.
            // But before we do that we'll sort the factors to ensure that they are in canonical order.
            // We must do this because, despite our previous efforts, symbols can be shunted in front
            // of exponentials where they later create new exponentials that must be reordered.
            // e.g. a^n * b * b => b * a^n * b = b * b * a^n => b^2 * a^n.
            factors.splice(0, 1); // remove the Rat(1)
            factors.sort(compareFactors);
            return items_to_cons(MULTIPLY, ...factors);
        }
    }

    return cons(MULTIPLY, items_to_cons(...factors));
}

/**
 * Decomposes an expression into a base and power (pow may be one).
 */
function base_and_expo(expr: U): [base: U, expo: U] {
    if (is_cons(expr) && is_cons_opr_eq_power(expr)) {
        return [expr.base, expr.expo];
    } else {
        return [expr, one];
    }
}

function append(p1: U, p2: U): Cons {
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

function multiply_factors_array(factors: U[], $: ExprContext): U {
    if (factors.length === 1) {
        return factors[0];
    }
    if (factors.length === 0) {
        return one;
    }
    let temp = factors[0];
    for (let i = 1; i < factors.length; i++) {
        temp = multiplyLR(temp, factors[i], $);
    }
    return temp;
}

/**
 * Computes base**(expoL+expoR) then finds the most efficient way to add the result to the list of factors.
 */
function combine_exponentials_with_common_base(factors: U[], base: U, expoL: U, expoR: U, env: ExprContext): void {
    const expo = add(env, expoL, expoR);
    try {
        const pow = power(env, base, expo);
        try {
            combine_with_factors(factors, pow);
        } finally {
            pow.release();
        }
    } finally {
        expo.release();
    }
}

/**
 * Computes (baseL*baseR)^expo then finds the most efficient way to add the result to the list of factors.
 * We generally don't want to do this "factorization" because it conflicts with power evaluation.
 */
/*
function combine_exponentials_with_common_expo(factors: U[], baseL: U, baseR: U, expo: U, $: ExtensionEnv): void {
    const X = $.power($.multiply(baseL, baseR), expo);
    combine_with_factors(factors, X);
}
*/

function combine_with_factors(factors: U[], X: U): void {
    if (is_num(X)) {
        factors[0] = multiply_num_num(assert_is_num(factors[0]), X);
    } else if (is_cons(X) && is_cons_opr_eq_multiply(X)) {
        // power can return number * factor (i.e. -1 * i)
        const argList = X.argList;
        try {
            const lhs = argList.head;
            // We now look to see if this multiplication is a binary expression with the lhs being a number.
            // This will allow us to make a simplification.
            if (is_num(lhs) && is_nil(cddr(argList))) {
                const rhs = X.rhs;
                factors[0] = multiply_num_num(assert_is_num(factors[0]), lhs);
                factors.push(rhs);
            } else {
                factors.push(X);
            }
        } finally {
            argList.release();
        }
    } else {
        factors.push(X);
    }
}

/**
 * By restricting to the case that both exponents are -1 we avoid issues over whether the bases commute under multiplication.
 * e.g. a^(-n) * b^(-n) = 1/(a*a*a...) * 1/(b*b*b...) which is not generally the same as 1/(ab)^(-n) = 1/(ab*ab*ab...).
 * N.B. power_v1 is trying to go in the other direction when $.isFactoring().
 * @param expoL
 * @param expoR
 * @param $
 * @returns
 */
/*
function is_both_expos_minus_one(expoL: U, expoR: U): boolean {
    return is_rat(expoL) && is_rat(expoR) && expoL.isMinusOne() && expoR.isMinusOne();
}
*/

/**
 * A runtime check to ensure that a value is not undefined.
 */
function assert_not_undefined<T>(arg: T | undefined): T {
    if (typeof arg === "undefined") {
        throw new Error();
    } else {
        return arg;
    }
}

function assert_is_num(expr: U): Num {
    if (is_num(expr)) {
        return expr;
    } else {
        throw new Error();
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function __normalize_radical_factors(factors: U[]): void {
    // TODO
}
