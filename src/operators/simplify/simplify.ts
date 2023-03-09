import { nativeDouble } from '../../bignum';
import { add_terms } from '../../calculators/add/add_terms';
import { condense, yycondense } from '../../condense';
import { ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from '../../env/ExtensionEnv';
import { divide } from '../../helpers/divide';
import { inverse } from '../../helpers/inverse';
import { equalq, is_num_and_eq_minus_one, is_plus_or_minus_one } from '../../is';
import { length_of_cons_otherwise_zero } from '../../length_of_cons_or_zero';
import { makeList } from '../../makeList';
import { multiply_noexpand } from '../../multiply';
import { is_negative_number } from '../../predicates/is_negative_number';
import { roots } from '../../roots';
import { ADD, COS, do_simplify_nested_radicals, FACTORIAL, FUNCTION, MULTIPLY, POWER, SECRETX, SIN, TRANSPOSE } from '../../runtime/constants';
import { count, countOccurrencesOfSymbol } from '../../runtime/count';
import { DEBUG, defs, noexpand_unary } from '../../runtime/defs';
import { is_add, is_inner_or_dot, is_multiply, is_power } from '../../runtime/helpers';
import { stack_pop } from '../../runtime/stack';
import { simfac } from '../../simfac';
import { caddr, cadr } from '../../tree/helpers';
import { half, one, third, three, two, create_int, zero } from '../../tree/rat/Rat';
import { Sym } from '../../tree/sym/Sym';
import { Tensor } from '../../tree/tensor/Tensor';
import { car, cdr, is_cons, nil, U } from '../../tree/tree';
import { clockform } from '../clock/clock';
import { denominator } from "../denominator/denominator";
import { factor } from "../factor/factor";
import { evaluate_as_float } from '../float/float';
import { areunivarpolysfactoredorexpandedform, gcd } from "../gcd/gcd";
import { BCons } from '../helpers/BCons';
import { is_imu } from '../imu/is_imu';
import { is_num } from '../num/is_num';
import { numerator } from "../numerator/numerator";
import { polar } from '../polar/polar';
import { is_pow_2_any_any } from '../pow/is_pow_2_any_any';
import { is_rat } from '../rat/is_rat';
import { rationalize_factoring } from '../rationalize/rationalize';
import { real } from '../real/real';
import { rect } from '../rect/rect';
import { is_tensor } from '../tensor/is_tensor';
import { transpose_factoring } from '../transpose/transpose';

function simplify_if_codegen(expr: U, $: ExtensionEnv): U {
    // when we do code generation, we proceed to
    // fully evaluate and simplify the body of
    // a function, so we resolve all variables
    // indirections and we simplify everything
    // we can given the current assignments.
    if (defs.codeGen && car(expr).equals(FUNCTION)) {
        const fbody = cadr(expr);
        // let's simplify the body so we give it a
        // compact form
        const p3 = simplify($.valueOf(fbody), $);

        // replace the evaled body
        const args = caddr(expr); // p5 is B

        return makeList(FUNCTION, p3, args);
    }
    else {
        return expr;
    }
}

function simplify_if_contains_factorial(expr: U, $: ExtensionEnv): U {
    if (expr.contains(FACTORIAL)) {
        const p2 = simfac(expr, $);
        const p3 = simfac(rationalize_factoring(expr, $), $);
        return count(p2) < count(p3) ? p2 : p3;
    }
    else {
        return expr;
    }
}

export function simplify(expr: U, $: ExtensionEnv): U {
    // console.lg(`ENTERING simplify ${$.toInfixString(expr)}`);
    const hook = function (retval: U): U {
        // console.lg(`LEAVING simplify ${$.toInfixString(expr)} => ${$.toInfixString(retval)}`);
        // console.lg(`LEAVING simplify ${$.toListString(expr)} => ${$.toInfixString(retval)}`);
        return retval;
    };

    const scode = simplify_if_codegen(expr, $);

    if (is_tensor(scode)) {
        return hook(simplify_tensor(scode, $));
    }

    const sfact = simplify_if_contains_factorial(expr, $);

    // console.lg(`0 ${$.toInfixString(sfact)}`);

    let p1 = simplify_by_i_dunno_what(sfact, $);
    // console.lg(`A ${$.toInfixString(p1)}`);

    p1 = simplify_by_rationalizing(p1, $);
    // console.lg(`B ${$.toInfixString(p1)}`);

    p1 = simplify_by_condensing(p1, $);
    // console.lg(`C ${$.toInfixString(p1)}`);

    p1 = simplify_a_minus_b_divided_by_b_minus_a(p1, $);
    // console.lg(`D ${$.toInfixString(p1)}`);

    p1 = simplify_by_expanding_denominators(p1, $);
    // console.lg(`E ${$.toInfixString(p1)}`);

    p1 = simplify_trig(p1, $);
    // console.lg(`F ${$.toInfixString(p1)}`);

    p1 = simplify_terms(p1, $);
    // console.lg(`G ${$.toInfixString(p1)}`);

    p1 = simplify_polarRect(p1, $);
    // console.lg(`H ${$.toInfixString(p1)}`);

    if (do_simplify_nested_radicals) {
        let simplify_nested_radicalsResult: TFLAGS;
        [simplify_nested_radicalsResult, p1] = simplify_nested_radicals(p1, $);
        // console.lg(`I ${$.toInfixString(p1)}`);
        // if there is some de-nesting then
        // re-run a simplification because
        // the shape of the expression might
        // have changed significantly.
        // e.g. simplify(14^(1/2) - (16 - 4*7^(1/2))^(1/2))
        // needs some more simplification after the de-nesting.
        if (simplify_nested_radicalsResult) {
            return hook(simplify(p1, $));
        }
    }

    p1 = simplify_rect_to_clock(p1, $);
    // console.lg(`J ${$.toInfixString(p1)}`);

    p1 = simplify_rational_expressions(p1, $);
    // console.lg(`K ${$.toInfixString(p1)}`);

    return hook(p1);
}

/**
 * Simplifying a tensor means that we try to simplify each element separately.
 * @param M 
 * @param $ 
 * @returns 
 */
function simplify_tensor(M: Tensor, $: ExtensionEnv) {

    const simple_M = M.map(
        function (x) {
            return simplify(x, $);
        }
    );

    if ($.isZero(simple_M)) {
        return simple_M;
    }
    else {
        return simple_M;
    }
}

// try rationalizing
function simplify_by_rationalizing(p1: U, $: ExtensionEnv): U {
    // console.lg(`simplify_by_rationalizing`);

    if (!(is_cons(p1) && is_add(p1))) {
        return p1;
    }
    const p2 = rationalize_factoring(p1, $);
    if (count(p2) < count(p1)) {
        p1 = p2;
    }
    return p1;
}

// try condensing
function simplify_by_condensing(p1: U, $: ExtensionEnv): U {
    if (!(is_cons(p1) && is_add(p1))) {
        return p1;
    }
    const p2 = condense(p1, $);
    if (count(p2) <= count(p1)) {
        p1 = p2;
    }
    return p1;
}

// this simplifies forms like (A-B) / (B-A)
function simplify_a_minus_b_divided_by_b_minus_a(p1: U, $: ExtensionEnv): U {
    const p2 = rationalize_factoring($.negate(rationalize_factoring($.negate(rationalize_factoring(p1, $)), $)), $);
    if (count(p2) < count(p1)) {
        p1 = p2;
    }
    return p1;
}

function simplify_by_i_dunno_what(p1: U, $: ExtensionEnv): U {
    // console.lg(`simplify_by_i_dunno_what`);
    const carp1 = car(p1);
    if (carp1.equals(MULTIPLY) || is_inner_or_dot(p1)) {
        // both operands a transpose?

        if (car(car(cdr(p1))).equals(TRANSPOSE) && car(car(cdr(cdr(p1)))).equals(TRANSPOSE)) {
            if (DEBUG) {
                // eslint-disable-next-line no-console
                // console.lg(`maybe collecting a transpose ${p1}`);
            }
            const a = cadr(car(cdr(p1)));
            const b = cadr(car(cdr(cdr(p1))));
            let arg1: U;
            if (carp1.equals(MULTIPLY)) {
                arg1 = $.multiply(a, b);
            }
            else if (is_inner_or_dot(p1)) {
                arg1 = $.inner(b, a);
            }
            else {
                arg1 = stack_pop();
            }

            const p2 = transpose_factoring(arg1, one, two, $);

            if (count(p2) < count(p1)) {
                p1 = p2;
            }
            if (DEBUG) {
                // eslint-disable-next-line no-console
                // console.lg(`collecting a transpose ${p2}`);
            }
        }
    }
    return p1;
}

// try expanding denominators
function simplify_by_expanding_denominators(expr: U, $: ExtensionEnv): U {
    if ($.isZero(expr)) {
        return expr;
    }
    const A = rationalize_factoring(expr, $);
    const B = inverse(A, $);
    const C = rationalize_factoring(B, $);
    const D = inverse(C, $);
    const E = rationalize_factoring(D, $);
    if (count(E) < count(expr)) {
        return E;
    }
    else {
        return expr;
    }
}

// simplifies trig forms

/**
 * Simplifies trigonometric expressions.
 * This function won't go recursive, so it's quite safe to call anytime.
 */
export function simplify_trig(expr: U, $: ExtensionEnv): U {
    // console.lg(`simplify_trig expr=${print_expr(expr, $)}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`simplify_trig expr = ${$.toInfixString(expr)} => ${$.toInfixString(retval)} (${description})`);
        return retval;
    };

    if (!expr.contains(SIN) && !expr.contains(COS)) {
        return hook(expr, "A");
    }

    // TODO: This should be done through the environment, $.
    defs.trigmode = 1;
    const expr1 = $.valueOf(expr);

    defs.trigmode = 2;
    const expr2 = $.valueOf(expr);

    defs.trigmode = 0;

    if (count(expr2) < count(expr1) || nterms(expr2) < nterms(expr1)) {
        if (count(expr2) < count(expr) || nterms(expr2) < nterms(expr)) {
            return hook(expr2, "B");
        }
        else {
            return hook(expr, "C");
        }
    }
    else {
        if (count(expr1) < count(expr) || nterms(expr1) < nterms(expr)) {
            return hook(expr1, "B");
        }
        else {
            return hook(expr, "C");
        }
    }
}

// if it's a sum then try to simplify each term
function simplify_terms(p1: U, $: ExtensionEnv): U {

    if (!(is_cons(p1) && is_add(p1))) {
        return p1;
    }

    let p2 = cdr(p1);
    if (is_cons(p2)) {
        p2 = [...p2].reduce((acc: U, p: U) =>
            simplify_rational_expressions($.add(acc, simplify(p, $)), $), zero);
    }

    if (count(p2) < count(p1)) {
        p1 = p2;
    }
    return p1;
}

function simplify_rational_expressions(p1: U, $: ExtensionEnv): U {

    const denom = denominator(p1, $);
    if (is_plus_or_minus_one(denom, $)) {
        return p1;
    }
    const num = numerator(p1, $);
    if (is_plus_or_minus_one(num, $)) {
        return p1;
    }
    let polyVar: U | undefined;
    if (!(polyVar = areunivarpolysfactoredorexpandedform(num, denom, $))) {
        return p1;
    }

    const theGCD = factor(gcd(num, denom, $), polyVar, $);
    if (is_plus_or_minus_one(theGCD, $)) {
        return p1;
    }

    const factoredNum: U = factor(num, polyVar, $);
    const theGCDInverse: U = inverse(theGCD, $);
    const multipliedNoeExpandNum: U = multiply_noexpand(factoredNum, theGCDInverse, $);
    const simplifiedNum: U = simplify(multipliedNoeExpandNum, $);

    const factoredDenom: U = factor(denom, polyVar, $);
    const multipliedNoeExpandDenom: U = multiply_noexpand(factoredDenom, theGCDInverse, $);
    const simplifiedDenom: U = simplify(multipliedNoeExpandDenom, $);

    const numDividedDenom: U = divide(simplifiedNum, simplifiedDenom, $);

    const p2 = condense(numDividedDenom, $);

    if (count(p2) < count(p1)) {
        return p2;
    }
    else {
        return p1;
    }
}

// things like 6*(cos(2/9*pi)+i*sin(2/9*pi)) = 6*exp(2/9*i*pi)
// where we have sin and cos, those might start to
// look better in clock form i.e.  6*(-1)^(2/9)
function simplify_rect_to_clock(expr: U, $: ExtensionEnv): U {
    const oldExpr = expr;
    // console.lg(`simplify_rect_to_clock ${print_expr(oldExpr, $)}`);
    //breakpoint

    if (!oldExpr.contains(SIN) && !oldExpr.contains(COS)) {
        return oldExpr;
    }

    const newExpr = clockform($.valueOf(oldExpr), $);

    // console.lg(`before simplification clockform: ${oldExpr} after: ${newExpr}`);

    if (count(newExpr) < count(oldExpr)) {
        return newExpr;
    }
    else {
        return oldExpr;
    }
}

function simplify_polarRect(p1: U, $: ExtensionEnv): U {
    const tmp = polarRectAMinusOneBase(p1, $);

    const p2 = $.valueOf(tmp); // put new (hopefully simplified expr) in p2

    if (count(p2) < count(p1)) {
        p1 = p2;
    }
    return p1;
}

function polarRectAMinusOneBase(p1: U, $: ExtensionEnv): U {
    if (is_imu(p1)) {
        return p1;
    }
    if (car(p1).equals(POWER) && is_num_and_eq_minus_one(cadr(p1))) {
        // base we just said is minus 1
        const base = $.negate(one);

        // exponent
        const exponent = polarRectAMinusOneBase(caddr(p1), $);
        // try to simplify it using polar and rect
        return rect(polar($.power(base, exponent), $), $);
    }
    if (is_cons(p1)) {
        const arr = [];
        while (is_cons(p1)) {
            arr.push(polarRectAMinusOneBase(car(p1), $));
            p1 = cdr(p1);
        }

        return makeList(...arr);
    }
    return p1;
}

function nterms(p: U) {
    if (is_cons(p) && is_add(p)) {
        return length_of_cons_otherwise_zero(p) - 1;
    }
    return 1;
}

function simplify_nested_radicals(p1: U, $: ExtensionEnv): [TFLAGS, U] {
    if (defs.recursionLevelNestedRadicalsRemoval > 0) {
        if (DEBUG) {
            // eslint-disable-next-line no-console
            // console.lg('denesting bailing out because of too much recursion');
        }
        return [TFLAG_NONE, p1];
    }

    const [
        simplificationWithoutCondense,
        somethingSimplified,
    ] = take_care_of_nested_radicals(p1, $);

    // in this paragraph we check whether we can collect
    // common factors without complicating the expression
    // in particular we want to avoid
    // collecting radicals like in this case where
    // we collect sqrt(2):
    //   2-2^(1/2) into 2^(1/2)*(-1+2^(1/2))
    // but we do like to collect other non-radicals e.g.
    //   17/2+3/2*5^(1/2) into 1/2*(17+3*5^(1/2))
    // so what we do is we count the powers and we check
    // which version has the least number of them.
    const simplificationWithCondense = noexpand_unary(yycondense, simplificationWithoutCondense, $);

    // console.lg("occurrences of powers in " + simplificationWithoutCondense + " :" + countOccurrencesOfSymbol(POWER,simplificationWithoutCondense))
    // console.lg("occurrences of powers in " + simplificationWithCondense + " :" + countOccurrencesOfSymbol(POWER,simplificationWithCondense))

    p1 =
        countOccurrencesOfSymbol(POWER, simplificationWithoutCondense, $) <
            countOccurrencesOfSymbol(POWER, simplificationWithCondense, $)
            ? simplificationWithoutCondense
            : simplificationWithCondense;

    // we got out result, wrap up
    return [somethingSimplified, p1];
}

function take_care_of_nested_radicals(p1: U, $: ExtensionEnv): [U, TFLAGS] {
    if (defs.recursionLevelNestedRadicalsRemoval > 0) {
        if (DEBUG) {
            // eslint-disable-next-line no-console
            // console.lg('denesting bailing out because of too much recursion');
        }
        return [p1, TFLAG_NONE];
    }

    if (is_cons(p1)) {
        if (is_pow_2_any_any(p1)) {
            return _nestedPowerSymbol(p1, $);
        }
        else {
            return _nestedCons(p1, $);
        }
    }

    return [p1, TFLAG_NONE];
}

function _nestedPowerSymbol(p1: BCons<Sym, U, U>, $: ExtensionEnv): [U, TFLAGS] {
    // console.lg("ok it's a power ")
    const base = p1.lhs;
    const expo = p1.rhs;
    // console.lg("possible double radical base: " + base)
    // console.lg("possible double radical exponent: " + exponent)

    if ((is_num(expo) && expo.isMinusOne()) || !car(base).equals(ADD) || !(is_rat(expo) && expo.isFraction()) || (!equalq(expo, 1, 3) && !equalq(expo, 1, 2))) {
        return [p1, TFLAG_NONE];
    }

    // console.lg("ok there is a radix with a term inside")
    const firstTerm = cadr(base);
    take_care_of_nested_radicals(firstTerm, $);
    const secondTerm = caddr(base);
    take_care_of_nested_radicals(secondTerm, $);

    let numberOfTerms = 0;
    let countingTerms = base;
    while (nil !== cdr(countingTerms)) {
        numberOfTerms++;
        countingTerms = cdr(countingTerms);
    }
    if (numberOfTerms > 2) {
        return [p1, TFLAG_NONE];
    }

    // list here all the factors
    const { commonBases, termsThatAreNotPowers } = _listAll(secondTerm, $);

    if (commonBases.length === 0) {
        return [p1, TFLAG_NONE];
    }

    const A = firstTerm;
    const C = commonBases.reduce($.multiply, one);
    const B = termsThatAreNotPowers.reduce($.multiply, one);

    let temp: U = nil;
    if (equalq(expo, 1, 3)) {
        const checkSize1 = divide($.multiply($.negate(A), C), B, $); // 4th coeff
        const result1 = nativeDouble(evaluate_as_float(real(checkSize1, $), $));
        if (Math.abs(result1) > Math.pow(2, 32)) {
            return [p1, TFLAG_NONE];
        }

        const checkSize2 = $.multiply(three, C); // 3rd coeff
        const result2 = nativeDouble(evaluate_as_float(real(checkSize2, $), $));
        if (Math.abs(result2) > Math.pow(2, 32)) {
            return [p1, TFLAG_NONE];
        }
        const arg1b = $.multiply(checkSize2, SECRETX);

        const checkSize3 = divide($.multiply(create_int(-3), A), B, $); // 2nd coeff
        const result3 = nativeDouble(evaluate_as_float(real(checkSize3, $), $));
        if (Math.abs(result3) > Math.pow(2, 32)) {
            return [p1, TFLAG_NONE];
        }

        const result = add_terms([
            checkSize1,
            arg1b,
            $.multiply(checkSize3, $.power(SECRETX, two)),
            $.multiply(one, $.power(SECRETX, three)),
        ], $);
        temp = result;
    }
    else if (equalq(expo, 1, 2)) {
        const result1 = nativeDouble(evaluate_as_float(real(C, $), $));
        if (Math.abs(result1) > Math.pow(2, 32)) {
            return [p1, TFLAG_NONE];
        }

        const checkSize = divide($.multiply(create_int(-2), A), B, $);
        const result2 = nativeDouble(evaluate_as_float(real(checkSize, $), $));
        if (Math.abs(result2) > Math.pow(2, 32)) {
            return [p1, TFLAG_NONE];
        }
        temp = $.add(
            C,
            $.add(
                $.multiply(checkSize, SECRETX),
                $.multiply(one, $.power(SECRETX, two))
            )
        );
    }

    defs.recursionLevelNestedRadicalsRemoval++;
    const r = roots(temp, SECRETX, $);
    defs.recursionLevelNestedRadicalsRemoval--;
    if (r.ndim === 0) {
        if (DEBUG) {
            // eslint-disable-next-line no-console
            // console.lg('roots bailed out because of too much recursion');
        }
        return [p1, TFLAG_NONE];
    }

    // exclude the solutions with radicals
    const possibleSolutions: U[] = r.filterElements(
        (sol) => !sol.contains(POWER)
    );

    if (possibleSolutions.length === 0) {
        return [p1, TFLAG_NONE];
    }

    const possibleRationalSolutions: U[] = [];
    const realOfpossibleRationalSolutions: number[] = [];
    // console.lg("checking the one with maximum real part ")
    for (const i of Array.from(possibleSolutions)) {
        const result = nativeDouble(evaluate_as_float(real(i, $), $));
        possibleRationalSolutions.push(i);
        realOfpossibleRationalSolutions.push(result);
    }

    const whichRationalSolution = realOfpossibleRationalSolutions.indexOf(
        // eslint-disable-next-line prefer-spread
        Math.max.apply(Math, realOfpossibleRationalSolutions)
    );
    const SOLUTION = possibleRationalSolutions[whichRationalSolution];

    if (!equalq(expo, 1, 3) && !equalq(expo, 1, 2)) {
        return [p1, TFLAG_NONE];
    }

    if (equalq(expo, 1, 3)) {
        const lowercase_b = $.power(
            divide(
                A,
                $.add(
                    $.power(SOLUTION, three),
                    $.multiply($.multiply(three, C), SOLUTION)
                )
                , $),
            third
        );
        const lowercase_a = $.multiply(lowercase_b, SOLUTION);
        const result = simplify(
            $.add($.multiply(lowercase_b, $.power(C, half)), lowercase_a), $
        );
        return [result, TFLAG_DIFF];
    }

    if (equalq(expo, 1, 2)) {
        const lowercase_b = $.power(
            divide(A, $.add($.power(SOLUTION, two), C), $),
            half
        );
        const lowercase_a = $.multiply(lowercase_b, SOLUTION);
        const possibleNewExpression = simplify(
            $.add($.multiply(lowercase_b, $.power(C, half)), lowercase_a), $
        );
        const possibleNewExpressionValue = evaluate_as_float(real(possibleNewExpression, $), $);
        if (!is_negative_number(possibleNewExpressionValue)) {
            return [possibleNewExpression, TFLAG_DIFF];
        }

        const result = simplify(
            $.add(
                $.multiply($.negate(lowercase_b), $.power(C, half)),
                $.negate(lowercase_a)
            ),
            $
        );
        return [result, TFLAG_DIFF];
    }

    return [nil, TFLAG_DIFF]; // Do we need this?
    // return [null, true];
}

function _listAll(secondTerm: U, $: ExtensionEnv): { commonBases: U[]; termsThatAreNotPowers: U[] } {
    let commonInnerExponent = null;
    const commonBases: U[] = [];
    const termsThatAreNotPowers: U[] = [];
    if (is_multiply(secondTerm)) {
        // product of factors
        let secondTermFactor = cdr(secondTerm);
        if (is_cons(secondTermFactor)) {
            while (is_cons(secondTermFactor)) {
                const potentialPower = car(secondTermFactor);
                if (is_power(potentialPower)) {
                    const innerbase = cadr(potentialPower);
                    const innerexponent = caddr(potentialPower);
                    if (equalq(innerexponent, 1, 2)) {
                        if (commonInnerExponent == null) {
                            commonInnerExponent = innerexponent;
                            commonBases.push(innerbase);
                        }
                        else if ($.equals(innerexponent, commonInnerExponent)) {
                            commonBases.push(innerbase);
                        }
                    }
                }
                else {
                    termsThatAreNotPowers.push(potentialPower);
                }
                secondTermFactor = cdr(secondTermFactor);
            }
        }
    }
    else if (is_power(secondTerm)) {
        const innerbase = cadr(secondTerm);
        const innerexponent = caddr(secondTerm);
        if (commonInnerExponent == null && equalq(innerexponent, 1, 2)) {
            commonInnerExponent = innerexponent;
            commonBases.push(innerbase);
        }
    }
    return { commonBases, termsThatAreNotPowers };
}

function _nestedCons(p1: U, $: ExtensionEnv): [U, TFLAGS] {
    let anyRadicalSimplificationWorked = TFLAG_NONE;
    const arr = [];
    if (is_cons(p1)) {
        const items = Array.from(p1).map((p) => {
            if (!anyRadicalSimplificationWorked) {
                let p2: U;
                [p2, anyRadicalSimplificationWorked] = take_care_of_nested_radicals(p, $);
                return p2;
            }
            return p;
        });
        arr.push(...items);
    }
    return [makeList(...arr), anyRadicalSimplificationWorked];
}
