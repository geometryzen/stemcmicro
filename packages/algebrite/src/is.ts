import { imu, is_flt, is_num, is_rat, Num, Rat } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { guess, isone, is_add, is_cons_opr_eq_power, is_multiply, is_num_and_eq_number, is_num_and_eq_one_half, is_num_and_eq_rational, is_num_and_negative, is_power, is_rat_and_integer } from "@stemcmicro/helpers";
import { caddr, cadnr, cadr, is_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "./env/ExtensionEnv";
import { length_of_cons_otherwise_zero } from "./length_of_cons_or_zero";
import { FLOAT, MEQUAL, MSIGN, SYMBOL_X, SYMBOL_Y, SYMBOL_Z } from "./runtime/constants";

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
    } else if (is_flt(expr)) {
        return expr.d > 0.0;
    } else {
        return false;
    }
}

/**
 *
 */
export function is_num_and_eq_minus_one(p: U): p is Num & { __ts_sign: -1; __ts_integer: true; __ts_special: -1 } {
    if (is_num(p)) {
        return p.isMinusOne();
    } else {
        return false;
    }
}

/**
 *
 */
export function is_plus_or_minus_one(x: U, $: ExprContext): boolean {
    return isone(x, $) || is_num_and_eq_minus_one(x);
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

export function isunivarpolyfactoredorexpandedform(p: U, x: U | null): U | false {
    // console.lg("isunivarpolyfactoredorexpandedform", `${p}`, `${x}`);
    if (x == null) {
        x = guess(p);
    }

    if (is_poly_factored_or_expanded_form(p, x) && countTrue(p.contains(SYMBOL_X), p.contains(SYMBOL_Y), p.contains(SYMBOL_Z)) === 1) {
        return x;
    } else {
        return false;
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

function is_poly_factored_or_expanded_form(p: U, x: U): boolean {
    return is_poly_factored_or_expanded_form_factor(p, x);
}

function is_poly_factored_or_expanded_form_factor(p: U, x: U): boolean {
    if (is_multiply(p)) {
        return p.tail().every((el) => {
            const bool = is_poly_factored_or_expanded_form_power(el, x);
            return bool;
        });
    } else {
        return is_poly_factored_or_expanded_form_power(p, x);
    }
}

function is_poly_factored_or_expanded_form_power(p: U, x: U): boolean {
    if (is_power(p)) {
        const base = p.base;
        const expo = p.expo;
        return is_rat(expo) && expo.isPositiveInteger() && is_poly_expanded_form_expr(base, x);
    } else {
        return is_poly_expanded_form_expr(p, x);
    }
}

// --------------------------------------

/**
 * Determines whether the expression, p, is a polynomial in the variable, x.
 */
export function is_poly_expanded_form(p: U, x: U): boolean {
    // console.lg(`is_poly_expanded_form ${print_expr(p, $)} ${x}`);
    if (p.contains(x)) {
        return is_poly_expanded_form_expr(p, x);
    } else {
        // If the expression does not contain the variable then it's a non-starter.
        return false;
    }
}

function is_poly_expanded_form_expr(p: U, x: U): boolean {
    // console.lg(`is_poly_expanded_form_expr ${print_expr(p, $)} ${x}`);
    if (is_add(p)) {
        return p.tail().every((term) => is_poly_expanded_form_term(term, x));
    } else {
        return is_poly_expanded_form_term(p, x);
    }
}

function is_poly_expanded_form_term(p: U, x: U): boolean {
    // console.lg(`is_poly_expanded_form_term ${print_expr(p, $)} ${x}`);
    if (is_multiply(p)) {
        return p.tail().every((factor) => is_poly_expanded_form_factor(factor, x));
    } else {
        return is_poly_expanded_form_factor(p, x);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function is_poly_expanded_form_factor(p: U, x: U): boolean {
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
    } else {
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
    return (is_multiply(p) && length_of_cons_otherwise_zero(p) === 3 && is_flt(cadnr(p, 1)) && is_power_and_has_rational_exponent_and_negative_base(cadnr(p, 2))) || $.equals(p, imu);
}

/**
 * (multiply Num i)
 */
export function is_imaginary_number(expr: U): boolean {
    if (is_multiply(expr)) {
        // (multiply a1 a2 a3 ...)
        if (length_of_cons_otherwise_zero(expr) === 3) {
            // (multiply x y)
            if (is_num(cadr(expr)) && caddr(expr).equals(imu)) {
                // (multiply Num i)
                return true;
            }
            if (expr.equals(imu)) {
                // Probbaly dead code because i => (pow -1 1/2), which isn't a (multiply )
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
    return (is_add(p) && length_of_cons_otherwise_zero(p) === 3 && is_flt(cadr(p)) && isimaginarynumberdouble(caddr(p), $)) || isimaginarynumberdouble(p, $);
}

/**
 * Determines whether expr is of the form (+ Num (something times i))
 * For this to work it is crucial that the complex number terms be arranged with
 * the real part on the left hand side. e.g. 1.0 + 2.0*i.
 */
export function is_complex_number(expr: U): boolean {
    // console.lg(`is_complex_number ${render_as_sexpr(expr, $)}`);
    if (is_add(expr)) {
        // console.lg(`${$.toInfixString(expr)} is an add expression`);
        const n = length_of_cons_otherwise_zero(expr);
        // console.lg(`${$.toInfixString(expr)} n = ${n}`);
        if (n === 3) {
            const x = cadr(expr);
            // console.lg(`${$.toInfixString(expr)} X = ${$.toInfixString(X)}`);
            if (is_num(x)) {
                if (is_imaginary_number(caddr(expr)) || is_imaginary_number(expr)) {
                    return true;
                }
            } else {
                // console.lg(`${$.toInfixString(expr)} X = ${$.toInfixString(X)} is not complex because X is not a num.`);
            }
        }
    }
    return false;
}

export function is_rat_and_even_integer(expr: U): boolean {
    return is_rat_and_integer(expr) && expr.a.isEven();
}

// i.e. 2, 2^3, etc.
export function isintegerfactor(p: U): boolean {
    return is_rat_and_integer(p) || (is_power(p) && is_rat_and_integer(cadr(p)) && is_rat_and_integer(caddr(p)));
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

// p == -1/2 ?
export function is_num_and_equal_minus_half(p: U): boolean {
    return is_num_and_eq_rational(p, -1, 2);
}

/**
 *
 * @param x
 * @returns
 */
export function is_one_over_sqrt_two(x: U): boolean {
    // 1/sqrt(2) = (power sqrt(2) -1) = (power (power 2 -1/2) -1)
    if (is_cons(x) && is_cons_opr_eq_power(x)) {
        return is_power(x) && is_num_and_eq_number(cadr(x), 2) && is_num_and_eq_rational(caddr(x), -1, 2);
    } else {
        return false;
    }
}

export function is_minus_one_over_sqrt_two(p: U): boolean {
    return is_multiply(p) && is_num_and_eq_number(cadr(p), -1) && is_one_over_sqrt_two(caddr(p)) && length_of_cons_otherwise_zero(p) === 3;
}

// Check if the value is sqrt(3)/2
export function isSqrtThreeOverTwo(p: U): boolean {
    return is_multiply(p) && is_num_and_eq_one_half(cadr(p)) && isSqrtThree(caddr(p)) && length_of_cons_otherwise_zero(p) === 3;
}

// Check if the value is -sqrt(3)/2
export function isMinusSqrtThreeOverTwo(p: U): boolean {
    return is_multiply(p) && is_num_and_equal_minus_half(cadr(p)) && isSqrtThree(caddr(p)) && length_of_cons_otherwise_zero(p) === 3;
}

// Check if value is sqrt(3)
function isSqrtThree(p: U): boolean {
    return is_power(p) && is_num_and_eq_number(cadr(p), 3) && is_num_and_eq_one_half(caddr(p));
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
