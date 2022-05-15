import { ExtensionEnv } from './env/ExtensionEnv';
import { imu } from './env/imu';
import { guess } from './guess';
import { is_rat_integer } from './is_rat_integer';
import { length_of_cons_otherwise_zero } from './length_of_cons_or_zero';
import { is_sym } from './operators/sym/is_sym';
import { is_num } from './predicates/is_num';
import { FLOAT, MEQUAL, MSIGN, SYMBOL_X, SYMBOL_Y, SYMBOL_Z } from './runtime/constants';
import { is_add, is_multiply, is_power } from './runtime/helpers';
import { is_flt } from './tree/flt/is_flt';
import { caddr, cadr } from './tree/helpers';
import { Num } from './tree/num/Num';
import { is_rat } from './tree/rat/is_rat';
import { Rat } from './tree/rat/Rat';
import { car, cdr, is_cons, NIL, U } from './tree/tree';

//
// TODO: In order not to torture our future selves, these should be documented and have coverage unit testing.
// Maybe document the matching patterns?
// Using block comments makes it possible to compose these with logical operators.
//

/**
 * The expression must be a Rat or Flt, otherwise the return value is false.
 * Returns true if expr < 0.
 * @param expr The expression being tested.
 */
export function is_negative_number(expr: U): expr is Num & { __ts_sign: -1 } {
    if (is_rat(expr)) {
        return expr.isNegative();
    }
    else if (is_flt(expr)) {
        return expr.isNegative();
    }
    else {
        return false;
    }
}

/**
 * The expression must be a Rat or Flt, otherwise the return value is false.
 * TODO: Interesting that this required expr > 0, when positive usually includes zero.
 * @param expr The expression being tested.
 */
export function is_num_and_gt_zero(expr: U): expr is Num & { __ts_sign: 1 } {
    if (is_rat(expr)) {
        return MSIGN(expr.a) === 1;
    }
    else if (is_flt(expr)) {
        return expr.d > 0.0;
    }
    else {
        return false;
    }
}

export function is_num_and_eq_two(p: U): p is Num & { __ts_sign: 1; __ts_integer: true; __ts_special: 2 } {
    if (is_rat(p)) {
        return MEQUAL(p.a, 2) && MEQUAL(p.b, 1);
    }
    else if (is_flt(p)) {
        return p.d === 2.0;
    }
    else {
        return false;
    }
}


/**
 * @deprecated Use is_num(expr) && expr.isMinusOne
 * @param p 
 * @returns 
 */
export function is_num_and_eq_minus_one(p: U): p is Num & { __ts_sign: -1; __ts_integer: true; __ts_special: -1; } {
    if (is_num(p)) {
        return p.isMinusOne();
    }
    if (is_rat(p)) {
        return MEQUAL(p.a, -1) && MEQUAL(p.b, 1);
    }
    else if (is_flt(p)) {
        return p.d === -1.0;
    }
    else {
        return false;
    }
}

/**
 *
 */
export function is_plus_or_minus_one(x: U, $: ExtensionEnv): boolean {
    return $.isOne(x) || is_num_and_eq_minus_one(x);
}

export function is_integer_or_integer_float(p: U): p is Num & { __ts_integer: true } {
    if (is_flt(p)) {
        if (p.d === Math.round(p.d)) {
            return true;
        }
        return false;
    }
    return is_rat_integer(p);
}

export function isnonnegativeinteger(p: U): p is Rat & { __ts_integer: true; __ts_sign: 1 } {
    return is_rat(p) && MEQUAL(p.b, 1) && MSIGN(p.a) === 1;
}

export function is_positive_integer(p: U): p is Rat & { __ts_integer: true; __ts_sign: 1 } {
    return is_rat(p) && p.isPositiveInteger();
}

// --------------------------------------

export function isunivarpolyfactoredorexpandedform(p: U, x?: U): U {
    if (x == null) {
        x = guess(p);
    }

    if (
        ispolyfactoredorexpandedform(p, x) &&
        countTrue(p.contains(SYMBOL_X), p.contains(SYMBOL_Y), p.contains(SYMBOL_Z)) === 1
    ) {
        return x;
    }
    else {
        return NIL;
    }
}

function countTrue(...a: boolean[]): number {
    // Number(true) = 1
    return a.reduce((count, x) => count + Number(x), 0);
}

// --------------------------------------
// sometimes we want to check if we have a poly in our
// hands, however it's in factored form and we don't
// want to expand it.

function ispolyfactoredorexpandedform(p: U, x: U): boolean {
    return ispolyfactoredorexpandedform_factor(p, x);
}

function ispolyfactoredorexpandedform_factor(p: U, x: U): boolean {
    if (is_multiply(p)) {
        return p.tail().every((el) => {
            const bool = ispolyfactoredorexpandedform_power(el, x);
            return bool;
        });
    }
    else {
        return ispolyfactoredorexpandedform_power(p, x);
    }
}

function ispolyfactoredorexpandedform_power(p: U, x: U): boolean {
    if (is_power(p)) {
        return is_positive_integer(caddr(p)) && ispolyexpandedform_expr(cadr(p), x);
    }
    else {
        return ispolyexpandedform_expr(p, x);
    }
}

// --------------------------------------

export function is_poly_expanded_form(p: U, x: U): boolean {
    if (p.contains(x)) {
        return ispolyexpandedform_expr(p, x);
    }
    return false;
}

function ispolyexpandedform_expr(p: U, x: U): boolean {
    if (is_add(p)) {
        return p.tail().every((term) => ispolyexpandedform_term(term, x));
    }
    else {
        return ispolyexpandedform_term(p, x);
    }
}

function ispolyexpandedform_term(p: U, x: U): boolean {
    if (is_multiply(p)) {
        return p.tail().every((factor) => ispolyexpandedform_factor(factor, x));
    }
    else {
        return ispolyexpandedform_factor(p, x);
    }
}

function ispolyexpandedform_factor(p: U, x: U): boolean {
    if (p.equals(x)) {
        return true;
    }
    if (is_power(p) && cadr(p).equals(x)) {
        return is_positive_integer(caddr(p));
    }
    return !p.contains(x);
}

// --------------------------------------

export function is_negative_term(p: U) {
    return is_negative_number(p) || (is_cons(p) && is_multiply(p) && is_negative_number(car(p.cdr)));
}

function has_negative_rational_exponent(expr: U): boolean {
    if (is_power(expr)) {
        if (is_rat(car(cdr(cdr(expr))))) {
            if (is_negative_number(car(cdr(expr)))) {
                // (power )
                return true;
            }
        }
    }
    return false;
}

function isimaginarynumberdouble(p: U, $: ExtensionEnv): boolean {
    return (
        (is_multiply(p) &&
            length_of_cons_otherwise_zero(p) === 3 &&
            is_flt(cadr(p)) &&
            has_negative_rational_exponent(caddr(p))) ||
        $.equals(p, imu)
    );
}

/**
 * (multiply Num i)
 */
export function is_imaginary_number(expr: U): boolean {
    if (is_multiply(expr)) {
        // (multiply a1 a2 a3 ...)
        if (length_of_cons_otherwise_zero(expr) === 3) {
            // (multiply x y)
            if ((is_num(cadr(expr)) && caddr(expr).equals(imu))) {
                // (multiply Num i)
                return true;
            }
            if (expr.equals(imu)) {
                // Probbaly dead code because i => (power -1 1/2), which isn't a (multiply )
                return true;
            }
            if (has_negative_rational_exponent(caddr(expr))) {
                return true;
            }
        }
    }
    return false;
}

export function iscomplexnumberdouble(p: U, $: ExtensionEnv): boolean {
    return (
        (is_add(p) &&
            length_of_cons_otherwise_zero(p) === 3 &&
            is_flt(cadr(p)) &&
            isimaginarynumberdouble(caddr(p), $)) ||
        isimaginarynumberdouble(p, $)
    );
}

/**
 * Determines whether expr is of the form (+ Num (something times i))
 * For this to work it is crucial that the complex number terms be arranged with
 * the real part on the left hand side. e.g. 1.0 + 2.0*i.
 * @param expr 
 * @param $ 
 * @returns 
 */
export function is_complex_number(expr: U): boolean {
    // console.lg(`is_complex_number ${$.toListString(expr)}`);
    if (is_add(expr)) {
        // console.lg(`${$.toInfixString(expr)} is an add expression`);
        const n = length_of_cons_otherwise_zero(expr);
        // console.lg(`${$.toInfixString(expr)} n = ${n}`);
        if (n === 3) {
            const x = cadr(expr);
            // console.lg(`${$.toInfixString(expr)} X = ${$.toInfixString(X)}`);
            if (is_num(x)) {
                if ((is_imaginary_number(caddr(expr))) || is_imaginary_number(expr)) {
                    return true;
                }
            }
            else {
                // console.lg(`${$.toInfixString(expr)} X = ${$.toInfixString(X)} is not complex because X is not a num.`);
            }
        }
    }
    return false;
}

export function iseveninteger(p: U): boolean {
    return is_rat_integer(p) && p.a.isEven();
}

/**
 * It's a bit strange to ask a symbolic expression if it is negative.
 * The meaning is whether the expression, assumed to be written with canonical ordering,
 * has a certain structure w.r.t. minus signs. If the expression is deemed to be negative
 * then in the case of even functions we negate it to get a canonical ordering.
 * @param p 
 * @returns 
 */
export function is_negative(p: U): boolean {
    return (is_add(p) && is_negative_term(cadr(p))) || is_negative_term(p);
}

// returns 1 if there's a symbol somewhere.
// not used anywhere. Note that PI and POWER are symbols,
// so for example 2^3 would be symbolic
// while -1^(1/2) i.e. 'i' is not, so this can
// be tricky to use.
export function issymbolic(p: U): boolean {
    if (is_sym(p)) {
        return true;
    }
    if (is_cons(p)) {
        return [...p].some(issymbolic);
    }
    return false;
}

// i.e. 2, 2^3, etc.
export function isintegerfactor(p: U): boolean {
    return (
        is_rat_integer(p) || (is_power(p) && is_rat_integer(cadr(p)) && is_rat_integer(caddr(p)))
    );
}

export function isNumberOneOverSomething(p: U): boolean {
    return is_rat(p) && p.isFraction() && MEQUAL(p.a.abs(), 1);
}

export function isoneover(p: U): boolean {
    return is_power(p) && is_num_and_eq_minus_one(caddr(p));
}

/**
 * @deprecated Use is_rat(expr) && expr.isFraction()
 */
export function isfraction(p: U): p is Rat {
    return is_rat(p) && p.isFraction();
}

// n an int
/**
 * Returns true if the expr is the specified number.
 * TODO: This only handles Rat and Flt. Everything else returns false.
 * @param expr The expresson being tested.
 * @param n The value that the expression must match.
 */
export function equaln(expr: U | null | undefined, n: number): boolean {
    if (expr !== null) {
        if (is_rat(expr)) {
            return MEQUAL(expr.a, n) && MEQUAL(expr.b, 1);
        }
        else if (is_flt(expr)) {
            return expr.d === n;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

// a and b ints
export function equalq(p: U, a: number, b: number): boolean {
    if (is_rat(p)) {
        return MEQUAL(p.a, a) && MEQUAL(p.b, b);
    }
    else if (is_flt(p)) {
        return p.d === a / b;
    }
    else {
        return false;
    }
}

// p == 1/2 ?
export function is_one_over_two(p: U): boolean {
    return equalq(p, 1, 2);
}

// p == -1/2 ?
export function isminusoneovertwo(p: U): boolean {
    return equalq(p, -1, 2);
}

// p == 1/sqrt(2) ?
export function isoneoversqrttwo(p: U): boolean {
    return is_power(p) && equaln(cadr(p), 2) && equalq(caddr(p), -1, 2);
}

// p == -1/sqrt(2) ?
export function isminusoneoversqrttwo(p: U): boolean {
    return (
        is_multiply(p) &&
        equaln(cadr(p), -1) &&
        isoneoversqrttwo(caddr(p)) &&
        length_of_cons_otherwise_zero(p) === 3
    );
}

// Check if the value is sqrt(3)/2
export function isSqrtThreeOverTwo(p: U): boolean {
    return (
        is_multiply(p) &&
        is_one_over_two(cadr(p)) &&
        isSqrtThree(caddr(p)) &&
        length_of_cons_otherwise_zero(p) === 3
    );
}

// Check if the value is -sqrt(3)/2
export function isMinusSqrtThreeOverTwo(p: U): boolean {
    return (
        is_multiply(p) &&
        isminusoneovertwo(cadr(p)) &&
        isSqrtThree(caddr(p)) &&
        length_of_cons_otherwise_zero(p) === 3
    );
}

// Check if value is sqrt(3)
function isSqrtThree(p: U): boolean {
    return is_power(p) && equaln(cadr(p), 3) && is_one_over_two(caddr(p));
}

export function contains_floating_values_or_floatf(expr: U): boolean {
    // TODO: This probably needs to go into extension types as well. 
    if (is_flt(expr) || FLOAT.equals(expr)) {
        return true;
    }
    if (is_cons(expr)) {
        return [...expr].some(contains_floating_values_or_floatf);
    }

    return false;
}
