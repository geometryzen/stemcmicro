import { create_int, is_imu, is_num, is_rat, one, Sym, zero } from 'math-expression-atoms';
import { ExprContext } from 'math-expression-context';
import { Native, native_sym } from 'math-expression-native';
import { car, cdr, Cons2, is_atom, is_cons, items_to_cons, nil, U } from 'math-expression-tree';
import { nativeDouble } from '../../bignum';
import { add_terms } from '../../calculators/add/add_terms';
import { condense, yycondense } from '../../condense';
import { complexity } from '../../eigenmath/eigenmath';
import { Directive, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from '../../env/ExtensionEnv';
import { ShareableStack } from '../../env/Stack';
import { add } from '../../helpers/add';
import { clock } from '../../helpers/clock';
import { divide } from '../../helpers/divide';
import { equals } from '../../helpers/equals';
import { inner } from '../../helpers/inner';
import { inverse } from '../../helpers/inverse';
import { iszero } from '../../helpers/iszero';
import { multiply } from '../../helpers/multiply';
import { negate } from '../../helpers/negate';
import { polar } from '../../helpers/polar';
import { power } from '../../helpers/power';
import { rect } from '../../helpers/rect';
import { is_num_and_equalq, is_num_and_eq_minus_one, is_plus_or_minus_one } from '../../is';
import { length_of_cons_otherwise_zero } from '../../length_of_cons_or_zero';
import { multiply_noexpand } from '../../multiply';
import { is_num_and_negative } from '../../predicates/is_negative_number';
import { roots } from '../../roots';
import { ADD, COS, do_simplify_nested_radicals, FACTORIAL, MULTIPLY, POWER, SECRETX, SIN, TRANSPOSE } from '../../runtime/constants';
import { count, countOccurrencesOfSymbol } from '../../runtime/count';
import { defs, noexpand_unary } from '../../runtime/defs';
import { is_add, is_inner_or_dot, is_multiply, is_power } from '../../runtime/helpers';
import { stack_pop } from '../../runtime/stack';
import { simfac } from '../../simfac';
import { caddr, cadr } from '../../tree/helpers';
import { half, third, three, two } from '../../tree/rat/Rat';
import { denominator } from "../denominator/denominator";
import { factor } from "../factor/factor";
import { evaluate_as_float } from '../float/float';
import { areunivarpolysfactoredorexpandedform, gcd } from "../gcd/gcd";
import { numerator } from "../numerator/numerator";
import { is_pow_2_any_any } from '../pow/is_pow_2_any_any';
import { rationalize_factoring } from '../rationalize/rationalize';
import { re } from '../real/real';
import { transpose_factoring } from '../transpose/transpose';
import { wrap_as_transform } from '../wrap_as_transform';

function simplify_if_contains_factorial(expr: U, $: ExprContext): U {
    if (expr.contains(FACTORIAL)) {
        const p2 = simfac(expr, $);
        const p3 = simfac(rationalize_factoring(expr, $), $);
        return count(p2) < count(p3) ? p2 : p3;
    }
    else {
        return expr;
    }
}

function ensure_simplify_state(env: ExprContext): ShareableStack<U> {
    if (env.hasState('simplify')) {
        return env.getState('simplify') as ShareableStack<U>;
    }
    else {
        // This makes it clear that we want the entries in the state to extend a Shareable interface
        // so that we can clean them up.
        const stack = new ShareableStack<U>();
        env.setState('simplify', stack);
        return stack;
    }
}

export function simplify(x: U, env: ExprContext): U {
    // console.lg("simplify", `${x}`);
    const stack = ensure_simplify_state(env);
    try {
        const hook = function (retval: U): U {
            return retval;
        };

        // Bail if it would cause an infinite loop.
        if (stack.some(value => value.equals(x))) {
            // console.lg("bailing", `${x}`);
            return hook(x);
        }

        stack.push(x);
        try {

            // The following illustrates how we should be handling all atoms.
            // Of course, the extension should be looked up from the context.
            if (is_atom(x)) {
                const handler = env.handlerFor(x);
                return hook(handler.dispatch(x, native_sym(Native.simplify), nil, env));
            }

            const A = simplify_if_contains_factorial(x, env);
            // console.lg("A => ", `${A}`);

            const B = simplify_by_i_dunno_what(A, env);
            // console.lg("B => ", `${B}`);

            const C = simplify_by_rationalizing(B, env);
            // console.lg("C => ", `${C}`);

            const D = simplify_by_condensing(C, env);
            // console.lg("D => ", `${D}`);

            const E = simplify_a_minus_b_divided_by_b_minus_a(D, env);
            // console.lg("E => ", `${E}`);

            const F = simplify_by_expanding_denominators(E, env);
            // console.lg("F => ", `${F}`);

            const G = simplify_trig(F, env);
            // console.lg("G => ", `${G}`);

            const H = simplify_terms(G, env);
            // console.lg("H => ", `${H}`);

            const I = simplify_polarRect(H, env);
            // console.lg("I => ", `${I}`);

            if (do_simplify_nested_radicals) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [flags, R] = simplify_nested_radicals(I, env);
                // console.lg(`I ${$.toInfixString(p1)}`);
                // if there is some de-nesting then
                // re-run a simplification because
                // the shape of the expression might
                // have changed significantly.
                // e.g. simplify(14^(1/2) - (16 - 4*7^(1/2))^(1/2))
                // needs some more simplification after the de-nesting.
                if (R.equals(I)) {
                    // No progress was made, so we fall through.
                    // console.lg("R => ", $.toInfixString(R));
                }
                else {
                    // Progress was made so we try to simplify again.
                    return hook(simplify(R, env));
                }
            }

            const J = simplify_rect_to_clock(I, env);
            // console.lg("J => ", `${J}`);

            const K = simplify_rational_expressions(J, env);
            // console.lg("K => ", `${K}`);

            return hook(K);
        }
        finally {
            stack.pop().release();
        }
    }
    finally {
        // This will beak things unless it is clear that state is shareable.
        // stack.release();
    }
}

// try rationalizing
function simplify_by_rationalizing(p1: U, $: ExprContext): U {
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
function simplify_by_condensing(p1: U, $: ExprContext): U {
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
function simplify_a_minus_b_divided_by_b_minus_a(x: U, $: ExprContext): U {
    // console.lg("simplify_a_minus_b_divided_by_b_minus_a", `${x}`);
    const candidate = rationalize_factoring(negate($, rationalize_factoring(negate($, rationalize_factoring(x, $)), $)), $);
    if (count(candidate) < count(x)) {
        return candidate;
    }
    else {
        x.addRef();
        candidate.release();
        return x;
    }
}

function simplify_by_i_dunno_what(p1: U, $: ExprContext): U {
    // console.lg(`simplify_by_i_dunno_what`);
    const carp1 = car(p1);
    if (carp1.equals(MULTIPLY) || is_inner_or_dot(p1)) {
        // both operands a transpose?

        if (car(car(cdr(p1))).equals(TRANSPOSE) && car(car(cdr(cdr(p1)))).equals(TRANSPOSE)) {
            const a = cadr(car(cdr(p1)));
            const b = cadr(car(cdr(cdr(p1))));
            let arg1: U;
            if (carp1.equals(MULTIPLY)) {
                arg1 = multiply($, a, b);
            }
            else if (is_inner_or_dot(p1)) {
                arg1 = inner(b, a, $);
            }
            else {
                arg1 = stack_pop();
            }

            const p2 = transpose_factoring(arg1, one, two, $);

            if (count(p2) < count(p1)) {
                p1 = p2;
            }
        }
    }
    return p1;
}

// try expanding denominators
function simplify_by_expanding_denominators(x: U, $: ExprContext): U {
    // console.lg("simplify_by_expanding_denominators", `${x}`);
    if (iszero(x, $)) {
        return x;
    }
    const A = rationalize_factoring(x, $);      //  A = x
    const B = inverse(A, $);                    //  B = 1/x
    const C = rationalize_factoring(B, $);      //  C = 1/x
    const D = inverse(C, $);                    //  D = x
    const E = rationalize_factoring(D, $);      //  E = x
    if (count(E) < count(x)) {
        return E;
    }
    else {
        return x;
    }
}

// simplifies trig forms

/**
 * Simplifies trigonometric expressions.
 * This function won't go recursive, so it's quite safe to call anytime.
 */
export function simplify_trig(expr: U, $: ExprContext): U {
    // console.lg(`simplify_trig expr=${print_expr(expr, $)}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`simplify_trig expr = ${$.toInfixString(expr)} => ${$.toInfixString(retval)} (${description})`);
        return retval;
    };

    if (!expr.contains(SIN) && !expr.contains(COS)) {
        return hook(expr, "A");
    }

    const expr1 = convert_sin_to_cos(expr, $);
    // console.lg("expr1", $.toInfixString(expr1));

    const expr2 = convert_cos_to_sin(expr, $);
    // console.lg("expr2", $.toInfixString(expr2));

    const c0 = count(expr);
    const c1 = count(expr1);
    const c2 = count(expr2);
    const n0 = nterms(expr);
    const n1 = nterms(expr1);
    const n2 = nterms(expr2);

    if (c2 < c1 || n2 < n1) {
        if (c2 < c0 || n2 < n0) {
            return hook(expr2, "B");
        }
        else {
            return hook(expr, "C");
        }
    }
    else {
        if (c1 < c0 || n1 < n0) {
            return hook(expr1, "B");
        }
        else {
            return hook(expr, "C");
        }
    }
}

function convert_sin_to_cos(expr: U, $: ExprContext): U {
    $.pushDirective(Directive.convertSinToCos, 1);
    try {
        return $.valueOf(expr);
    }
    finally {
        $.popDirective();
    }
}

function convert_cos_to_sin(expr: U, $: ExprContext): U {
    $.pushDirective(Directive.convertCosToSin, 1);
    try {
        return $.valueOf(expr);
    }
    finally {
        $.popDirective();
    }
}

// if it's a sum then try to simplify each term
function simplify_terms(p1: U, $: ExprContext): U {

    if (!(is_cons(p1) && is_add(p1))) {
        return p1;
    }

    let p2: U = cdr(p1);
    if (is_cons(p2)) {
        p2 = [...p2].reduce((acc: U, p: U) =>
            simplify_rational_expressions(add($, acc, simplify(p, $)), $), zero);
    }

    if (count(p2) < count(p1)) {
        p1 = p2;
    }
    return p1;
}

function simplify_rational_expressions(p1: U, $: ExprContext): U {

    const denom = denominator(p1, $);
    if (is_plus_or_minus_one(denom, $)) {
        return p1;
    }
    const num = numerator(p1, $);
    if (is_plus_or_minus_one(num, $)) {
        return p1;
    }
    let polyVar: U | undefined;
    if (!(polyVar = areunivarpolysfactoredorexpandedform(num, denom))) {
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
function simplify_rect_to_clock(x: U, $: ExprContext): U {
    // console.lg("simplify_rect_to_clock", `${x}`);

    if (!x.contains(SIN) && !x.contains(COS)) {
        return x;
    }

    const arg = $.valueOf(x);
    // console.lg("simplify_rect_to_clock", "arg", `${arg}`);
    try {
        const candidate = clock(arg, $);

        // console.lg("simplify_rect_to_clock", "candidate", `${candidate}`);

        if (count(candidate) < count(x)) {
            return candidate;
        }
        else {
            x.addRef();
            candidate.release();
            return x;
        }
    }
    finally {
        arg.release();
    }
}

function simplify_polarRect(p1: U, $: ExprContext): U {
    const tmp = polarRectAMinusOneBase(p1, $);

    const p2 = $.valueOf(tmp); // put new (hopefully simplified expr) in p2

    if (count(p2) < count(p1)) {
        p1 = p2;
    }
    return p1;
}

function polarRectAMinusOneBase(p1: U, $: ExprContext): U {
    if (is_imu(p1)) {
        return p1;
    }
    if (car(p1).equals(POWER) && is_num_and_eq_minus_one(cadr(p1))) {
        // base we just said is minus 1
        const base = negate($, one);

        // exponent
        const exponent = polarRectAMinusOneBase(caddr(p1), $);
        // try to simplify it using polar and rect
        return rect(polar(power($, base, exponent), $), $);
    }
    if (is_cons(p1)) {
        const arr = [];
        while (is_cons(p1)) {
            arr.push(polarRectAMinusOneBase(car(p1), $));
            p1 = cdr(p1);
        }

        return items_to_cons(...arr);
    }
    return p1;
}

function nterms(p: U) {
    if (is_cons(p) && is_add(p)) {
        return length_of_cons_otherwise_zero(p) - 1;
    }
    return 1;
}

function simplify_nested_radicals(x: U, $: ExprContext): [TFLAGS, U] {

    // console.lg("simplify_nested_radicals", `${$.toInfixString(x)}`);

    if (defs.recursionLevelNestedRadicalsRemoval > 0) {
        return [TFLAG_NONE, x];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [red, red_flags] = take_care_of_nested_radicals(x, $);

    // console.lg("red", `${$.toInfixString(red)}`);

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

    // We have a problem here, probably cause by the noexpand.
    const green = noexpand_unary(yycondense, red, $);
    // console.lg("red", `${$.toInfixString(red)}`);
    // console.lg("green", `${$.toInfixString(green)}`);

    // This code traps the case where green is actually more complex than red.
    // However, it would seem to cover up a problem in the computation of green.
    const blue = complexity(red) < complexity(green) ? red : green;

    // console.lg("blue", `${$.toInfixString(blue)}`);
    // console.lg("complexity(red)  ", complexity(red));
    // console.lg("complexity(green)", complexity(green));

    const best = countOccurrencesOfSymbol(POWER, red, $) < countOccurrencesOfSymbol(POWER, blue, $) ? red : blue;

    // console.lg("best", `${$.toInfixString(best)}`);

    // we got out result, wrap up
    return wrap_as_transform(best, x);
}

function take_care_of_nested_radicals(x: U, $: ExprContext): [U, TFLAGS] {
    if (defs.recursionLevelNestedRadicalsRemoval > 0) {
        return [x, TFLAG_NONE];
    }

    if (is_cons(x)) {
        if (is_pow_2_any_any(x)) {
            return _nestedPowerSymbol(x, $);
        }
        else {
            return _nestedCons(x, $);
        }
    }

    return [x, TFLAG_NONE];
}

function _nestedPowerSymbol(p1: Cons2<Sym, U, U>, $: ExprContext): [U, TFLAGS] {
    // console.lg("ok it's a power ")
    const base = p1.lhs;
    const expo = p1.rhs;
    // console.lg("possible double radical base: " + base)
    // console.lg("possible double radical exponent: " + exponent)

    if ((is_num(expo) && expo.isMinusOne()) || !car(base).equals(ADD) || !(is_rat(expo) && expo.isFraction()) || (!is_num_and_equalq(expo, 1, 3) && !is_num_and_equalq(expo, 1, 2))) {
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

    const binary_multiply = (lhs: U, rhs: U) => multiply($, lhs, rhs);
    const A = firstTerm;
    const C = commonBases.reduce(binary_multiply, one);
    const B = termsThatAreNotPowers.reduce(binary_multiply, one);

    let temp: U = nil;
    if (is_num_and_equalq(expo, 1, 3)) {
        const checkSize1 = divide(multiply($, negate($, A), C), B, $); // 4th coeff
        const result1 = nativeDouble(evaluate_as_float(re(checkSize1, $), $));
        if (Math.abs(result1) > Math.pow(2, 32)) {
            return [p1, TFLAG_NONE];
        }

        const checkSize2 = multiply($, three, C); // 3rd coeff
        const result2 = nativeDouble(evaluate_as_float(re(checkSize2, $), $));
        if (Math.abs(result2) > Math.pow(2, 32)) {
            return [p1, TFLAG_NONE];
        }
        const arg1b = multiply($, checkSize2, SECRETX);

        const checkSize3 = divide(multiply($, create_int(-3), A), B, $); // 2nd coeff
        const result3 = nativeDouble(evaluate_as_float(re(checkSize3, $), $));
        if (Math.abs(result3) > Math.pow(2, 32)) {
            return [p1, TFLAG_NONE];
        }

        const result = add_terms([
            checkSize1,
            arg1b,
            multiply($, checkSize3, power($, SECRETX, two)),
            multiply($, one, power($, SECRETX, three)),
        ], $);
        temp = result;
    }
    else if (is_num_and_equalq(expo, 1, 2)) {
        const result1 = nativeDouble(evaluate_as_float(re(C, $), $));
        if (Math.abs(result1) > Math.pow(2, 32)) {
            return [p1, TFLAG_NONE];
        }

        const checkSize = divide(multiply($, create_int(-2), A), B, $);
        const result2 = nativeDouble(evaluate_as_float(re(checkSize, $), $));
        if (Math.abs(result2) > Math.pow(2, 32)) {
            return [p1, TFLAG_NONE];
        }
        temp = add($,
            C,
            add($,
                multiply($, checkSize, SECRETX),
                multiply($, one, power($, SECRETX, two))
            )
        );
    }

    defs.recursionLevelNestedRadicalsRemoval++;
    const r = roots(temp, SECRETX, $);
    defs.recursionLevelNestedRadicalsRemoval--;
    if (r.ndim === 0) {
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
        const result = nativeDouble(evaluate_as_float(re(i, $), $));
        possibleRationalSolutions.push(i);
        realOfpossibleRationalSolutions.push(result);
    }

    const whichRationalSolution = realOfpossibleRationalSolutions.indexOf(
        // eslint-disable-next-line prefer-spread
        Math.max.apply(Math, realOfpossibleRationalSolutions)
    );
    const SOLUTION = possibleRationalSolutions[whichRationalSolution];

    if (!is_num_and_equalq(expo, 1, 3) && !is_num_and_equalq(expo, 1, 2)) {
        return [p1, TFLAG_NONE];
    }

    if (is_num_and_equalq(expo, 1, 3)) {
        const lowercase_b = power($,
            divide(
                A,
                add($,
                    power($, SOLUTION, three),
                    multiply($, multiply($, three, C), SOLUTION)
                )
                , $),
            third
        );
        const lowercase_a = multiply($, lowercase_b, SOLUTION);
        const result = simplify(
            add($, multiply($, lowercase_b, power($, C, half)), lowercase_a), $
        );
        return [result, TFLAG_DIFF];
    }

    if (is_num_and_equalq(expo, 1, 2)) {
        const lowercase_b = power($,
            divide(A, add($, power($, SOLUTION, two), C), $),
            half
        );
        const lowercase_a = multiply($, lowercase_b, SOLUTION);
        const possibleNewExpression = simplify(
            add($, multiply($, lowercase_b, power($, C, half)), lowercase_a), $
        );
        const possibleNewExpressionValue = evaluate_as_float(re(possibleNewExpression, $), $);
        if (!is_num_and_negative(possibleNewExpressionValue)) {
            return [possibleNewExpression, TFLAG_DIFF];
        }

        const result = simplify(
            add($,
                multiply($, negate($, lowercase_b), power($, C, half)),
                negate($, lowercase_a)
            ),
            $
        );
        return [result, TFLAG_DIFF];
    }

    return [nil, TFLAG_DIFF]; // Do we need this?
    // return [null, true];
}

function _listAll(secondTerm: U, $: ExprContext): { commonBases: U[]; termsThatAreNotPowers: U[] } {
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
                    if (is_num_and_equalq(innerexponent, 1, 2)) {
                        if (commonInnerExponent == null) {
                            commonInnerExponent = innerexponent;
                            commonBases.push(innerbase);
                        }
                        else if (equals(innerexponent, commonInnerExponent, $)) {
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
        if (commonInnerExponent == null && is_num_and_equalq(innerexponent, 1, 2)) {
            commonInnerExponent = innerexponent;
            commonBases.push(innerbase);
        }
    }
    return { commonBases, termsThatAreNotPowers };
}

function _nestedCons(p1: U, $: ExprContext): [U, TFLAGS] {
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
    return [items_to_cons(...arr), anyRadicalSimplificationWorked];
}
