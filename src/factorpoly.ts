import { rational } from './bignum';
import { coeff } from './coeff';
import { complex_conjugate } from './complex_conjugate';
import { yycondense } from './condense';
import { ydivisors } from './divisors';
import { ExtensionEnv } from './env/ExtensionEnv';
import { imu } from './env/imu';
import { contains_floating_values_or_floatf, is_negative_term } from './is';
import { lcm } from './lcm';
import { multiply_noexpand, negate_noexpand } from './multiply';
import { denominator } from './operators/denominator/denominator';
import { divpoly } from './quotient';
import { rect } from './operators/rect/rect';
import { defs, halt, moveTos, use_factoring_with_unary_function } from './runtime/defs';
import { stack_pop, stack_push, stack_push_items } from './runtime/stack';
import { integer, negOne, one, zero } from './tree/rat/Rat';
import { U } from './tree/tree';

// Factor a polynomial

//define POLY p1
//define X p2
//define Z p3
//define A p4
//define B p5
//define Q p6
//define RESULT p7
//define FACTOR p8

/**
 * 
 * @param p1 true polynomial
 * @param p2 free variable
 * @param $ 
 * @returns factored polynomial
 */
export function yyfactorpoly(p1: U, p2: U, $: ExtensionEnv): U {
    // console.lg(`yyfactorpoly ${print_expr(p1, $)} in variable ${print_expr(p2, $)}`);
    let p4: U | undefined;
    let p5: U | undefined;
    let p8: U | undefined;

    if (contains_floating_values_or_floatf(p1)) {
        halt('floating point numbers in polynomial');
    }

    const coes = coeff(p1, p2, $);

    // console.lg(`coes ${coes}`);

    let factpoly_expo = coes.length - 1;

    let p7 = rationalize_coefficients(coes, $);

    // console.lg(`rationalized coes ${coes}, with k = ${p7}`);

    // for univariate polynomials we could do factpoly_expo > 1
    let whichRootsAreWeFinding: 'real' | 'complex' = 'real';
    let remainingPoly: U | null = null;
    while (factpoly_expo > 0) {
        // console.lg(`factpoly_expo ${factpoly_expo}`);
        let foundComplexRoot = false;
        let foundRealRoot = false;
        if ($.isZero(coes[0])) {
            p4 = one;
            p5 = zero;
        }
        else {
            if (whichRootsAreWeFinding === 'real') {
                [foundRealRoot, p4, p5] = get_factor_from_real_root(coes, factpoly_expo, p2, p4 as U, p5 as U, $);
            }
            else if (whichRootsAreWeFinding === 'complex') {
                [foundComplexRoot, p4] = get_factor_from_complex_root(remainingPoly as U, coes, factpoly_expo, $);
            }
        }
        // console.lg(`whichRootsAreWeFinding ${whichRootsAreWeFinding}`);
        // console.lg(`foundRealRoot ${foundRealRoot}`);

        if (whichRootsAreWeFinding === 'real') {
            if (foundRealRoot === false) {
                whichRootsAreWeFinding = 'complex';
                continue;
            }
            else {
                p8 = $.add($.multiply(p4 as U, p2), p5 as U); // A, x, B

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
                p7 = multiply_noexpand(p7, p8, $);

                // ok now on stack we have the coefficients of the
                // remaining part of the polynomial still to factor.
                // Divide it by the newly-found factor so that
                // the stack then contains the coefficients of the
                // polynomial part still left to factor.
                yydivpoly(p4 as U, p5 as U, coes, factpoly_expo, $);

                while (factpoly_expo && $.isZero(coes[factpoly_expo])) {
                    factpoly_expo--;
                }

                let temp: U = zero;
                for (let i = 0; i <= factpoly_expo; i++) {
                    // p2: the free variable
                    temp = $.add(temp, $.multiply(coes[i], $.power(p2, integer(i))));
                }
                remainingPoly = temp;
            }
        }
        else if (whichRootsAreWeFinding === 'complex') {
            if (foundComplexRoot === false) {
                break;
            }
            else {
                const firstFactor = $.subtract(p4 as U, p2); // A, x
                const secondFactor = $.subtract(complex_conjugate(p4 as U, $), p2); // p4: A, p2: x

                p8 = $.multiply(firstFactor, secondFactor);

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

                const previousFactorisation = p7;

                p7 = multiply_noexpand(p7, p8, $);

                // build the polynomial of the unfactored part

                if (remainingPoly == null) {
                    let temp: U = zero;
                    for (let i = 0; i <= factpoly_expo; i++) {
                        // p2: the free variable
                        temp = $.add(temp, $.multiply(coes[i], $.power(p2, integer(i))));
                    }
                    remainingPoly = temp;
                }

                //push(dividend)
                //degree()
                //startingDegree = pop()

                const X = p2;
                const divisor = p8;
                const dividend = remainingPoly;
                remainingPoly = divpoly(dividend, divisor, X, $);

                const checkingTheDivision = $.multiply(remainingPoly, p8);

                if (!$.equals(checkingTheDivision, dividend)) {
                    stack_push(previousFactorisation);

                    const arg2 = use_factoring_with_unary_function(yycondense, dividend, $);

                    const arg1 = stack_pop();
                    return multiply_noexpand(arg1, arg2, $);
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
                for (let i = 0; i <= factpoly_expo; i++) {
                    coes.pop();
                }

                coes.push(...coeff(remainingPoly, p2, $));

                factpoly_expo -= 2;
            }
        }
    }

    // build the remaining unfactored part of the polynomial

    let temp: U = zero;
    for (let i = 0; i <= factpoly_expo; i++) {
        // p2: the free variable
        temp = $.add(temp, $.multiply(coes[i], $.power(p2, integer(i))));
    }
    p1 = temp;

    p1 = use_factoring_with_unary_function(yycondense, p1, $);

    // factor out negative sign

    if (factpoly_expo > 0 && is_negative_term(coes[factpoly_expo])) {
        //prev_expanding = expanding
        //expanding = 1
        //expanding = prev_expanding
        p1 = $.negate(p1);
        p7 = negate_noexpand(p7, $);
    }

    p7 = multiply_noexpand(p7, p1, $);

    return p7;
}

/**
 * e.g. [c,b,a]
 * @param coefficients This array is mutated as an intended side-effect and we return a value, k, such that
 * multiplication of the mutated coefficient by k recreates the original coefficients.
 */
function rationalize_coefficients(coefficients: U[], $: ExtensionEnv): U {
    // console.lg(`rationalize_coefficients ${coefficients}`);
    // LCM of all polynomial coefficients
    let one_over_k: U = one;
    for (const coeff of coefficients) {
        one_over_k = lcm(denominator(coeff, $), one_over_k, $);
    }

    // multiply each coefficient by RESULT
    for (let i = 0; i < coefficients.length; i++) {
        coefficients[i] = $.multiply(one_over_k, coefficients[i]);
    }

    const k = $.inverse(one_over_k);
    return k;
}

/**
 * 
 * @param polycoeff 
 * @param factpoly_expo 
 * @param p2 
 * @param p4 
 * @param p5 
 * @param $ 
 * @returns 
 */
function get_factor_from_real_root(polycoeff: U[], factpoly_expo: number, p2: U, p4: U, p5: U, $: ExtensionEnv): [boolean, U, U] {

    const h = defs.tos;

    const an = defs.tos;
    stack_push_items(ydivisors(polycoeff[factpoly_expo], $));
    const nan = defs.tos - an;

    const a0 = defs.tos;
    stack_push_items(ydivisors(polycoeff[0], $));
    const na0 = defs.tos - a0;

    // try roots
    for (let rootsTries_i = 0; rootsTries_i < nan; rootsTries_i++) {
        for (let rootsTries_j = 0; rootsTries_j < na0; rootsTries_j++) {
            p4 = defs.stack[an + rootsTries_i] as U;
            p5 = defs.stack[a0 + rootsTries_j] as U;

            const neg_p5_div_p4 = $.negate($.divide(p5, p4));

            // TODO: Why is this typed to return a single element array?
            const [neg_poly] = Evalpoly(neg_p5_div_p4, polycoeff, factpoly_expo, $);

            if ($.isZero(neg_poly)) {
                moveTos(h);
                return [true, p4, p5];
            }

            p5 = $.negate(p5);

            const p5_div_p4 = $.negate(neg_p5_div_p4);

            const [pos_poly] = Evalpoly(p5_div_p4, polycoeff, factpoly_expo, $);

            if ($.isZero(pos_poly)) {
                moveTos(h);
                return [true, p4, p5];
            }
        }
    }

    moveTos(h);

    return [false, p4, p5];
}

function get_factor_from_complex_root(remainingPoly: U, polycoeff: U[], factpoly_expo: number, $: ExtensionEnv): [boolean, U | undefined] {
    let p4: U | undefined;
    let p3: U, p6: U;

    if (factpoly_expo <= 2) {
        return [false, p4];
    }

    // const p1 = remainingPoly;

    const h = defs.tos;

    // trying -1^(2/3) which generates a polynomial in Z
    // generates x^2 + 2x + 1
    p4 = rect($.power(negOne, rational(2, 3)), $);
    p3 = p4;
    stack_push(p3);
    [p6] = Evalpoly(p3, polycoeff, factpoly_expo, $);
    if ($.isZero(p6)) {
        moveTos(h);
        return [true, p4];
    }

    // trying 1^(2/3) which generates a polynomial in Z
    // http://www.wolframalpha.com/input/?i=(1)%5E(2%2F3)
    // generates x^2 - 2x + 1
    p4 = rect($.power(one, rational(2, 3)), $);
    p3 = p4;
    stack_push(p3);
    [p6] = Evalpoly(p3, polycoeff, factpoly_expo, $);
    if ($.isZero(p6)) {
        moveTos(h);
        return [true, p4];
    }

    // trying some simple complex numbers. All of these
    // generate polynomials in Z
    for (let rootsTries_i = -10; rootsTries_i <= 10; rootsTries_i++) {
        for (let rootsTries_j = 1; rootsTries_j <= 5; rootsTries_j++) {
            p4 = rect(
                $.add(
                    integer(rootsTries_i),
                    $.multiply(integer(rootsTries_j), imu)
                ),
                $
            );

            const p3 = p4;

            stack_push(p3);

            const [p6] = Evalpoly(p3, polycoeff, factpoly_expo, $);

            if ($.isZero(p6)) {
                moveTos(h);
                return [true, p4];
            }
        }
    }

    moveTos(h);

    return [false, p4];
}

//-----------------------------------------------------------------------------
//
//  Divide a polynomial by Ax+B
//
//  Input:  on stack:  polycoeff  Dividend coefficients
//
//      factpoly_expo    Degree of dividend
//
//      A (p4)    As above
//
//      B (p5)    As above
//
//  Output:   on stack: polycoeff  Contains quotient coefficients
//
//-----------------------------------------------------------------------------
function yydivpoly(p4: U, p5: U, polycoeff: U[], factpoly_expo: number, $: ExtensionEnv): void {
    let p6: U = zero;
    for (let i = factpoly_expo; i > 0; i--) {
        const divided = $.divide(polycoeff[i], p4);
        polycoeff[i] = p6;
        p6 = divided;
        polycoeff[i - 1] = $.subtract(polycoeff[i - 1], $.multiply(p6, p5));
    }
    polycoeff[0] = p6;
}

function Evalpoly(p3: U, polycoeff: U[], factpoly_expo: number, $: ExtensionEnv): [U] {
    let temp: U = zero;
    for (let i = factpoly_expo; i >= 0; i--) {
        temp = $.add($.multiply(temp, p3), polycoeff[i]);
    }
    const p6 = temp;
    return [p6];
}
