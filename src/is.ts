import { ExtensionEnv } from './env/ExtensionEnv';
import { imu } from './env/imu';
import { guess } from './guess';
import { is_rat_and_integer } from './is_rat_and_integer';
import { length_of_cons_otherwise_zero } from './length_of_cons_or_zero';
import { is_flt } from './operators/flt/is_flt';
import { is_num } from './operators/num/is_num';
import { is_rat } from './operators/rat/is_rat';
import { is_sym } from './operators/sym/is_sym';
import { is_num_and_negative } from './predicates/is_negative_number';
import { FLOAT, MEQUAL, MSIGN, SYMBOL_X, SYMBOL_Y, SYMBOL_Z } from './runtime/constants';
import { is_add, is_multiply, is_power } from './runtime/helpers';
import { caddr, cadr } from './tree/helpers';
import { Num } from './tree/num/Num';
import { Rat } from './tree/rat/Rat';
import { is_cons, nil, U } from './tree/tree';

//
// TODO: In order not to torture our future selves, these should be documented and have coverage unit testing.
// Maybe document the matching patterns?
// Using block comments makes it possible to compose these with logical operators.
//

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
 *
 */
export function is_num_and_eq_minus_one(p: U): p is Num & { __ts_sign: -1; __ts_integer: true; __ts_special: -1; } {
    if (is_num(p)) {
        return p.isMinusOne();
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

export function is_num_and_integer(p: U): p is Num & { __ts_integer: true } {
    if (is_flt(p)) {
        return p.isInteger();
    }
    if (is_rat(p)) {
        return p.isInteger();
    }
    return false;
}

// --------------------------------------

export function isunivarpolyfactoredorexpandedform(p: U, x: U | null, $: ExtensionEnv): U {
    if (x == null) {
        x = guess(p);
    }

    if (ispolyfactoredorexpandedform(p, x, $) && countTrue(p.contains(SYMBOL_X), p.contains(SYMBOL_Y), p.contains(SYMBOL_Z)) === 1) {
        return x;
    }
    else {
        return nil;
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

function ispolyfactoredorexpandedform(p: U, x: U, $: ExtensionEnv): boolean {
    return ispolyfactoredorexpandedform_factor(p, x, $);
}

function ispolyfactoredorexpandedform_factor(p: U, x: U, $: ExtensionEnv): boolean {
    if (is_multiply(p)) {
        return p.tail().every((el) => {
            const bool = ispolyfactoredorexpandedform_power(el, x, $);
            return bool;
        });
    }
    else {
        return ispolyfactoredorexpandedform_power(p, x, $);
    }
}

function ispolyfactoredorexpandedform_power(p: U, x: U, $: ExtensionEnv): boolean {
    if (is_power(p)) {
        const base = p.base;
        const expo = p.expo;
        return is_rat(expo) && expo.isPositiveInteger() && is_poly_expanded_form_expr(base, x, $);
    }
    else {
        return is_poly_expanded_form_expr(p, x, $);
    }
}

// --------------------------------------

/**
 * Determines whether the expression, p, is a polynomial in the variable, x.
 * 
 * @param p 
 * @param x 
 * @returns 
 */
export function is_poly_expanded_form(p: U, x: U, $: ExtensionEnv): boolean {
    // console.lg(`is_poly_expanded_form ${print_expr(p, $)} ${x}`);
    if (p.contains(x)) {
        return is_poly_expanded_form_expr(p, x, $);
    }
    else {
        // If the expression does not contain the variable then it's a non-starter.
        return false;
    }
}

function is_poly_expanded_form_expr(p: U, x: U, $: ExtensionEnv): boolean {
    // console.lg(`is_poly_expanded_form_expr ${print_expr(p, $)} ${x}`);
    if (is_add(p)) {
        return p.tail().every((term) => is_poly_expanded_form_term(term, x, $));
    }
    else {
        return is_poly_expanded_form_term(p, x, $);
    }
}

function is_poly_expanded_form_term(p: U, x: U, $: ExtensionEnv): boolean {
    // console.lg(`is_poly_expanded_form_term ${print_expr(p, $)} ${x}`);
    if (is_multiply(p)) {
        return p.tail().every((factor) => is_poly_expanded_form_factor(factor, x, $));
    }
    else {
        return is_poly_expanded_form_factor(p, x, $);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function is_poly_expanded_form_factor(p: U, x: U, $: ExtensionEnv): boolean {
    // console.lg(`is_poly_expanded_form_factor ${print_expr(p, $)} ${x}`);
    if (p.equals(x)) {
        return true;
    }
    if (is_power(p) && p.base.equals(x)) {
        const expo = p.expo;
        return is_rat(expo) && expo.isPositiveInteger();
    }
    if (p.contains(x)) {
        return false;
    }
    else {
        return true;
    }
}

function is_power_and_has_rational_exponent_and_negative_base(expr: U): boolean {
    if (is_power(expr)) {
        const expo = expr.expo;
        if (is_rat(expo)) {
            if (is_num_and_negative(expr.base)) {
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
            is_power_and_has_rational_exponent_and_negative_base(caddr(p))) ||
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
                // Probbaly dead code because i => (expt -1 1/2), which isn't a (multiply )
                return true;
            }
            if (is_power_and_has_rational_exponent_and_negative_base(caddr(expr))) {
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
 * Notice that 
 * @param expr 
 * @param $ 
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function is_complex_number(expr: U, $: ExtensionEnv): boolean {
    // console.lg(`is_complex_number ${render_as_sexpr(expr, $)}`);
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

export function iseveninteger(expr: U): boolean {
    return is_rat_and_integer(expr) && expr.a.isEven();
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
        is_rat_and_integer(p) || (is_power(p) && is_rat_and_integer(cadr(p)) && is_rat_and_integer(caddr(p)))
    );
}

export function isNumberOneOverSomething(p: U): boolean {
    return is_rat(p) && p.isFraction() && MEQUAL(p.a.abs(), 1);
}

export function isoneover(p: U): boolean {
    return is_power(p) && is_num_and_eq_minus_one(caddr(p));
}

/**
 *
 */
export function is_rat_and_fraction(p: U): p is Rat {
    return is_rat(p) && p.isFraction();
}

// n an int
/**
 * Returns true if the expr is the specified number.
 * TODO: This only handles Rat and Flt. Everything else returns false.
 * @param expr The expresson being tested.
 * @param n The value that the expression must match.
 */
export function equaln(expr: U, n: number): boolean {
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
export function is_num_and_equalq(expr: U, a: number, b: number): boolean {
    if (is_rat(expr)) {
        return expr.numer().isIntegerNumber(a) && expr.denom().isIntegerNumber(b);
    }
    else if (is_flt(expr)) {
        return expr.d === a / b;
    }
    else {
        return false;
    }
}

// p == 1/2 ?
export function is_num_and_equal_one_half(p: U): boolean {
    return is_num_and_equalq(p, 1, 2);
}

// p == -1/2 ?
export function is_num_and_equal_minus_half(p: U): boolean {
    return is_num_and_equalq(p, -1, 2);
}

// p == 1/sqrt(2) ?
export function isoneoversqrttwo(p: U): boolean {
    return is_power(p) && equaln(cadr(p), 2) && is_num_and_equalq(caddr(p), -1, 2);
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
        is_num_and_equal_one_half(cadr(p)) &&
        isSqrtThree(caddr(p)) &&
        length_of_cons_otherwise_zero(p) === 3
    );
}

// Check if the value is -sqrt(3)/2
export function isMinusSqrtThreeOverTwo(p: U): boolean {
    return (
        is_multiply(p) &&
        is_num_and_equal_minus_half(cadr(p)) &&
        isSqrtThree(caddr(p)) &&
        length_of_cons_otherwise_zero(p) === 3
    );
}

// Check if value is sqrt(3)
function isSqrtThree(p: U): boolean {
    return is_power(p) && equaln(cadr(p), 3) && is_num_and_equal_one_half(caddr(p));
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
