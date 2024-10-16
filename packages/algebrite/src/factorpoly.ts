import { create_int, imu, negOne, one, Sym, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { add, divide, inverse, iszero, is_negative, multiply, negate, power, subtract } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";
import { rational } from "./bignum";
import { complex_conjugate } from "./complex_conjugate";
import { condense } from "./condense";
import { ExtensionEnv } from "./env/ExtensionEnv";
import { equals } from "./helpers/equals";
import { rect } from "./helpers/rect";
import { contains_floating_values_or_floatf } from "./is";
import { multiply_noexpand, negate_noexpand } from "./multiply";
import { coefficients } from "./operators/coeff/coeff";
import { denominator } from "./operators/denominator/denominator";
import { ydivisors } from "./operators/divisors/divisors";
import { lcm } from "./operators/lcm/lcm";
import { ProgrammingError } from "./programming/ProgrammingError";
import { quotient } from "./quotient";
import { defs, move_top_of_stack } from "./runtime/defs";
import { stack_pop, stack_push, stack_push_items } from "./runtime/stack";

/**
 *
 * @param P polynomial expression
 * @param X polynomial variable
 * @param $
 * @returns factored polynomial
 */
export function factor_polynomial(P: U, X: Sym, $: Pick<ExprContext, "getDirective" | "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    // console.lg("yyfactorpoly", `${($ as ExtensionEnv).toInfixString(P)}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg("retval", ($ as ExtensionEnv).toInfixString(retval), description);
        return retval;
    };
    if (contains_floating_values_or_floatf(P)) {
        throw new Error("floating point numbers in polynomial");
    }

    const cs: U[] = coefficients(P, X, $);
    for (let i = 0; i < cs.length; i++) {
        // console.lg(`cs[${i}] => `, `${cs[i]}`);
    }

    // WARNING: This mutates the coefficients array argument with the scaling as the return value.
    const scaling = rationalize_coefficients(cs, $);
    // console.lg("scaling => ", ($ as ExtensionEnv).toInfixString(scaling));
    for (let i = 0; i < cs.length; i++) {
        // console.lg(`cs[${i}] => `, `${cs[i]}`);
    }

    // console.lg("k", ($ as ExtensionEnv).toInfixString(k));

    // console.lg(`rationalized coes ${coes}, with k = ${p7}`);

    // We start out by looking for real roots.
    let kind: "ℝ" | "ℂ" = "ℝ";
    let remainingPoly: U | null = null;
    // TODO: What are these values...
    let a: U | undefined;
    let b: U | undefined;
    let p8: U | undefined;
    // We start from the largest coefficient.
    let coeffIdx = cs.length - 1;
    let k = scaling;
    while (coeffIdx > 0) {
        // console.lg("coeffIdx", coeffIdx);
        let foundCRoot = false;
        let foundRRoot = false;
        if (iszero(cs[0], $)) {
            a = one;
            b = zero;
        } else {
            if (kind === "ℝ") {
                [foundRRoot, a, b] = get_factor_from_real_root(cs, coeffIdx, X, a as U, b as U, $);
                // console.lg("foundRRoot", foundRRoot, ($ as ExtensionEnv).toInfixString(a), ($ as ExtensionEnv).toInfixString(b));
            } else if (kind === "ℂ") {
                [foundCRoot, a] = get_factor_from_complex_root(remainingPoly as U, cs, coeffIdx, $);
                // console.lg("foundComplexRoot", foundRealRoot);
                // console.lg("p4", p4 ? render_as_infix(p4, $) : "undefined");
            }
        }
        // console.lg(`whichRootsAreWeFinding ${whichRootsAreWeFinding}`);
        // console.lg(`foundRealRoot ${foundRealRoot}`);

        if (kind === "ℝ") {
            if (foundRRoot === false) {
                kind = "ℂ";
                continue;
            } else {
                p8 = add($, multiply($, a as U, X), b as U); // A, x, B

                // factor out negative sign (not req'd because p4 > 1)
                //if 0
                /*
                if (isnegativeterm(p4))
                  push(p8)
                  negate()
                  p8 = pop()
                  push(p7)
                  negate_noexpand()
                  p7 = pop()
                */
                //endif

                // factored is the part of the polynomial that was factored so far,
                // add the newly found factor to it. Note that we are not actually
                // multiplying the polynomials fully, we are just leaving them
                // expressed as (P1)*(P2), we are not expanding the product.
                // console.lg("k", ($ as ExtensionEnv).toInfixString(k));
                // console.lg("p8", ($ as ExtensionEnv).toInfixString(p8));
                k = multiply_noexpand(k, p8, $);
                // console.lg("k", ($ as ExtensionEnv).toInfixString(k));

                // ok now on stack we have the coefficients of the
                // remaining part of the polynomial still to factor.
                // Divide it by the newly-found factor so that
                // the stack then contains the coefficients of the
                // polynomial part still left to factor.
                yydivpoly(a as U, b as U, cs, coeffIdx, $);

                while (coeffIdx && iszero(cs[coeffIdx], $)) {
                    coeffIdx--;
                }

                let temp: U = zero;
                for (let i = 0; i <= coeffIdx; i++) {
                    // p2: the free variable
                    temp = add($, temp, multiply($, cs[i], power($, X, create_int(i))));
                }
                remainingPoly = temp;
            }
        } else if (kind === "ℂ") {
            if (foundCRoot === false) {
                break;
            } else {
                const firstFactor = subtract($, a as U, X); // A, x
                const secondFactor = subtract($, complex_conjugate(a as U, $), X); // p4: A, p2: x

                p8 = multiply($, firstFactor, secondFactor);

                //if (factpoly_expo > 0 && isnegativeterm(polycoeff[factpoly_expo]))
                //  negate()
                //  negate_noexpand()

                // factor out negative sign (not req'd because p4 > 1)
                //if 0
                /*
                if (isnegativeterm(p4))
                  push(p8)
                  negate()
                  p8 = pop()
                  push(p7)
                  negate_noexpand()
                  p7 = pop()
                */
                //endif

                // p7 is the part of the polynomial that was factored so far,
                // add the newly found factor to it. Note that we are not actually
                // multiplying the polynomials fully, we are just leaving them
                // expressed as (P1)*(P2), we are not expanding the product.

                const previousK = k;

                k = multiply_noexpand(k, p8, $);

                // build the polynomial of the unfactored part

                if (remainingPoly == null) {
                    let temp: U = zero;
                    for (let i = 0; i <= coeffIdx; i++) {
                        // p2: the free variable
                        temp = add($, temp, multiply($, cs[i], power($, X, create_int(i))));
                    }
                    remainingPoly = temp;
                }

                //push(dividend)
                //degree()
                //startingDegree = pop()

                const divisor = p8;
                const dividend = remainingPoly;
                remainingPoly = quotient(dividend, divisor, X, $);

                const checkingTheDivision = multiply($, remainingPoly, p8);

                if (!equals(checkingTheDivision, dividend, $)) {
                    stack_push(previousK);

                    const arg2 = condense(dividend, $);

                    const arg1 = stack_pop();
                    return hook(multiply_noexpand(arg1, arg2, $), "A");
                }

                //push(remainingPoly)
                //degree()
                //remainingDegree = pop()

                /*
                if compare_numbers(startingDegree, remainingDegree)
                  * ok even if we found a complex root that
                  * together with the conjugate generates a poly in Z,
                  * that doesn't mean that the division would end up in Z.
                  * Example: 1+x^2+x^4+x^6 has +i and -i as one of its roots
                  * so a factor is 1+x^2 ( = (x+i)*(x-i))
                  * BUT 
                */
                for (let i = 0; i <= coeffIdx; i++) {
                    cs.pop();
                }

                cs.push(...coefficients(remainingPoly, X, $));

                coeffIdx -= 2;
            }
        }
    }

    // build the remaining unfactored part of the polynomial

    let temp: U = zero;
    for (let i = 0; i <= coeffIdx; i++) {
        temp = add($, temp, multiply($, cs[i], power($, X, create_int(i))));
    }

    // console.lg("temp       II", render_as_infix(temp, $));

    const remaining = condense(temp, $);

    // console.lg("factorized II", render_as_infix(factorized, $));
    // console.lg("remaining  II", render_as_infix(remaining, $));

    // factor out negative sign

    if (coeffIdx > 0 && is_negative(cs[coeffIdx])) {
        //prev_expanding = expanding
        //expanding = 1
        //expanding = prev_expanding
        return hook(multiply_noexpand(negate_noexpand(k, $ as ExtensionEnv), negate($, remaining), $), "B");
    } else {
        // console.lg("k", ($ as ExtensionEnv).toInfixString(k));
        // console.lg("remaining", ($ as ExtensionEnv).toInfixString(remaining));
        return hook(multiply_noexpand(k, remaining, $), "C");
    }
}

/**
 * e.g. [c,b,a]
 * @param cs This array is mutated as an intended side-effect and we return a value, k, such that
 * multiplication of the mutated coefficient by k recreates the original coefficients.
 */
function rationalize_coefficients(cs: U[], $: Pick<ExprContext, "getDirective" | "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    // console.lg("rationalize_coefficients", ($ as ExtensionEnv).toSExprString(items_to_cons(...cs)));
    // console.lg(`rationalize_coefficients ${coefficients}`);
    // LCM of all polynomial coefficients
    let one_over_k: U = one;
    for (const coeff of cs) {
        one_over_k = lcm(denominator(coeff, $), one_over_k, $);
    }

    // multiply each coefficient by RESULT
    for (let i = 0; i < cs.length; i++) {
        cs[i] = multiply($, one_over_k, cs[i]);
    }

    const k = inverse(one_over_k, $);
    return k;
}

/**
 * If successful, the factor returned is a * x + b
 * @param coeffs
 * @param coeffIdx
 * @param X polynomial variable (not actually used).
 * @param a
 * @param b
 * @param $
 * @returns
 */
function get_factor_from_real_root(coeffs: U[], coeffIdx: number, X: Sym, a: U, b: U, $: Pick<ExprContext, "getDirective" | "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): [success: boolean, a: U, b: U] {
    const h = defs.tos;

    const an = defs.tos;
    stack_push_items(ydivisors(coeffs[coeffIdx], $));
    const nan = defs.tos - an;

    const a0 = defs.tos;
    stack_push_items(ydivisors(coeffs[0], $));
    const na0 = defs.tos - a0;

    // try roots
    for (let rootsTries_i = 0; rootsTries_i < nan; rootsTries_i++) {
        for (let rootsTries_j = 0; rootsTries_j < na0; rootsTries_j++) {
            a = defs.stack[an + rootsTries_i] as U;
            b = defs.stack[a0 + rootsTries_j] as U;

            const neg_root_candidate = negate($, divide(b, a, $));

            const neg_poly = polynomial(neg_root_candidate, coeffs, coeffIdx, $);

            if (iszero(neg_poly, $)) {
                move_top_of_stack(h);
                return [true, a, b];
            }

            b = negate($, b);

            const pos_root_candidate = negate($, neg_root_candidate);

            const pos_poly = polynomial(pos_root_candidate, coeffs, coeffIdx, $);

            if (iszero(pos_poly, $)) {
                move_top_of_stack(h);
                return [true, a, b];
            }
        }
    }

    move_top_of_stack(h);

    return [false, a, b];
}

function get_factor_from_complex_root(remainingPoly: U, polycoeff: U[], factpoly_expo: number, _: Pick<ExprContext, "valueOf">): [boolean, U | undefined] {
    let p4: U | undefined;
    let p3: U, p6: U;

    if (factpoly_expo <= 2) {
        return [false, p4];
    }

    // const p1 = remainingPoly;

    const h = defs.tos;

    // trying -1^(2/3) which generates a polynomial in Z
    // generates x^2 + 2x + 1
    p4 = rect(power(_, negOne, rational(2, 3)), _);
    p3 = p4;
    stack_push(p3);
    p6 = polynomial(p3, polycoeff, factpoly_expo, _);
    if (iszero(p6, _)) {
        move_top_of_stack(h);
        return [true, p4];
    }

    // trying 1^(2/3) which generates a polynomial in Z
    // http://www.wolframalpha.com/input/?i=(1)%5E(2%2F3)
    // generates x^2 - 2x + 1
    p4 = rect(power(_, one, rational(2, 3)), _);
    p3 = p4;
    stack_push(p3);
    p6 = polynomial(p3, polycoeff, factpoly_expo, _);
    if (iszero(p6, _)) {
        move_top_of_stack(h);
        return [true, p4];
    }

    // trying some simple complex numbers. All of these
    // generate polynomials in Z
    for (let rootsTries_i = -10; rootsTries_i <= 10; rootsTries_i++) {
        for (let rootsTries_j = 1; rootsTries_j <= 5; rootsTries_j++) {
            p4 = rect(add(_, create_int(rootsTries_i), multiply(_, create_int(rootsTries_j), imu)), _);

            const p3 = p4;

            stack_push(p3);

            const p6 = polynomial(p3, polycoeff, factpoly_expo, _);

            if (iszero(p6, _)) {
                move_top_of_stack(h);
                return [true, p4];
            }
        }
    }

    move_top_of_stack(h);

    return [false, p4];
}

/**
 * Divides the polynomial defined by the coefficients by a * x + b
 * The coeffs array is mutated. Nothing is returned.
 * @param a
 * @param b
 * @param coeffs
 * @param k
 * @param _
 */
function yydivpoly(a: U, b: U, coeffs: U[], k: number, env: Pick<ExprContext, "getDirective" | "valueOf">): void {
    let temp: U = zero;
    for (let i = k; i > 0; i--) {
        const divided = divide(coeffs[i], a, env);
        coeffs[i] = temp;
        temp = divided;
        coeffs[i - 1] = subtract(env, coeffs[i - 1], multiply(env, temp, b));
    }
    coeffs[0] = temp;
}

/**
 * Generates a polynomial consisting of the specified coefficients up to the degree k using the variable x.
 * @param x the variable.
 * @param coeffs the coefficients.
 * @param k the degree.
 */
function polynomial(x: U, coeffs: U[], k: number, _: Pick<ExprContext, "valueOf">): U {
    assert_positive_integer(k);
    // return $.valueOf(generate_polynomial_recursive(x,coeffs,k));
    let temp: U = zero;
    for (let i = k; i >= 0; i--) {
        temp = add(_, multiply(_, temp, x), coeffs[i]);
    }
    return temp;
}

function assert_integer(k: number): number {
    if (Number.isInteger(k)) {
        return k;
    } else {
        throw new ProgrammingError();
    }
}

function assert_positive_integer(k: number): number {
    const i = assert_integer(k);
    if (i >= 0) {
        return i;
    } else {
        throw new ProgrammingError();
    }
}

export function generate_polynomial_recursive(x: U, coeffs: U[], k: number): U {
    assert_positive_integer(k);
    if (k === 0) {
        return coeffs[0];
    } else {
        const g_k_minus_1 = generate_polynomial_recursive(x, coeffs, k - 1);
        const x_pow_k = items_to_cons(native_sym(Native.pow), x, create_int(k));
        const a_k = coeffs[k];
        const a_k_times_x_pow_k = items_to_cons(native_sym(Native.multiply), a_k, x_pow_k);
        return items_to_cons(native_sym(Native.add), g_k_minus_1, a_k_times_x_pow_k);
    }
}
