import { Sym } from 'math-expression-atoms';
import { U } from 'math-expression-tree';
import { rational } from './bignum';
import { complex_conjugate } from './complex_conjugate';
import { yycondense } from './condense';
import { ExtensionEnv } from './env/ExtensionEnv';
import { imu } from './env/imu';
import { divide } from './helpers/divide';
import { inverse } from './helpers/inverse';
import { contains_floating_values_or_floatf } from './is';
import { multiply_noexpand, negate_noexpand } from './multiply';
import { coefficients } from './operators/coeff/coeff';
import { denominator } from './operators/denominator/denominator';
import { ydivisors } from './operators/divisors/divisors';
import { lcm } from './operators/lcm/lcm';
import { is_negative } from './predicates/is_negative';
import { quotient } from './quotient';
import { defs, halt, move_top_of_stack, noexpand_unary } from './runtime/defs';
import { stack_pop, stack_push, stack_push_items } from './runtime/stack';
import { create_int, negOne, one, zero } from './tree/rat/Rat';

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
 * @param P polynomial expression
 * @param X polynomial variable
 * @param $ 
 * @returns factored polynomial
 */
export function yyfactorpoly(P: U, X: Sym, $: Pick<ExtensionEnv, 'add' | 'equals' | 'factorize' | 'isone' | 'iszero' | 'multiply' | 'negate' | 'operatorFor' | 'power' | 'pushDirective' | 'popDirective' | 'rect' | 'subtract' | 'valueOf'>): U {
    // console.lg("yyfactorpoly", `${($ as ExtensionEnv).toInfixString(P)}`);
    if (contains_floating_values_or_floatf(P)) {
        halt('floating point numbers in polynomial');
    }

    const cs: U[] = coefficients(P, X, $);
    for (let i = 0; i < cs.length; i++) {
        // console.lg("coefficient", "index", i, `${cs[i]}`);
        // // console.lg("coefficient", "index", i, ($ as ExtensionEnv).toInfixString(cs[i]));
    }

    /**
    * This is the part of the polynomial that has been factorized so far.
    */
    let k = rationalize_coefficients(cs, $);
    // console.lg("factorization", render_as_infix(factorized, $));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cs.forEach(function (c) {
        // console.lg("coefficient", ($ as ExtensionEnv).toInfixString(coefficient));
    });

    // console.lg("k", ($ as ExtensionEnv).toInfixString(k));

    // console.lg(`rationalized coes ${coes}, with k = ${p7}`);

    // for univariate polynomials we could do factpoly_expo > 1
    let findingKind: 'real' | 'complex' = 'real';
    let remainingPoly: U | null = null;
    // TODO: What are these values...
    let p4: U | undefined;
    let p5: U | undefined;
    let p8: U | undefined;
    // We start from the largest coefficient.
    let coeffIdx = cs.length - 1;
    while (coeffIdx > 0) {
        // console.lg("coeffIdx", coeffIdx);
        let foundComplexRoot = false;
        let foundRealRoot = false;
        if ($.iszero(cs[0])) {
            p4 = one;
            p5 = zero;
        }
        else {
            if (findingKind === 'real') {
                [foundRealRoot, p4, p5] = get_factor_from_real_root(cs, coeffIdx, X, p4 as U, p5 as U, $);
                // console.lg("foundRealRoot", foundRealRoot);
                // console.lg("p4", render_as_infix(p4, $));
                // console.lg("p5", render_as_infix(p5, $));
            }
            else if (findingKind === 'complex') {
                [foundComplexRoot, p4] = get_factor_from_complex_root(remainingPoly as U, cs, coeffIdx, $);
                // console.lg("foundComplexRoot", foundRealRoot);
                // console.lg("p4", p4 ? render_as_infix(p4, $) : "undefined");
            }
        }
        // console.lg(`whichRootsAreWeFinding ${whichRootsAreWeFinding}`);
        // console.lg(`foundRealRoot ${foundRealRoot}`);

        if (findingKind === 'real') {
            if (foundRealRoot === false) {
                findingKind = 'complex';
                continue;
            }
            else {
                p8 = $.add($.multiply(p4 as U, X), p5 as U); // A, x, B

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
                k = multiply_noexpand(k, p8, $);

                // ok now on stack we have the coefficients of the
                // remaining part of the polynomial still to factor.
                // Divide it by the newly-found factor so that
                // the stack then contains the coefficients of the
                // polynomial part still left to factor.
                yydivpoly(p4 as U, p5 as U, cs, coeffIdx, $);

                while (coeffIdx && $.iszero(cs[coeffIdx])) {
                    coeffIdx--;
                }

                let temp: U = zero;
                for (let i = 0; i <= coeffIdx; i++) {
                    // p2: the free variable
                    temp = $.add(temp, $.multiply(cs[i], $.power(X, create_int(i))));
                }
                remainingPoly = temp;
            }
        }
        else if (findingKind === 'complex') {
            if (foundComplexRoot === false) {
                break;
            }
            else {
                const firstFactor = $.subtract(p4 as U, X); // A, x
                const secondFactor = $.subtract(complex_conjugate(p4 as U, $ as ExtensionEnv), X); // p4: A, p2: x

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

                const previousK = k;

                k = multiply_noexpand(k, p8, $);

                // build the polynomial of the unfactored part

                if (remainingPoly == null) {
                    let temp: U = zero;
                    for (let i = 0; i <= coeffIdx; i++) {
                        // p2: the free variable
                        temp = $.add(temp, $.multiply(cs[i], $.power(X, create_int(i))));
                    }
                    remainingPoly = temp;
                }

                //push(dividend)
                //degree()
                //startingDegree = pop()

                const divisor = p8;
                const dividend = remainingPoly;
                remainingPoly = quotient(dividend, divisor, X, $ as ExtensionEnv);

                const checkingTheDivision = $.multiply(remainingPoly, p8);

                if (!$.equals(checkingTheDivision, dividend)) {
                    stack_push(previousK);

                    const arg2 = noexpand_unary(yycondense, dividend, $);

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
        temp = $.add(temp, $.multiply(cs[i], $.power(X, create_int(i))));
    }

    // console.lg("temp       II", render_as_infix(temp, $));

    const remaining = noexpand_unary(yycondense, temp, $);

    // console.lg("factorized II", render_as_infix(factorized, $));
    // console.lg("remaining  II", render_as_infix(remaining, $));

    // factor out negative sign

    if (coeffIdx > 0 && is_negative(cs[coeffIdx])) {
        //prev_expanding = expanding
        //expanding = 1
        //expanding = prev_expanding
        return multiply_noexpand(negate_noexpand(k, $ as ExtensionEnv), $.negate(remaining), $);
    }
    else {
        return multiply_noexpand(k, remaining, $);
    }
}

/**
 * e.g. [c,b,a]
 * @param cs This array is mutated as an intended side-effect and we return a value, k, such that
 * multiplication of the mutated coefficient by k recreates the original coefficients.
 */
function rationalize_coefficients(cs: U[], $: Pick<ExtensionEnv, 'add' | 'isone' | 'iszero' | 'multiply' | 'negate' | 'operatorFor' | 'power' | 'pushDirective' | 'popDirective' | 'factorize' | 'subtract' | 'valueOf'>): U {
    // console.lg("rationalize_coefficients", ($ as ExtensionEnv).toSExprString(items_to_cons(...cs)));
    // console.lg(`rationalize_coefficients ${coefficients}`);
    // LCM of all polynomial coefficients
    let one_over_k: U = one;
    for (const coeff of cs) {
        one_over_k = lcm(denominator(coeff, $), one_over_k, $);
    }

    // multiply each coefficient by RESULT
    for (let i = 0; i < cs.length; i++) {
        cs[i] = $.multiply(one_over_k, cs[i]);
    }

    const k = inverse(one_over_k, $);
    return k;
}

/**
 * 
 * @param coeffs 
 * @param coeffIdx 
 * @param X polynomial variable (not actually used). 
 * @param p4 
 * @param p5 
 * @param $ 
 * @returns 
 */
function get_factor_from_real_root(coeffs: U[], coeffIdx: number, X: Sym, p4: U, p5: U, $: Pick<ExtensionEnv, 'add' | 'factorize' | 'isone' | 'iszero' | 'multiply' | 'negate' | 'operatorFor' | 'power' | 'pushDirective' | 'popDirective' | 'subtract' | 'valueOf'>): [boolean, U, U] {
    // console.lg("get_factor_from_real_root", "coeffIdx=>", coeffIdx);
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
            p4 = defs.stack[an + rootsTries_i] as U;
            p5 = defs.stack[a0 + rootsTries_j] as U;

            const neg_p5_div_p4 = $.negate(divide(p5, p4, $));

            // TODO: Why is this typed to return a single element array?
            const [neg_poly] = Evalpoly(neg_p5_div_p4, coeffs, coeffIdx, $);

            if ($.iszero(neg_poly)) {
                move_top_of_stack(h);
                // console.lg("true", "p4", ($ as ExtensionEnv).toInfixString(p4), "p5", ($ as ExtensionEnv).toInfixString(p5));
                return [true, p4, p5];
            }

            p5 = $.negate(p5);

            const p5_div_p4 = $.negate(neg_p5_div_p4);

            const [pos_poly] = Evalpoly(p5_div_p4, coeffs, coeffIdx, $);

            if ($.iszero(pos_poly)) {
                move_top_of_stack(h);
                return [true, p4, p5];
            }
        }
    }

    move_top_of_stack(h);

    // console.lg("false");
    return [false, p4, p5];
}

function get_factor_from_complex_root(remainingPoly: U, polycoeff: U[], factpoly_expo: number, $: Pick<ExtensionEnv, 'add' | 'iszero' | 'multiply' | 'power' | 'rect'>): [boolean, U | undefined] {
    let p4: U | undefined;
    let p3: U, p6: U;

    if (factpoly_expo <= 2) {
        return [false, p4];
    }

    // const p1 = remainingPoly;

    const h = defs.tos;

    // trying -1^(2/3) which generates a polynomial in Z
    // generates x^2 + 2x + 1
    p4 = $.rect($.power(negOne, rational(2, 3)));
    p3 = p4;
    stack_push(p3);
    [p6] = Evalpoly(p3, polycoeff, factpoly_expo, $);
    if ($.iszero(p6)) {
        move_top_of_stack(h);
        return [true, p4];
    }

    // trying 1^(2/3) which generates a polynomial in Z
    // http://www.wolframalpha.com/input/?i=(1)%5E(2%2F3)
    // generates x^2 - 2x + 1
    p4 = $.rect($.power(one, rational(2, 3)));
    p3 = p4;
    stack_push(p3);
    [p6] = Evalpoly(p3, polycoeff, factpoly_expo, $);
    if ($.iszero(p6)) {
        move_top_of_stack(h);
        return [true, p4];
    }

    // trying some simple complex numbers. All of these
    // generate polynomials in Z
    for (let rootsTries_i = -10; rootsTries_i <= 10; rootsTries_i++) {
        for (let rootsTries_j = 1; rootsTries_j <= 5; rootsTries_j++) {
            p4 = $.rect(
                $.add(
                    create_int(rootsTries_i),
                    $.multiply(create_int(rootsTries_j), imu)
                )
            );

            const p3 = p4;

            stack_push(p3);

            const [p6] = Evalpoly(p3, polycoeff, factpoly_expo, $);

            if ($.iszero(p6)) {
                move_top_of_stack(h);
                return [true, p4];
            }
        }
    }

    move_top_of_stack(h);

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
function yydivpoly(p4: U, p5: U, polycoeff: U[], factpoly_expo: number, $: Pick<ExtensionEnv, 'multiply' | 'subtract' | 'valueOf'>): void {
    let p6: U = zero;
    for (let i = factpoly_expo; i > 0; i--) {
        const divided = divide(polycoeff[i], p4, $);
        polycoeff[i] = p6;
        p6 = divided;
        polycoeff[i - 1] = $.subtract(polycoeff[i - 1], $.multiply(p6, p5));
    }
    polycoeff[0] = p6;
}

function Evalpoly(p3: U, coeffs: U[], coeffIdx: number, $: Pick<ExtensionEnv, 'add' | 'multiply'>): [U] {
    // console.lg("Evalpoly", render_as_infix(p3, $), "coeffs", "coeffIdx", coeffIdx);
    let temp: U = zero;
    for (let i = coeffIdx; i >= 0; i--) {
        temp = $.add($.multiply(temp, p3), coeffs[i]);
    }
    const p6 = temp;
    return [p6];
}
