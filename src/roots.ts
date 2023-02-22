import { rational } from './bignum';
import { add_terms } from './calculators/add/add_terms';
import { coeff } from './operators/coeff/coeff';
import { ExtensionEnv } from './env/ExtensionEnv';
import { imu } from './env/imu';
import { guess } from './guess';
import { is_complex_number, is_poly_expanded_form, is_positive_integer } from './is';
import { sort } from './misc';
import { simplify } from './operators/simplify/simplify';
import { ASSIGN, SECRETX, TESTEQ } from './runtime/constants';
import { defs, halt } from './runtime/defs';
import { implicate } from './runtime/execute';
import { is_multiply, is_power } from './runtime/helpers';
import { float_eval_abs_eval } from './scripting/float_eval_abs_eval';
import { caddr, cadr } from './tree/helpers';
import { eight, four, half, wrap_as_int, negFour, negOne, nine, one, third, three, two } from './tree/rat/Rat';
import { Tensor } from './tree/tensor/Tensor';
import { car, Cons, NIL, U } from './tree/tree';

// define POLY p1
// define X p2
// define A p3
// define B p4
// define C p5
// define Y p6

export function Eval_roots(expr: Cons, $: ExtensionEnv): U {
    // console.lg(`Eval_roots expr=${print_expr(expr, $)}`);
    // A == B -> A - B
    const arg1 = cadr(expr);
    let poly: U;
    if (car(arg1).equals(ASSIGN) || car(arg1).equals(TESTEQ)) {
        poly = $.subtract($.valueOf(cadr(arg1)), $.valueOf(caddr(arg1)));
    }
    else {
        const vArg1 = $.valueOf(arg1);
        if (car(vArg1).equals(ASSIGN) || car(vArg1).equals(TESTEQ)) {
            poly = $.subtract($.valueOf(cadr(vArg1)), $.valueOf(caddr(vArg1)));
        }
        else {
            poly = vArg1;
        }
    }

    // 2nd arg, x
    const arg2 = $.valueOf(caddr(expr));

    const x = NIL === arg2 ? guess(poly) : arg2;

    // console.lg(`poly=${print_expr(poly, $)}`);
    // console.lg(`var =${print_expr(x, $)}`);

    const p = implicate(poly, $);

    if (is_poly_expanded_form(p, x, $)) {
        return roots(poly, x, $);
    }
    else {
        halt('roots: 1st argument is not a polynomial in the variable ' + $.toInfixString(x));
    }
}

function hasImaginaryCoeff(k: U[]): boolean {
    return k.some((c) => is_complex_number(c));
}

/**
 * If the normalized coefficients are sufficiently simple then the polynomial is considered simple.
 * k[0]      Coefficient of x^0
 * k[n-1]    Coefficient of x^(n-1)
 * @param ks 
 * @param $ 
 * @returns 
 */
function is_simple_root(ks: U[], $: ExtensionEnv): boolean {
    if (ks.length <= 2) {
        return false;
    }
    if ($.isZero(ks[0])) {
        return false;
    }
    return ks.slice(1, ks.length - 1).every((el) => $.isZero(el));
}

/**
 * Computes the coefficients of the polynomial then divides each by the highest power coefficient.
 * The coefficients are returned in the order [c0, c1, c2, ..., 1] where c0 is the constant coefficient.
 */
function normalized_coeff(poly: U, x: U, $: ExtensionEnv): U[] {
    // console.lg(`normalized_coeff ${print_expr(poly, $)} in variable ${print_expr(x, $)}`);

    const coes = coeff(poly, x, $);
    // console.lg(`coes=${coes}`);
    const divideBy = coes[coes.length - 1];
    return coes.map((coe) => $.divide(coe, divideBy));
}

/**
 * 
 * @param poly 
 * @param x 
 * @returns 
 */
export function roots(poly: U, x: U, $: ExtensionEnv): Tensor {
    // console.lg(`roots ${print_expr(poly, $)} in variable ${print_expr(x, $)}`);
    // the simplification of nested radicals uses "roots", which in turn uses
    // simplification of nested radicals. Usually there is no problem, one level
    // of recursion does the job. Beyond that, we probably got stuck in a
    // strange case of infinite recursion, so bail out and return NIL.
    if (defs.recursionLevelNestedRadicalsRemoval > 1) {
        // console.lg(`recursionLevelNestedRadicalsRemoval => ${defs.recursionLevelNestedRadicalsRemoval}`)
        return new Tensor([], []);
    }

    // log.dbg(`checking if ${top()} is a case of simple roots`);

    const ks = normalized_coeff(poly, x, $);

    // console.lg(`ks=${ks}`);

    const results = [];
    if (is_simple_root(ks, $)) {
        const kn = ks.length;
        const lastCoeff = ks[0];
        const leadingCoeff: U = ks.pop() as U;
        const simpleRoots = getSimpleRoots(kn, leadingCoeff, lastCoeff, $);
        results.push(...simpleRoots);
    }
    else {
        const roots = roots2(poly, x, $);
        // console.lg(`roots2 => ${roots}`);
        results.push(...roots);
    }

    const n = results.length;
    if (n === 0) {
        halt('roots: the polynomial is not factorable, try nroots');
    }
    if (n === 1) {
        return new Tensor([1], results);
    }
    sort(results, $);
    const dims = [n];
    return new Tensor(dims, results);
}

// ok to generate these roots take a look at their form
// in the case of even and odd exponents here:
// http://www.wolframalpha.com/input/?i=roots+x%5E14+%2B+1
// http://www.wolframalpha.com/input/?i=roots+ax%5E14+%2B+b
// http://www.wolframalpha.com/input/?i=roots+x%5E15+%2B+1
// http://www.wolframalpha.com/input/?i=roots+a*x%5E15+%2B+b
// leadingCoeff    Coefficient of x^0
// lastCoeff       Coefficient of x^(n-1)
function getSimpleRoots(n: number, leadingCoeff: U, lastCoeff: U, $: ExtensionEnv): U[] {
    // log.dbg('getSimpleRoots');

    n = n - 1;

    const commonPart = $.divide($.power(lastCoeff, rational(1, n)), $.power(leadingCoeff, rational(1, n)));
    const results = [];

    if (n % 2 === 0) {
        for (let i = 1; i <= n; i += 2) {
            const aSol = $.multiply(
                commonPart,
                $.power(negOne, rational(i, n))
            );
            results.push(aSol);
            results.push($.negate(aSol));
        }
        return results;
    }

    for (let i = 1; i <= n; i++) {
        let sol = $.multiply(commonPart, $.power(negOne, rational(i, n)));
        if (i % 2 === 0) {
            sol = $.negate(sol);
        }
        results.push(sol);
    }
    return results;
}

function roots2(poly: U, X: U, $: ExtensionEnv): U[] {
    // console.lg(`roots2 ${print_expr(poly, $)} in variable ${print_expr(X, $)}`);
    const ks = normalized_coeff(poly, X, $);
    if (!hasImaginaryCoeff(ks)) {
        poly = $.factorize(poly, X);
    }
    // TODO; This won't work unless the ploynomial is in implicated form.
    if (is_multiply(poly)) {
        // scan through all the factors and find the roots of each of them
        const mapped = poly.tail().map((p) => roots3(p, X, $));
        return mapped.flat();
    }
    return roots3(poly, X, $);
}

function roots3(POLY: U, X: U, $: ExtensionEnv): U[] {
    if (
        is_power(POLY) &&
        is_poly_expanded_form(cadr(POLY), X, $) &&
        is_positive_integer(caddr(POLY))
    ) {
        const n = normalized_coeff(cadr(POLY), X, $);
        return mini_solve(n, $);
    }
    if (is_poly_expanded_form(POLY, X, $)) {
        const n = normalized_coeff(POLY, X, $);
        return mini_solve(n, $);
    }
    return [];
}

// note that for many quadratic, cubic and quartic polynomials we don't
// actually end up using the quadratic/cubic/quartic formulas in here,
// since there is a chance we factored the polynomial and in so
// doing we found some solutions and lowered the degree.
function mini_solve(coefficients: U[], $: ExtensionEnv): U[] {
    const n = coefficients.length;

    // AX + B, X = -B/A
    if (n === 2) {
        const A = coefficients.pop() as U;
        const B = coefficients.pop() as U;
        return _solveDegree1(A, B, $);
    }

    // AX^2 + BX + C, X = (-B +/- (B^2 - 4AC)^(1/2)) / (2A)
    if (n === 3) {
        const A = coefficients.pop() as U;
        const B = coefficients.pop() as U;
        const C = coefficients.pop() as U;
        return _solveDegree2(A, B, C, $);
    }

    if (n === 4) {
        const A = coefficients.pop() as U;
        const B = coefficients.pop() as U;
        const C = coefficients.pop() as U;
        const D = coefficients.pop() as U;
        return _solveDegree3(A, B, C, D, $);
    }

    // See http://www.sscc.edu/home/jdavidso/Math/Catalog/Polynomials/Fourth/Fourth.html
    // for a description of general shapes and properties of fourth degree polynomials
    if (n === 5) {
        const A = coefficients.pop() as U;
        const B = coefficients.pop() as U;
        const C = coefficients.pop() as U;
        const D = coefficients.pop() as U;
        const E = coefficients.pop() as U;
        return _solveDegree4(A, B, C, D, E, $);
    }

    return [];
}

function _solveDegree1(A: U, B: U, $: ExtensionEnv): U[] {
    return [$.negate($.divide(B, A))];
}

function _solveDegree2(A: U, B: U, C: U, $: ExtensionEnv): U[] {
    // (B^2 - 4AC)^(1/2)
    const p6 = $.power($.subtract($.power(B, two), $.multiply($.multiply(four, A), C)), half);

    // ((B^2 - 4AC)^(1/2) - B)/ (2A)
    const result1 = $.divide($.subtract(p6, B), $.multiply(A, two));

    // 1/2 * -(B + (B^2 - 4AC)^(1/2)) / A
    const result2 = $.multiply($.divide($.negate($.add(p6, B)), A), half);
    return [result1, result2];
}

function _solveDegree3(A: U, B: U, C: U, D: U, $: ExtensionEnv): U[] {
    // C - only related calculations
    const R_c3 = $.multiply($.multiply(C, C), C);

    // B - only related calculations
    const R_b2 = $.multiply(B, B);

    const R_b3 = $.multiply(R_b2, B);

    const R_m4_b3_d = $.multiply($.multiply(R_b3, D), negFour);

    const R_2_b3 = $.multiply(R_b3, two);

    // A - only related calculations
    const R_3_a = $.multiply(three, A);

    const R_a2_d = $.multiply($.multiply(A, A), D);

    const R_27_a2_d = $.multiply(R_a2_d, wrap_as_int(27));

    const R_m27_a2_d2 = $.multiply($.multiply(R_a2_d, D), wrap_as_int(-27));

    // mixed calculations
    const R_a_b_c = $.multiply($.multiply(A, C), B);

    const R_3_a_c = $.multiply($.multiply(A, C), three);

    const R_m4_a_c3 = $.multiply(negFour, $.multiply(A, R_c3));

    const R_m9_a_b_c = $.negate($.multiply(R_a_b_c, nine));

    const R_18_a_b_c_d = $.multiply($.multiply(R_a_b_c, D), wrap_as_int(18));

    const R_DELTA0 = $.subtract(R_b2, R_3_a_c);

    const R_b2_c2 = $.multiply(R_b2, $.multiply(C, C));

    const R_m_b_over_3a = $.divide($.negate(B), R_3_a);

    const R_4_DELTA03 = $.multiply($.power(R_DELTA0, three), four);

    const R_DELTA0_toBeCheckedIfZero = float_eval_abs_eval(simplify(R_DELTA0, $), $);

    const R_determinant = float_eval_abs_eval(simplify(add_terms([R_18_a_b_c_d, R_m4_b3_d, R_b2_c2, R_m4_a_c3, R_m27_a2_d2], $), $), $);
    const R_DELTA1 = add_terms([R_2_b3, R_m9_a_b_c, R_27_a2_d], $);
    const R_Q = simplify($.power($.subtract($.power(R_DELTA1, two), R_4_DELTA03), half), $);

    // log.dbg('>>>>>>>>>>>>>>>> actually using cubic formula <<<<<<<<<<<<<<< ');
    // log.dbg(`cubic: D0: ${toInfixString(R_DELTA0)}`);
    // log.dbg(`cubic: D0 as float: ${toInfixString(R_DELTA0_toBeCheckedIfZero)}`);
    // log.dbg(`cubic: DETERMINANT: ${toInfixString(R_determinant)}`);
    // log.dbg(`cubic: D1: ${toInfixString(R_DELTA1)}`);

    if ($.isZero(R_determinant)) {
        const data = {
            R_DELTA0_toBeCheckedIfZero,
            R_m_b_over_3a,
            R_DELTA0,
            R_b3,
            R_a_b_c,
        };
        return _solveDegree3ZeroRDeterminant(A, B, C, D, data, $);
    }

    let C_CHECKED_AS_NOT_ZERO = false;
    let flipSignOFQSoCIsNotZero = false;

    let R_C: U = NIL;
    // C will go as denominator, we have to check that is not zero
    while (!C_CHECKED_AS_NOT_ZERO) {
        const arg1 = flipSignOFQSoCIsNotZero ? $.negate(R_Q) : R_Q;
        R_C = simplify($.power($.multiply($.add(arg1, R_DELTA1), half), third), $);
        const R_C_simplified_toCheckIfZero = float_eval_abs_eval(simplify(R_C, $), $);

        // log.dbg(`cubic: C: ${toInfixString(R_C)}`);
        // log.dbg(`cubic: C as absval and float: ${toInfixString(R_C_simplified_toCheckIfZero)}`);

        if ($.isZero(R_C_simplified_toCheckIfZero)) {
            // log.dbg(' cubic: C IS ZERO flipping the sign');
            flipSignOFQSoCIsNotZero = true;
        }
        else {
            C_CHECKED_AS_NOT_ZERO = true;
        }
    }

    const R_6_a_C = $.multiply($.multiply(R_C, R_3_a), two);

    // imaginary parts calculations
    const i_sqrt3 = $.multiply(imu, $.power(three, half));
    const one_plus_i_sqrt3 = $.add(one, i_sqrt3);
    const one_minus_i_sqrt3 = $.subtract(one, i_sqrt3);
    const R_C_over_3a = $.divide(R_C, R_3_a);

    // first solution
    const firstSolTerm1 = R_m_b_over_3a;
    const firstSolTerm2 = $.negate(R_C_over_3a);
    const firstSolTerm3 = $.negate($.divide(R_DELTA0, $.multiply(R_C, R_3_a)));
    const firstSolution = simplify(add_terms([firstSolTerm1, firstSolTerm2, firstSolTerm3], $), $);

    // second solution
    const secondSolTerm1 = R_m_b_over_3a;
    const secondSolTerm2 = $.divide($.multiply(R_C_over_3a, one_plus_i_sqrt3), two);
    const secondSolTerm3 = $.divide($.multiply(one_minus_i_sqrt3, R_DELTA0), R_6_a_C);
    const secondSolution = simplify(add_terms([secondSolTerm1, secondSolTerm2, secondSolTerm3], $), $);

    // third solution
    const thirdSolTerm1 = R_m_b_over_3a;
    const thirdSolTerm2 = $.divide($.multiply(R_C_over_3a, one_minus_i_sqrt3), two);
    const thirdSolTerm3 = $.divide($.multiply(one_plus_i_sqrt3, R_DELTA0), R_6_a_C);
    const thirdSolution = simplify(add_terms([thirdSolTerm1, thirdSolTerm2, thirdSolTerm3], $), $);

    return [firstSolution, secondSolution, thirdSolution];
}

interface CommonArgs4ZeroRDeterminant {
    R_DELTA0_toBeCheckedIfZero: U;
    R_m_b_over_3a: U;
    R_DELTA0: U;
    R_b3: U;
    R_a_b_c: U;
}

function _solveDegree3ZeroRDeterminant(
    A: U,
    B: U,
    C: U,
    D: U,
    common: CommonArgs4ZeroRDeterminant,
    $: ExtensionEnv
): U[] {
    const {
        R_DELTA0_toBeCheckedIfZero,
        R_m_b_over_3a,
        R_DELTA0,
        R_b3,
        R_a_b_c,
    } = common;
    if ($.isZero(R_DELTA0_toBeCheckedIfZero)) {
        // log.dbg(' cubic: DETERMINANT IS ZERO and delta0 is zero');
        return [R_m_b_over_3a]; // just same solution three times
    }
    // log.dbg(' cubic: DETERMINANT IS ZERO and delta0 is not zero');

    const rootSolution = $.divide($.subtract($.multiply(A, $.multiply(D, nine)), $.multiply(B, C)),
        $.multiply(R_DELTA0, two)
    );

    // second solution here

    // -9*b^3
    const numer_term1 = $.negate(R_b3);
    // -9a*a*d
    const numer_term2 = $.negate($.multiply(A, $.multiply(A, $.multiply(D, nine))));
    // 4*a*b*c
    const numer_term3 = $.multiply(R_a_b_c, four);

    // build the fraction
    // numerator: sum the three terms
    // denominator: a*delta0
    const secondSolution = $.divide(add_terms([numer_term3, numer_term2, numer_term1], $), $.multiply(A, R_DELTA0));

    return [rootSolution, rootSolution, secondSolution];
}

function _solveDegree4(A: U, B: U, C: U, D: U, E: U, $: ExtensionEnv): U[] {
    // log.dbg('>>>>>>>>>>>>>>>> actually using quartic formula <<<<<<<<<<<<<<< ');

    if (
        $.isZero(B) &&
        $.isZero(D) &&
        !$.isZero(C) &&
        !$.isZero(E)
    ) {
        return _solveDegree4Biquadratic(A, B, C, D, E, $);
    }

    if (!$.isZero(B)) {
        return _solveDegree4NonzeroB(A, B, C, D, E, $);
    }
    else {
        return _solveDegree4ZeroB(A, B, C, D, E, $);
    }
}

function _solveDegree4Biquadratic(A: U, B: U, C: U, D: U, E: U, $: ExtensionEnv): U[] {
    // log.dbg('biquadratic case');

    const biquadraticSolutions = roots(
        $.add(
            $.multiply(A, $.power(SECRETX, two)),
            $.add($.multiply(C, SECRETX), E)
        ),
        SECRETX,
        $
    );

    const results = [];
    for (const sol of biquadraticSolutions.copyElements()) {
        results.push(simplify($.power(sol, half), $));
        results.push(simplify($.negate($.power(sol, half)), $));
    }

    return results;
}

function _solveDegree4ZeroB(A: U, B: U, C: U, D: U, E: U, $: ExtensionEnv): U[] {
    const R_p = C;
    const R_q = D;
    const R_r = E;

    // Ferrari's solution
    // https://en.wikipedia.org/wiki/Quartic_function#Ferrari.27s_solution
    // finding the "m" in the depressed equation
    const coeff2 = $.multiply(rational(5, 2), R_p);
    const coeff3 = $.subtract($.multiply(two, $.power(R_p, two)), R_r);
    const coeff4 = $.add(
        $.multiply(rational(-1, 2), $.multiply(R_p, R_r)),
        $.add(
            $.divide($.power(R_p, three), two),
            $.multiply(rational(-1, 8), $.power(R_q, two))
        )
    );

    const arg1 = $.add(
        $.power(SECRETX, three),
        $.add(
            $.multiply(coeff2, $.power(SECRETX, two)),
            $.add($.multiply(coeff3, SECRETX), coeff4)
        )
    );

    // log.dbg(`resolventCubic: ${top()}`);

    const resolventCubicSolutions = roots(arg1, SECRETX, $);
    // log.dbg(`resolventCubicSolutions: ${toInfixString(resolventCubicSolutions)}`);

    let R_m: U = NIL;
    //R_m = resolventCubicSolutions.elem[1]
    for (const sol of resolventCubicSolutions.copyElements()) {
        // log.dbg(`examining solution: ${toInfixString(sol)}`);

        const toBeCheckedIfZero = float_eval_abs_eval($.add($.multiply(sol, two), R_p), $);
        // log.dbg(`abs value is: ${toInfixString(sol)}`);

        if (!$.isZero(toBeCheckedIfZero)) {
            R_m = sol;
            break;
        }
    }

    // log.dbg(`chosen solution: ${toInfixString(R_m)}`);

    const sqrtPPlus2M = simplify($.power($.add($.multiply(R_m, two), R_p), half), $);

    const twoQOversqrtPPlus2M = simplify($.divide($.multiply(R_q, two), sqrtPPlus2M), $);

    const threePPlus2M = $.add($.multiply(R_p, three), $.multiply(R_m, two));
    // solution1
    const sol1Arg = simplify($.power($.negate($.add(threePPlus2M, twoQOversqrtPPlus2M)), half), $);
    const solution1 = $.divide($.add(sqrtPPlus2M, sol1Arg), two);

    // solution2
    const sol2Arg = simplify($.power($.negate($.add(threePPlus2M, twoQOversqrtPPlus2M)), half), $);
    const solution2 = $.divide($.subtract(sqrtPPlus2M, sol2Arg), two);

    // solution3
    const sol3Arg = simplify($.power($.negate($.subtract(threePPlus2M, twoQOversqrtPPlus2M)), half), $);
    const solution3 = $.divide($.add($.negate(sqrtPPlus2M), sol3Arg), two);

    // solution4
    const sol4Arg = simplify($.power($.negate($.subtract(threePPlus2M, twoQOversqrtPPlus2M)), half), $);
    const solution4 = $.divide($.subtract($.negate(sqrtPPlus2M), sol4Arg), two);

    return [solution1, solution2, solution3, solution4];
}

function _solveDegree4NonzeroB(A: U, B: U, C: U, D: U, E: U, $: ExtensionEnv): U[] {
    const R_p = $.divide(
        $.add(
            $.multiply(eight, $.multiply(C, A)),
            $.multiply(wrap_as_int(-3), $.power(B, two))
        ),
        $.multiply(eight, $.power(A, two))
    );
    const R_q = $.divide(
        $.add(
            $.power(B, three),
            $.add(
                $.multiply(negFour, $.multiply(A, $.multiply(B, C))),
                $.multiply(eight, $.multiply(D, $.power(A, two)))
            )
        ),
        $.multiply(eight, $.power(A, three))
    );
    const R_a3 = $.multiply($.multiply(A, A), A);
    const R_b2 = $.multiply(B, B);
    const R_a2_d = $.multiply($.multiply(A, A), D);

    // convert to depressed quartic
    const R_r = $.divide(
        $.add(
            $.multiply($.power(B, four), wrap_as_int(-3)),
            $.add(
                $.multiply(wrap_as_int(256), $.multiply(R_a3, E)),
                $.add(
                    $.multiply(wrap_as_int(-64), $.multiply(R_a2_d, B)),
                    $.multiply(wrap_as_int(16), $.multiply(R_b2, $.multiply(A, C)))
                )
            )
        ),
        $.multiply(wrap_as_int(256), $.power(A, four))
    );
    const four_x_4 = $.power(SECRETX, four);
    const r_q_x_2 = $.multiply(R_p, $.power(SECRETX, two));
    const r_q_x = $.multiply(R_q, SECRETX);
    const simplified = simplify(add_terms([four_x_4, r_q_x_2, r_q_x, R_r], $), $);
    const depressedSolutions = roots(simplified, SECRETX, $);

    // log.dbg(`p for depressed quartic: ${toInfixString(R_p)}`);
    // log.dbg(`q for depressed quartic: ${toInfixString(R_q)}`);
    // log.dbg(`r for depressed quartic: ${toInfixString(R_r)}`);
    // log.dbg(`tos 4 ${defs.tos}`);
    // log.dbg(`4 * x^4: ${toInfixString(four_x_4)}`);
    // log.dbg(`R_p * x^2: ${toInfixString(r_q_x_2)}`);
    // log.dbg(`R_q * x: ${toInfixString(r_q_x)}`);
    // log.dbg(`R_r: ${toInfixString(R_r)}`);
    // log.dbg(`solving depressed quartic: ${toInfixString(simplified)}`);
    // log.dbg(`depressedSolutions: ${toInfixString(depressedSolutions)}`);

    return depressedSolutions.mapElements((sol) => {
        const result = simplify($.subtract(sol, $.divide(B, $.multiply(four, A))), $);
        // log.dbg(`solution from depressed: ${toInfixString(result)}`);
        return result;
    });
}
