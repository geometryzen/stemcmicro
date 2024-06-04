import { create_sym, is_blade, is_err, is_flt, is_hyp, is_imu, is_keyword, is_num, is_rat, is_str, is_sym, is_uom, one, Rat, Sym, zero } from "@stemcmicro/atoms";
import { ExprContext, ExprHandler } from "@stemcmicro/context";
import { Directive } from "@stemcmicro/directive";
import { is_native, Native, native_sym } from "@stemcmicro/native";
import { is_add, is_num_and_negative, is_power } from "@stemcmicro/predicates";
import { caadr, caar, caddddr, cadddr, caddr, cadnr, cadr, car, cddr, cdr, Cons, is_atom, is_cons, nil, U } from "@stemcmicro/tree";
import { lt_num_num } from "../calculators/compare/lt_num_num";
import { is_localizable } from "../diagnostics/localizable";
import { isone } from "../helpers/isone";
import { negate } from "../helpers/negate";
import { equaln, isNumberOneOverSomething, is_num_and_equal_one_half, is_num_and_eq_minus_one, is_num_and_eq_two, is_rat_and_fraction } from "../is";
import { nativeStr } from "../nativeInt";
import { denominator } from "../operators/denominator/denominator";
import { numerator } from "../operators/numerator/numerator";
import { is_pi } from "../operators/pi/is_pi";
import { is_base_of_natural_logarithm } from "../predicates/is_base_of_natural_logarithm";
import { ProgrammingError } from "../programming/ProgrammingError";
import {
    ADD,
    ARCCOS,
    ARCSIN,
    ARCTAN,
    ASSIGN,
    BINOMIAL,
    CEILING,
    COS,
    DEFINT,
    DO,
    FACTORIAL,
    FLOOR,
    FN,
    FOR,
    FUNCTION,
    LAST_ASCII_PRINT,
    LAST_HUMAN_PRINT,
    LAST_INFIX_PRINT,
    LAST_LATEX_PRINT,
    LAST_SEXPR_PRINT,
    MULTIPLY,
    PATTERN,
    POWER,
    PRINT_LEAVE_E_ALONE,
    PRINT_LEAVE_X_ALONE,
    PRODUCT,
    ROUND,
    SIN,
    SQRT,
    SUM,
    TAN,
    TEST,
    TESTGE,
    TESTGT,
    TESTLE,
    TESTLT,
    UNIT
} from "../runtime/constants";
import { RESERVED_KEYWORD_LAST } from "../runtime/ns_script";
import { mp_denominator } from "./mp_denominator";
import { mp_numerator } from "./mp_numerator";
import { PrintMode } from "./PrintMode";
import { print_number } from "./print_number";
import { render_as_sexpr } from "./render_as_sexpr";

const MATH_E = native_sym(Native.E);
const MATH_IMU = native_sym(Native.IMU);
const MATH_PI = native_sym(Native.PI);
const TESTEQ = native_sym(Native.testeq);
const COMPONENT = native_sym(Native.component);

/**
 *
 */
export interface PrintConfig {
    pushDirective(directive: number, value: number): void;
    popDirective(): void;
    getBinding(opr: Sym, target: Cons): U;
    getDirective(directive: number): number;
    getSymbolPrintName(sym: Sym): string;
    handlerFor<T extends U>(expr: T): ExprHandler<T>;
    valueOf(expr: U): U;
}

export function get_script_last($: PrintConfig): U {
    return $.valueOf(RESERVED_KEYWORD_LAST);
}

export function get_last_print_mode_symbol(printMode: PrintMode): Sym {
    switch (printMode) {
        case PrintMode.Ascii:
            return LAST_ASCII_PRINT;
        case PrintMode.Human:
            return LAST_HUMAN_PRINT;
        case PrintMode.LaTeX:
            return LAST_LATEX_PRINT;
        case PrintMode.Infix:
            return LAST_INFIX_PRINT;
        case PrintMode.SExpr:
            return LAST_SEXPR_PRINT;
        default:
            throw new ProgrammingError();
    }
}

export function print_str(s: string): string {
    return s;
}

function print_char(c: string): string {
    return c;
}

function print_base_of_denom(base: U, $: PrintConfig): string {
    if (should_group_base_of_denom(base)) {
        return `(${render_using_non_sexpr_print_mode(base, $)})`;
    } else {
        return render_using_non_sexpr_print_mode(base, $);
    }
}

function should_group_base_of_denom(expr: U): boolean {
    if (is_rat(expr) && (expr.isNegative() || expr.isFraction())) {
        return true;
    }
    if (is_flt(expr) && expr.isNegative()) {
        return true;
    }
    if (is_add(expr)) {
        return true;
    }
    if (is_multiply(expr)) {
        return true;
    }
    if (is_power(expr)) {
        return true;
    }
    return false;
}

function print_expo_of_denom(expo: U, $: PrintConfig): string {
    if (is_rat(expo) && expo.isFraction()) {
        return `(${render_using_non_sexpr_print_mode(expo, $)})`;
    }
    if (is_add(expo) || is_multiply(expo) || is_power(expo)) {
        return `(${render_using_non_sexpr_print_mode(expo, $)})`;
    } else {
        return render_using_non_sexpr_print_mode(expo, $);
    }
}

// prints stuff after the divide symbol "/"

// d is the number of denominators
function print_denom(p: U, d: number, $: PrintConfig): string {
    // console.lg(`print_denom p = ${p} d = ${d}`);
    let str = "";

    const BASE = cadr(p);
    let EXPO = caddr(p);

    // i.e. 1 / (2^(1/3))

    // get the cases like BASE^(-1) out of
    // the way, they just become 1/BASE
    if (is_num_and_eq_minus_one(EXPO)) {
        str += print_base_of_denom(BASE, $);
        return str;
    }

    if (d === 1) {
        str += print_char("(");
    }

    // prepare the exponent
    // (needs to be negated)
    // before printing it out
    EXPO = negate($, EXPO);
    str += print_power(BASE, EXPO, $);
    if (d === 1) {
        str += print_char(")");
    }
    return str;
}

function print_a_over_b(p: Cons, _: PrintConfig): string {
    // console.lg(`print_a_over_b p => ${$.toListString(p)}`);
    let A: U, B: U;
    let str = "";
    let flag = 0;

    // count numerators and denominators
    let n = 0;
    let d = 0;

    let p1: U = p.cdr;
    let p2 = car(p1);

    if (is_rat(p2)) {
        A = mp_numerator(p2).abs();
        B = mp_denominator(p2);
        if (!isone(A, _)) {
            n++;
        }
        if (!isone(B, _)) {
            d++;
        }
        p1 = cdr(p1);
    } else {
        A = one;
        B = one;
    }

    while (is_cons(p1)) {
        p2 = car(p1);
        if (is_denominator(p2)) {
            d++;
        } else {
            n++;
        }
        p1 = cdr(p1);
    }

    //breakpoint
    if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
        str += print_str("\\frac{");
    }

    if (n === 0) {
        str += print_char("1");
    } else {
        flag = 0;
        p1 = cdr(p);
        if (is_rat(car(p1))) {
            p1 = cdr(p1);
        }
        if (!isone(A, _)) {
            str += print_factor(A, false, false, _);
            flag = 1;
        }
        while (is_cons(p1)) {
            p2 = car(p1);
            if (!is_denominator(p2)) {
                if (flag) {
                    str += print_multiply_sign(_);
                }
                str += print_factor(p2, false, false, _);
                flag = 1;
            }
            p1 = cdr(p1);
        }
    }

    if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
        str += print_str("}{");
    } else if (_.getDirective(Directive.printMode) === PrintMode.Human) {
        str += print_str(" / ");
    } else {
        str += print_str("/");
    }

    if (d > 1 && _.getDirective(Directive.printMode) !== PrintMode.LaTeX) {
        str += print_char("(");
    }

    flag = 0;
    p1 = cdr(p);

    if (is_rat(car(p1))) {
        p1 = cdr(p1);
    }

    if (!isone(B, _)) {
        str += print_factor(B, false, false, _);
        flag = 1;
    }

    while (is_cons(p1)) {
        p2 = car(p1);
        if (is_denominator(p2)) {
            if (flag) {
                str += print_multiply_sign(_);
            }
            str += print_denom(p2, d, _);
            flag = 1;
        }
        p1 = cdr(p1);
    }

    if (d > 1 && _.getDirective(Directive.printMode) !== PrintMode.LaTeX) {
        str += print_char(")");
    }

    if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
        str += print_str("}");
    }

    return str;
}

/**
 * This is used for almost everything except printing in s-expr format.
 * TODO: Issue over naming with to_infix_string.
 * @param expr
 * @param $
 * @returns
 */
export function render_using_non_sexpr_print_mode(expr: U, $: PrintConfig): string {
    return print_additive_expr(expr, $);
}

export function print_additive_expr(p: U, _: PrintConfig): string {
    let str = "";
    if (is_add(p)) {
        p = cdr(p);
        if (sign_of_term(car(p)) === "-") {
            str += print_str("-");
        }
        str += print_multiplicative_expr(car(p), _);
        p = cdr(p);
        while (is_cons(p)) {
            if (sign_of_term(car(p)) === "+") {
                if (_.getDirective(Directive.printMode) === PrintMode.Human) {
                    str += print_str(" + ");
                } else {
                    str += print_str("+");
                }
            } else {
                if (_.getDirective(Directive.printMode) === PrintMode.Human) {
                    str += print_str(" - ");
                } else {
                    str += print_str("-");
                }
            }
            str += print_multiplicative_expr(car(p), _);
            p = cdr(p);
        }
    } else {
        if (sign_of_term(p) === "-") {
            // console.lg(`${p} is negative`);
            str += print_str("-");
        }
        str += print_multiplicative_expr(p, _);
    }
    return str;
}

/**
 * Returns '-' if term is a number less that zero, or if term has the form (* num ...) and num is less than zero.
 * For this to work correctly, it assumes that the term is in canonical form (with numbers move to the left).
 */
export function sign_of_term(term: U): "+" | "-" {
    // (* k ...) and k is a Num and less than zero.
    if (is_cons(term)) {
        if (is_multiply(term)) {
            const k = car(term.cdr);
            if (is_num(k)) {
                if (k.isNegative()) {
                    return "-";
                }
            }
        }
    }

    //  term itslef is a number less than zero.
    if (is_num(term) && term.isNegative()) {
        return "-";
    } else {
        return "+";
    }
}

/**
 * WARNING: This function treats (* -1 ...) or (* -1.0 ...) as (* ...).
 * In other words, it skips over the first argument when it is Rat(-1) or Flt(-1).
 * This means that we don't retain the floating aspect when Flt(-1)
 */
function print_multiply_when_no_denominators(expr: Cons, _: PrintConfig): string {
    // console.lg(`print_multiply_when_no_denominators: ${expr}`);
    let denom = "";
    let origAccumulator = "";
    let p = cdr(expr);

    // coeff -1?
    if (is_num_and_eq_minus_one(car(p))) {
        //      print_char('-')
        p = cdr(p);
    }

    let previousFactorWasANumber = false;

    // print the first factor ------------
    if (is_num(car(p))) {
        previousFactorWasANumber = true;
    }

    // this numberOneOverSomething thing is so that
    // we show things of the form
    //   numericFractionOfForm1/something * somethingElse
    // as
    //   somethingElse / something
    // so for example 1/2 * sqrt(2) is rendered as
    //   sqrt(2)/2
    // rather than the first form, which looks confusing.
    // NOTE that you might want to avoid this
    // when printing polynomials, as it could be nicer
    // to show the numeric coefficients well separated from
    // the variable, but we'll see when we'll
    // come to it if it's an issue.
    let numberOneOverSomething = false;
    if (_.getDirective(Directive.printMode) === PrintMode.LaTeX && is_cons(cdr(p)) && isNumberOneOverSomething(car(p))) {
        numberOneOverSomething = true;
        denom = (car(p) as Rat).b.toString();
    }

    let str = "";
    if (numberOneOverSomething) {
        origAccumulator = str;
        str = "";
    } else {
        str += print_outer_expr(car(p), false, false, _);
    }

    p = cdr(p);

    // print all the other factors -------
    while (is_cons(p)) {
        // check if we end up having a case where two numbers
        // are next to each other. In those cases, latex needs
        // to insert a \cdot otherwise they end up
        // right next to each other and read like one big number
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            if (previousFactorWasANumber) {
                // if what comes next is a power and the base
                // is a number, then we are in the case
                // of consecutive numbers.
                // Note that sqrt() i.e when exponent is 1/2
                // doesn't count because the radical gives
                // a nice graphical separation already.
                if (caar(p).equals(POWER)) {
                    if (is_num(car(cdr(car(p))))) {
                        // rule out square root
                        if (!is_rat_and_fraction(car(cdr(cdr(car(p)))))) {
                            str += " \\cdot ";
                        }
                    }
                }
            }
        }
        str += print_multiply_sign(_);
        str += print_outer_expr(car(p), false, true, _);

        previousFactorWasANumber = false;
        if (is_num(car(p))) {
            previousFactorWasANumber = true;
        }

        p = cdr(p);
    }

    if (numberOneOverSomething) {
        str = origAccumulator + "\\frac{" + str + "}{" + denom + "}";
    }
    return str;
}

export function print_multiplicative_expr(expr: U, $: PrintConfig): string {
    // console.lg("print_multiplicative_expr", `${expr}`);
    if (is_cons(expr) && is_multiply(expr)) {
        if (any_denominators(expr)) {
            return print_a_over_b(expr, $);
        } else {
            return print_multiply_when_no_denominators(expr, $);
        }
    } else {
        return print_outer_expr(expr, false, false, $);
    }
}

export function print_outer_expr(expr: U, omitParens: boolean, pastFirstFactor: boolean, _: PrintConfig): string {
    if (is_cons(expr) && is_outer(expr)) {
        let argList = expr.argList;
        if (is_cons(argList)) {
            let str = print_inner_expr(argList.car, false, false, _);
            argList = argList.cdr;
            while (is_cons(argList)) {
                str += print_outer_operator(_);
                str += print_inner_expr(car(argList), false, true, _);
                argList = argList.cdr;
            }
            return str;
        } else {
            throw new Error();
        }
    } else {
        return print_inner_expr(expr, omitParens, pastFirstFactor, _);
    }
}

function print_outer_operator(_: PrintConfig): string {
    // console.lg(`print_outer_operator`);
    if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
        return " \\wedge ";
    }

    if (_.getDirective(Directive.printMode) === PrintMode.Human) {
        return print_str(" ^ ");
    } else {
        return print_str("^");
    }
}

export function print_inner_expr(expr: U, omitParens: boolean, pastFirstFactor: boolean, _: PrintConfig): string {
    if (is_cons(expr) && is_inner_or_dot(expr)) {
        let argList = expr.argList;
        if (is_cons(argList)) {
            let str = print_factor(argList.car, false, false, _);
            argList = argList.cdr;
            while (is_cons(argList)) {
                str += print_inner_operator(_);
                str += print_factor(car(argList), false, true, _);
                argList = argList.cdr;
            }
            return str;
        } else {
            throw new Error();
        }
    } else if (is_cons(expr) && is_lco(expr)) {
        let argList = expr.argList;
        if (is_cons(argList)) {
            let str = print_factor(argList.car, false, false, _);
            argList = argList.cdr;
            while (is_cons(argList)) {
                str += print_lco_operator(_);
                str += print_factor(car(argList), false, true, _);
                argList = argList.cdr;
            }
            return str;
        } else {
            throw new Error();
        }
    } else if (is_cons(expr) && is_rco(expr)) {
        let argList = expr.argList;
        if (is_cons(argList)) {
            let str = print_factor(argList.car, false, false, _);
            argList = argList.cdr;
            while (is_cons(argList)) {
                str += print_rco_operator(_);
                str += print_factor(car(argList), false, true, _);
                argList = argList.cdr;
            }
            return str;
        } else {
            throw new Error();
        }
    } else {
        return print_factor(expr, omitParens, pastFirstFactor, _);
    }
}

function print_inner_operator(_: PrintConfig): string {
    if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
        return " \\mid ";
    }

    if (_.getDirective(Directive.printMode) === PrintMode.Human) {
        return print_str(" | ");
    } else {
        return print_str("|");
    }
}

function print_lco_operator(_: PrintConfig): string {
    if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
        return " \\ll ";
    }

    if (_.getDirective(Directive.printMode) === PrintMode.Human) {
        return print_str(" << ");
    } else {
        return print_str("<<");
    }
}

function print_rco_operator(_: PrintConfig): string {
    if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
        return " \\gg ";
    }

    if (_.getDirective(Directive.printMode) === PrintMode.Human) {
        return print_str(" >> ");
    } else {
        return print_str(">>");
    }
}

function print_grouping_expr(expr: U, $: PrintConfig): string {
    // console.lg(`print_grouping_expr ${expr}`);
    let str = "";
    str += print_char("(");
    str += render_using_non_sexpr_print_mode(expr, $);
    str += print_char(")");
    return str;
}

function print_factorial_function(p: U, $: PrintConfig): string {
    let accumulator = "";
    p = cadr(p);
    if (is_rat_and_fraction(p) || is_add(p) || is_multiply(p) || is_power(p) || is_factorial(p)) {
        accumulator += print_grouping_expr(p, $);
    } else {
        accumulator += render_using_non_sexpr_print_mode(p, $);
    }
    accumulator += print_char("!");
    return accumulator;
}

function print_abs_latex(expr: Cons, $: PrintConfig): string {
    const arg = expr.argList.head;
    let s = "";
    s += print_str("\\left |");
    s += render_using_non_sexpr_print_mode(arg, $);
    s += print_str(" \\right |");
    return s;
}

function print_abs_infix(expr: Cons, $: PrintConfig): string {
    const arg = expr.argList.head;
    let s = "";
    s += print_str("abs(");
    s += render_using_non_sexpr_print_mode(arg, $);
    s += print_str(")");
    return s;
}

function print_BINOMIAL_latex(p: U, $: PrintConfig): string {
    let accumulator = "";
    accumulator += print_str("\\binom{");
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += print_str("}{");
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    accumulator += print_str("} ");
    return accumulator;
}

function print_DOT_latex(p: U, $: PrintConfig): string {
    let accumulator = "";
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += print_str(" \\cdot ");
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    return accumulator;
}

function print_DOT_codegen(p: U, $: PrintConfig): string {
    let accumulator = "dot(";
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += ", ";
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    accumulator += ")";
    return accumulator;
}

function print_SIN_codegen(p: U, $: PrintConfig): string {
    let accumulator = "Math.sin(";
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += ")";
    return accumulator;
}

function print_COS_codegen(p: U, $: PrintConfig): string {
    let accumulator = "Math.cos(";
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += ")";
    return accumulator;
}

function print_TAN_codegen(p: U, $: PrintConfig): string {
    let accumulator = "Math.tan(";
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += ")";
    return accumulator;
}

function print_ARCSIN_codegen(p: U, $: PrintConfig): string {
    let accumulator = "Math.asin(";
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += ")";
    return accumulator;
}

function print_ARCCOS_codegen(p: U, $: PrintConfig): string {
    let accumulator = "Math.acos(";
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += ")";
    return accumulator;
}

function print_ARCTAN_codegen(p: U, $: PrintConfig): string {
    let accumulator = "Math.atan(";
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += ")";
    return accumulator;
}

function print_SQRT_latex(p: U, $: PrintConfig): string {
    let accumulator = "";
    accumulator += print_str("\\sqrt{");
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += print_str("} ");
    return accumulator;
}

function print_TRANSPOSE_latex(p: U, $: PrintConfig): string {
    let accumulator = "";
    accumulator += print_str("{");
    if (is_cons(cadr(p))) {
        accumulator += print_str("(");
    }
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    if (is_cons(cadr(p))) {
        accumulator += print_str(")");
    }
    accumulator += print_str("}");
    accumulator += print_str("^T");
    return accumulator;
}

function print_TRANSPOSE_codegen(p: U, $: PrintConfig): string {
    let accumulator = "";
    accumulator += print_str("transpose(");
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += print_str(")");
    return accumulator;
}

function print_UNIT_codegen(p: U, $: PrintConfig): string {
    let accumulator = "";
    accumulator += print_str("identity(");
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += print_str(")");
    return accumulator;
}

function print_INV_latex(p: Cons, $: PrintConfig): string {
    let str = "";
    str += print_str("{");
    if (is_cons(cadr(p))) {
        str += print_str("(");
    }
    str += render_using_non_sexpr_print_mode(cadr(p), $);
    if (is_cons(cadr(p))) {
        str += print_str(")");
    }
    str += print_str("}");
    str += print_str("^{-1}");
    return str;
}

function print_INV_codegen(p: U, $: PrintConfig): string {
    let accumulator = "";
    accumulator += print_str("inv(");
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += print_str(")");
    return accumulator;
}

function print_DEFINT_latex(p: U, $: PrintConfig): string {
    let accumulator = "";
    const functionBody = car(cdr(p));

    p = cdr(p);
    const originalIntegral = p;
    let numberOfIntegrals = 0;

    while (is_cons(cdr(cdr(p)))) {
        numberOfIntegrals++;
        const theIntegral = cdr(cdr(p));

        accumulator += print_str("\\int^{");
        accumulator += render_using_non_sexpr_print_mode(car(cdr(theIntegral)), $);
        accumulator += print_str("}_{");
        accumulator += render_using_non_sexpr_print_mode(car(theIntegral), $);
        accumulator += print_str("} \\! ");
        p = cdr(theIntegral);
    }

    accumulator += render_using_non_sexpr_print_mode(functionBody, $);
    accumulator += print_str(" \\,");

    p = originalIntegral;

    for (let i = 1; i <= numberOfIntegrals; i++) {
        const theVariable = cdr(p);
        accumulator += print_str(" \\mathrm{d} ");
        accumulator += render_using_non_sexpr_print_mode(car(theVariable), $);
        if (i < numberOfIntegrals) {
            accumulator += print_str(" \\, ");
        }
        p = cdr(cdr(theVariable));
    }
    return accumulator;
}

function print_SUM_latex(p: Cons, $: PrintConfig): string {
    let accumulator = "\\sum_{";
    accumulator += render_using_non_sexpr_print_mode(cadnr(p, 2), $);
    accumulator += "=";
    accumulator += render_using_non_sexpr_print_mode(cadnr(p, 3), $);
    accumulator += "}^{";
    accumulator += render_using_non_sexpr_print_mode(cadnr(p, 4), $);
    accumulator += "}{";
    accumulator += render_using_non_sexpr_print_mode(cadnr(p, 1), $);
    accumulator += "}";
    return accumulator;
}

function print_SUM_codegen(p: Cons, $: PrintConfig): string {
    const body = cadnr(p, 1);
    const variable = cadnr(p, 2);
    const lowerlimit = cadnr(p, 3);
    const upperlimit = cadnr(p, 4);

    const accumulator =
        "(function(){" +
        " var " +
        render_using_non_sexpr_print_mode(variable, $) +
        "; " +
        " var holderSum = 0; " +
        " var lowerlimit = " +
        render_using_non_sexpr_print_mode(lowerlimit, $) +
        "; " +
        " var upperlimit = " +
        render_using_non_sexpr_print_mode(upperlimit, $) +
        "; " +
        " for (" +
        render_using_non_sexpr_print_mode(variable, $) +
        " = lowerlimit; " +
        render_using_non_sexpr_print_mode(variable, $) +
        " < upperlimit; " +
        render_using_non_sexpr_print_mode(variable, $) +
        "++) { " +
        "   holderSum += " +
        render_using_non_sexpr_print_mode(body, $) +
        ";" +
        " } " +
        " return holderSum;" +
        "})()";

    return accumulator;
}

function print_TEST_latex(p: U, $: PrintConfig): string {
    let accumulator = "\\left\\{ \\begin{array}{ll}";

    p = cdr(p);
    while (is_cons(p)) {
        // odd number of parameters means that the
        // last argument becomes the default case
        // i.e. the one without a test.
        if (cdr(p).isnil) {
            accumulator += "{";
            accumulator += render_using_non_sexpr_print_mode(car(p), $);
            accumulator += "} & otherwise ";
            accumulator += " \\\\\\\\";
            break;
        }

        accumulator += "{";
        accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
        accumulator += "} & if & ";
        accumulator += render_using_non_sexpr_print_mode(car(p), $);
        accumulator += " \\\\\\\\";

        // test unsuccessful, continue to the
        // next pair of test,value
        p = cddr(p);
    }
    accumulator = accumulator.substring(0, accumulator.length - 4);
    return (accumulator += "\\end{array} \\right.");
}

function print_TEST_codegen(p: U, $: PrintConfig): string {
    let accumulator = "(function(){";

    p = cdr(p);
    let howManyIfs = 0;
    while (is_cons(p)) {
        // odd number of parameters means that the
        // last argument becomes the default case
        // i.e. the one without a test.
        if (cdr(p).isnil) {
            accumulator += "else {";
            accumulator += "return (" + render_using_non_sexpr_print_mode(car(p), $) + ");,$";
            accumulator += "}";
            break;
        }

        if (howManyIfs) {
            accumulator += " else ";
        }

        accumulator += "if (" + render_using_non_sexpr_print_mode(car(p), $) + "){,$";
        accumulator += "return (" + render_using_non_sexpr_print_mode(cadr(p), $) + ");,$";
        accumulator += "}";

        // test unsuccessful, continue to the
        // next pair of test,value
        howManyIfs++;
        p = cddr(p);
    }

    accumulator += "})()";

    return accumulator;
}

function print_TESTLT_latex(p: U, $: PrintConfig): string {
    let accumulator = "{";
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += "}";
    accumulator += " < ";
    accumulator += "{";
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    return (accumulator += "}");
}

function print_TESTLE_latex(p: U, $: PrintConfig): string {
    let accumulator = "{";
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += "}";
    accumulator += " \\leq ";
    accumulator += "{";
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    return (accumulator += "}");
}

function print_TESTGT_latex(p: U, $: PrintConfig): string {
    let accumulator = "{";
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += "}";
    accumulator += " > ";
    accumulator += "{";
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    return (accumulator += "}");
}

function print_TESTGE_latex(p: U, $: PrintConfig): string {
    let accumulator = "{";
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += "}";
    accumulator += " \\geq ";
    accumulator += "{";
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    return (accumulator += "}");
}

function print_testeq_latex(expr: Cons, $: PrintConfig): string {
    let s = "{";
    s += render_using_non_sexpr_print_mode(expr.lhs, $);
    s += "}";
    s += " = ";
    s += "{";
    s += render_using_non_sexpr_print_mode(expr.rhs, $);
    return (s += "}");
}

function print_FOR_codegen(p: Cons, $: PrintConfig): string {
    const body = cadr(p);
    const variable = caddr(p);
    const lowerlimit = cadddr(p);
    const upperlimit = caddddr(p);

    const accumulator =
        "(function(){" +
        " var " +
        variable +
        "; " +
        " var lowerlimit = " +
        render_using_non_sexpr_print_mode(lowerlimit, $) +
        "; " +
        " var upperlimit = " +
        render_using_non_sexpr_print_mode(upperlimit, $) +
        "; " +
        " for (" +
        variable +
        " = lowerlimit; " +
        variable +
        " < upperlimit; " +
        variable +
        "++) { " +
        "   " +
        render_using_non_sexpr_print_mode(body, $) +
        " } " +
        "})()";

    return accumulator;
}

function print_DO_codegen(p: U, $: PrintConfig): string {
    let accumulator = "";

    p = cdr(p);
    while (is_cons(p)) {
        accumulator += render_using_non_sexpr_print_mode(car(p), $);
        p = cdr(p);
    }

    return accumulator;
}

function print_SETQ_codegen(p: U, $: PrintConfig): string {
    let accumulator = "";
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += " = ";
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    accumulator += "; ";
    return accumulator;
}

function print_PRODUCT_latex(p: U, $: PrintConfig): string {
    let accumulator = "\\prod_{";
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    accumulator += "=";
    accumulator += render_using_non_sexpr_print_mode(cadddr(p), $);
    accumulator += "}^{";
    accumulator += render_using_non_sexpr_print_mode(caddddr(p), $);
    accumulator += "}{";
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += "}";
    return accumulator;
}

function print_PRODUCT_codegen(p: U, $: PrintConfig): string {
    const body = cadr(p);
    const variable = caddr(p);
    const lowerlimit = cadddr(p);
    const upperlimit = caddddr(p);

    const accumulator =
        "(function(){" +
        " var " +
        render_using_non_sexpr_print_mode(variable, $) +
        "; " +
        " var holderProduct = 1; " +
        " var lowerlimit = " +
        render_using_non_sexpr_print_mode(lowerlimit, $) +
        "; " +
        " var upperlimit = " +
        render_using_non_sexpr_print_mode(upperlimit, $) +
        "; " +
        " for (" +
        render_using_non_sexpr_print_mode(variable, $) +
        " = lowerlimit; " +
        render_using_non_sexpr_print_mode(variable, $) +
        " < upperlimit; " +
        render_using_non_sexpr_print_mode(variable, $) +
        "++) { " +
        "   holderProduct *= " +
        render_using_non_sexpr_print_mode(body, $) +
        ";" +
        " } " +
        " return holderProduct;" +
        "})()";

    return accumulator;
}

function should_tweak_exponent_syntax(base: U, $: PrintConfig): boolean {
    if (is_sym(base)) {
        if (base.equals(create_sym("x"))) {
            const sym = PRINT_LEAVE_X_ALONE;
            const binding = $.getBinding(sym, nil);
            if (binding.equals(sym) || binding.isnil) {
                // There is no override, therefore tweak!
                return true;
            } else {
                return !equaln(binding, 1);
            }
        } else {
            // base symbols that don't have the printname 'x' can have their power expressions tweaked.
            return true;
        }
    } else {
        // e.g. (pow 5 -1) can be written as 1/5
        return true;
    }
}

function print_power(base: U, expo: U, _: PrintConfig) {
    let str = "";

    // quick check this is actually a square root.
    if (is_num_and_equal_one_half(expo)) {
        if (equaln(base, 2)) {
            if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
                str += print_str("Math.SQRT2");
                return str;
            }
        } else {
            if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
                str += print_str("\\sqrt{");
                str += render_using_non_sexpr_print_mode(base, _);
                str += print_str("}");
                return str;
            } else if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
                str += print_str("Math.sqrt(");
                str += render_using_non_sexpr_print_mode(base, _);
                str += print_str(")");
                return str;
            }
        }
    }

    if (equaln(_.getBinding(PRINT_LEAVE_E_ALONE, nil), 1) && is_base_of_natural_logarithm(base)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            str += print_str("Math.exp(");
            str += print_expo_of_denom(expo, _);
            str += print_str(")");
            return str;
        }

        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            str += print_str("e^{");
            str += render_using_non_sexpr_print_mode(expo, _);
            str += print_str("}");
        } else {
            str += print_str("exp(");
            str += render_using_non_sexpr_print_mode(expo, _);
            str += print_str(")");
        }
        return str;
    }

    if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
        str += print_str("Math.pow(");
        str += print_base_of_denom(base, _);
        str += print_str(", ");
        str += print_expo_of_denom(expo, _);
        str += print_str(")");
        return str;
    }

    if (should_tweak_exponent_syntax(base, _)) {
        // if the exponent is negative then
        // we invert the base BUT we don't do
        // that if the base is "e", because for
        // example when trigonometric functions are
        // expressed in terms of exponential functions
        // that would be really confusing, one wants to
        // keep "e" as the base and the negative exponent
        if (!is_base_of_natural_logarithm(base)) {
            if (is_num(expo) && expo.isMinusOne()) {
                if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
                    str += print_str("\\frac{1}{");
                } else if (_.getDirective(Directive.printMode) === PrintMode.Human) {
                    str += print_str("1 / ");
                } else {
                    str += print_str("1/");
                }

                if (is_cons(base) && _.getDirective(Directive.printMode) !== PrintMode.LaTeX) {
                    str += print_str("(");
                    str += render_using_non_sexpr_print_mode(base, _);
                    str += print_str(")");
                } else {
                    str += render_using_non_sexpr_print_mode(base, _);
                }

                if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
                    str += print_str("}");
                }

                return str;
            }

            if (is_negative(expo)) {
                if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
                    str += print_str("\\frac{1}{");
                } else if (_.getDirective(Directive.printMode) === PrintMode.Human) {
                    str += print_str("1 / ");
                } else {
                    str += print_str("1/");
                }

                const newExponent = negate(_, expo);

                if (is_cons(base) && _.getDirective(Directive.printMode) !== PrintMode.LaTeX) {
                    str += print_str("(");
                    str += print_power(base, newExponent, _);
                    str += print_str(")");
                } else {
                    str += print_power(base, newExponent, _);
                }

                if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
                    str += print_str("}");
                }

                return str;
            }
        }

        if (is_rat_and_fraction(expo) && _.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            str += print_str("\\sqrt");
            const denomExponent = denominator(expo, _);
            // we omit the "2" on the radical
            if (!is_num_and_eq_two(denomExponent)) {
                str += print_str("[");
                str += render_using_non_sexpr_print_mode(denomExponent, _);
                str += print_str("]");
            }
            str += print_str("{");
            expo = numerator(expo, _);
            str += print_power(base, expo, _);
            str += print_str("}");
            return str;
        }
    }

    if (_.getDirective(Directive.printMode) === PrintMode.LaTeX && isone(expo, _)) {
        // if we are in latex mode we turn many
        // radicals into a radix sign with a power
        // underneath, and the power is often one
        // (e.g. square root turns into a radical
        // with a power one underneath) so handle
        // this case simply here, just print the base
        str += render_using_non_sexpr_print_mode(base, _);
    } else {
        // print the base,
        // determining if it needs to be
        // wrapped in parentheses or not
        if (is_power(base)) {
            // power is right associative so without parens it would be interpreted wrong.
            // Not sure why we have the LaTeX shananigans.
            if (_.getDirective(Directive.printMode) !== PrintMode.LaTeX) {
                str += print_str("(");
                str += print_factor(base, true, false, _);
                str += print_str(")");
            } else {
                str += print_factor(base, true, false, _);
            }
        } else if (is_num_and_negative(base)) {
            // Prevent ambiguity when dealing with unary minus.
            // As an example, in EcmaScript unary minus technically has higher precedence than exponentiation,
            // but compilers sometimes require parentheses to avoid errors.
            str += print_str("(");
            str += render_using_non_sexpr_print_mode(base, _);
            str += print_str(")");
        } else if (is_add(base)) {
            // Addition has lower precedence than power so we need to prevent it from being pulled apart by the exponentiation.
            str += print_str("(");
            str += render_using_non_sexpr_print_mode(base, _);
            str += print_str(")");
        } else if (is_multiply(base)) {
            // Multiplicationn has lower precedence than power so we need to prevent it from being pulled apart by the exponentiation.
            // Not sure why we have the LaTeX shananigans.
            if (_.getDirective(Directive.printMode) !== PrintMode.LaTeX) {
                str += print_str("(");
                str += print_factor(base, true, false, _);
                str += print_str(")");
            } else {
                str += print_factor(base, true, false, _);
            }
        } else if (is_outer(base)) {
            // Outer product has lower precedence than power so we need to prevent it from being pulled apart by the exponentiation.
            str += print_str("(");
            str += render_using_non_sexpr_print_mode(base, _);
            str += print_str(")");
        } else if (is_inner_or_dot(base)) {
            // Inner product has lower precedence than power so we need to prevent it from being pulled apart by the exponentiation.
            str += print_str("(");
            str += render_using_non_sexpr_print_mode(base, _);
            str += print_str(")");
        } else if (is_num(base) && (lt_num_num(base, zero) || is_rat_and_fraction(base))) {
            str += print_str("(");
            str += print_factor(base, false, false, _);
            str += print_str(")");
        } else {
            str += print_factor(base, false, false, _);
        }

        // print the power symbol
        if (_.getDirective(Directive.printMode) === PrintMode.Human) {
            if (_.getDirective(Directive.useCaretForExponentiation)) {
                str += print_str("^");
            } else {
                str += print_str("**");
            }
        } else if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            // No choice in LaTeX, it's a caret.
            str += print_str("^");
        } else {
            if (_.getDirective(Directive.useCaretForExponentiation)) {
                str += print_str("^");
            } else {
                str += print_str("**");
            }
        }

        // print the exponent
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            // in latex mode, one can omit the curly braces
            // wrapping the exponent if the exponent is only
            // one character long
            if (render_using_non_sexpr_print_mode(expo, _).length > 1) {
                str += print_str("{");
                str += render_using_non_sexpr_print_mode(expo, _);
                str += print_str("}");
            } else {
                str += render_using_non_sexpr_print_mode(expo, _);
            }
        } else if (is_cons(expo) || is_rat_and_fraction(expo) || (is_num(expo) && lt_num_num(expo, zero))) {
            str += print_str("(");
            str += render_using_non_sexpr_print_mode(expo, _);
            str += print_str(")");
        } else {
            str += print_factor(expo, false, false, _);
        }
    }
    return str;
}

function print_index_function(p: U, $: PrintConfig): string {
    let str = "";
    p = cdr(p);
    // TODO: Porobably need INNER, OUTER, RCO, LCO...
    if (caar(p).equals(ADD) || caar(p).equals(MULTIPLY) || caar(p).equals(POWER) || caar(p).equals(FACTORIAL)) {
        str += print_grouping_expr(car(p), $);
    } else {
        str += render_using_non_sexpr_print_mode(car(p), $);
    }
    str += print_str("[");
    p = cdr(p);
    if (is_cons(p)) {
        str += render_using_non_sexpr_print_mode(car(p), $);
        p = cdr(p);
        while (is_cons(p)) {
            str += print_str(",");
            str += render_using_non_sexpr_print_mode(car(p), $);
            p = cdr(p);
        }
    }
    str += print_str("]");
    return str;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function print_factor(expr: U, omitParens = false, pastFirstFactor = false, _: PrintConfig): string {
    // console.lg(`print_factor expr = ${expr} omitParens = ${omitParens}`);
    const omtPrns = omitParens;
    // console.lg(`print_factor ${expr} omitParens => ${omitParens} pastFirstFactor => ${false}`);
    if (is_num(expr)) {
        // in an evaluated term, all the numeric parts
        // are at the beginning of the term.
        // When printing the EXPRESSION,
        // we peek into the first factor of the term and we
        // look at whether it's a number less then zero.
        // if it is, we print the "-" as the "leading" part of the
        // print of the EXPRESSION, and then we proceed printint the factors
        // of the term. This means that when we come here, we must
        // skip printing the minus if the number is negative,
        // because it's already been printed.
        if (pastFirstFactor && lt_num_num(expr, zero)) {
            let str = "";
            str += "(";
            str += print_number(expr, pastFirstFactor, _);
            str += ")";
            return str;
        } else {
            return print_number(expr, pastFirstFactor, _);
        }
    }
    if (is_atom(expr)) {
        // TODO: Fix the casting.
        // _.getDirective(Directive.printMode);
        const handler = _.handlerFor(expr);
        switch (_.getDirective(Directive.printMode)) {
            // Consider replacing printMode with Native.xxx and put in a Directive
            case PrintMode.Human: {
                // FIXME
                return nativeStr(handler.dispatch(expr, native_sym(Native.human), nil, _ as unknown as ExprContext));
            }
            case PrintMode.Infix: {
                const response = handler.dispatch(expr, native_sym(Native.infix), nil, _ as unknown as ExprContext);
                if (is_str(response)) {
                    return nativeStr(response);
                } else if (is_err(response)) {
                    throw response;
                } else {
                    throw new ProgrammingError();
                }
            }
            case PrintMode.LaTeX: {
                return nativeStr(handler.dispatch(expr, native_sym(Native.latex), nil, _ as unknown as ExprContext));
            }
            case PrintMode.SExpr: {
                return nativeStr(handler.dispatch(expr, native_sym(Native.sexpr), nil, _ as unknown as ExprContext));
            }
            default: {
                throw new Error(`${_.getDirective(Directive.printMode)}`);
            }
        }
        /*
    
        if (is_boo(expr)) {
            return expr.equals(booT) ? 'true' : 'false';
        }
    
        if (is_str(expr)) {
            switch (_.getDirective(Directive.printMode)) {
                case PrintMode.Human: {
                    return str_extension.toHumanString(expr);
                }
                case PrintMode.Infix: {
                    return str_extension.toInfixString(expr);
                }
                case PrintMode.LaTeX: {
                    return str_extension.toLatexString(expr);
                }
                case PrintMode.SExpr: {
                    return str_extension.toListString(expr);
                }
                default: {
                    throw new Error(`${_.getDirective(Directive.printMode)}`);
                }
            }
        }
    
        if (is_tensor(expr)) {
            let str = '';
            if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
                str += print_tensor_latex(expr, _);
            }
            else {
                str += print_tensor(expr, _);
            }
            return str;
        }
    
        if (is_blade(expr)) {
            let str = '';
            if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
                str += expr.toLatexString();
            }
            else {
                str += expr.toInfixString();
            }
            return str;
        }
        */
    }

    if (is_cons(expr) && is_multiply(expr)) {
        let str = "";
        if (!omtPrns) {
            if (sign_of_term(expr) === "-" || _.getDirective(Directive.printMode) !== PrintMode.LaTeX) {
                if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
                    str += print_str(" \\left (");
                } else {
                    str += print_str("(");
                }
            }
        }
        str += render_using_non_sexpr_print_mode(expr, _);
        if (!omtPrns) {
            if (sign_of_term(expr) === "-" || _.getDirective(Directive.printMode) !== PrintMode.LaTeX) {
                if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
                    str += print_str(" \\right ) ");
                } else {
                    str += print_str(")");
                }
            }
        }
        return str;
    } else if (is_add(expr)) {
        let str = "";
        if (!omtPrns) {
            str += print_str("(");
        }
        str += render_using_non_sexpr_print_mode(expr, _);
        if (!omtPrns) {
            str += print_str(")");
        }
        return str;
    }

    if (is_power(expr)) {
        return print_power(expr.base, expr.expo, _);
    }

    //  if (car(p) == _list) {
    //    print_str("{")
    //    p = cdr(p)
    //    if (iscons(p)) {
    //      print_expr(car(p),$)
    //      p = cdr(p)
    //    }
    //    while (iscons(p)) {
    //      print_str(",")
    //      print_expr(car(p),$)
    //      p = cdr(p)
    //    }
    //    print_str("}")
    //    return
    //  }

    //
    // (Sym("function") body paramList)
    //
    if (is_cons(expr)) {
        // Demonstracting correct management of reference counting (as an experiment).
        const opr = expr.opr;
        const argList = expr.argList;
        try {
            if (opr.equals(FN)) {
                let str = "";
                const body = argList.item(1);
                try {
                    if (_.getDirective(Directive.printMode) !== PrintMode.EcmaScript) {
                        const paramList = argList.item(0);
                        try {
                            str += print_str("fn ");
                            const returned = render_as_sexpr(paramList, _);
                            str += returned;
                            str += print_str(" -> ");
                        } finally {
                            paramList.release();
                        }
                    }
                    str += render_using_non_sexpr_print_mode(body, _);
                    return str;
                } finally {
                    body.release();
                }
            } else if (opr.equals(FUNCTION)) {
                let str = "";
                const body = argList.item(0);
                try {
                    if (_.getDirective(Directive.printMode) !== PrintMode.EcmaScript) {
                        const paramList = argList.item(1);
                        try {
                            str += print_str("function ");
                            const returned = render_as_sexpr(paramList, _);
                            str += returned;
                            str += print_str(" -> ");
                        } finally {
                            paramList.release();
                        }
                    }
                    str += render_using_non_sexpr_print_mode(body, _);
                    return str;
                } finally {
                    body.release();
                }
            }
        } finally {
            opr.release();
            argList.release();
        }
    }

    if (car(expr).equals(PATTERN)) {
        let str = "";
        str += render_using_non_sexpr_print_mode(caadr(expr), _);
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            str += print_str(" \\rightarrow ");
        } else {
            if (_.getDirective(Directive.printMode) === PrintMode.Human) {
                str += print_str(" -> ");
            } else {
                str += print_str("->");
            }
        }

        str += render_using_non_sexpr_print_mode(car(cdr(cadr(expr))), _);
        return str;
    }

    if (car(expr).equals(COMPONENT) && is_sym(cadr(expr))) {
        let str = "";
        str += print_index_function(expr, _);
        return str;
    }

    // TODO: The generalization here would be that we look up the operator then ask for the right format
    // based upon _.getDirective(Directive.printMode), _.getDirective(Directive.printMode)===PrintMode.EcmaScript
    if (is_cons(expr) && is_factorial(expr)) {
        return print_factorial_function(expr, _);
    } else if (is_cons(expr) && is_abs(expr)) {
        // console.lg(`print_factor ${expr} omitParens => ${omitParens} pastFirstFactor => ${false} printMode: ${_.getDirective(Directive.printMode)}`);
        switch (_.getDirective(Directive.printMode)) {
            case PrintMode.Human:
            case PrintMode.Infix: {
                return print_abs_infix(expr, _);
            }
            case PrintMode.LaTeX: {
                return print_abs_latex(expr, _);
            }
            default: {
                // PrintMode.Ascii and PrintMode.SExpr is the other mode but that doesn't use this function.
                throw new ProgrammingError();
            }
        }
    } else if (car(expr).equals(SQRT) && _.getDirective(Directive.printMode) === PrintMode.LaTeX) {
        let str = "";
        str += print_SQRT_latex(expr, _);
        return str;
        // eslint-disable-next-line no-dupe-else-if
    } else if (is_transpose(expr)) {
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            let str = "";
            str += print_TRANSPOSE_latex(expr, _);
            return str;
        } else if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_TRANSPOSE_codegen(expr, _);
            return str;
        }
    } else if (car(expr).equals(UNIT)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_UNIT_codegen(expr, _);
            return str;
        }
    } else if (is_cons(expr) && is_opr_eq_inv(expr)) {
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            let str = "";
            str += print_INV_latex(expr, _);
            return str;
        } else if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_INV_codegen(expr, _);
            return str;
        }
    } else if (car(expr).equals(BINOMIAL) && _.getDirective(Directive.printMode) === PrintMode.LaTeX) {
        let str = "";
        str += print_BINOMIAL_latex(expr, _);
        return str;
    } else if (car(expr).equals(DEFINT) && _.getDirective(Directive.printMode) === PrintMode.LaTeX) {
        let str = "";
        str += print_DEFINT_latex(expr, _);
        return str;
    } else if (is_inner_or_dot(expr)) {
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            let str = "";
            str += print_DOT_latex(expr, _);
            return str;
        } else if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_DOT_codegen(expr, _);
            return str;
        }
    } else if (car(expr).equals(SIN)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_SIN_codegen(expr, _);
            return str;
        }
    } else if (car(expr).equals(COS)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_COS_codegen(expr, _);
            return str;
        }
    } else if (car(expr).equals(TAN)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_TAN_codegen(expr, _);
            return str;
        }
    } else if (car(expr).equals(ARCSIN)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_ARCSIN_codegen(expr, _);
            return str;
        }
    } else if (car(expr).equals(ARCCOS)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_ARCCOS_codegen(expr, _);
            return str;
        }
    } else if (car(expr).equals(ARCTAN)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_ARCTAN_codegen(expr, _);
            return str;
        }
    } else if (is_cons(expr) && car(expr).equals(SUM)) {
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            let str = "";
            str += print_SUM_latex(expr, _);
            return str;
        } else if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_SUM_codegen(expr, _);
            return str;
        }
        //else if car(p) == symbol(QUOTE)
        //  if printMode == PrintMode.LaTeX
        //    print_expr(cadr(p),$)
        //    return accumulator
    } else if (car(expr).equals(PRODUCT)) {
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            let str = "";
            str += print_PRODUCT_latex(expr, _);
            return str;
        } else if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_PRODUCT_codegen(expr, _);
            return str;
        }
    } else if (is_cons(expr) && car(expr).equals(FOR)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_FOR_codegen(expr, _);
            return str;
        }
    } else if (car(expr).equals(DO)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_DO_codegen(expr, _);
            return str;
        }
    } else if (car(expr).equals(TEST)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_TEST_codegen(expr, _);
            return str;
        }
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            let str = "";
            str += print_TEST_latex(expr, _);
            return str;
        }
    } else if (car(expr).equals(TESTLT)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += "((" + render_using_non_sexpr_print_mode(cadr(expr), _) + ") < (" + render_using_non_sexpr_print_mode(caddr(expr), _) + "))";
            return str;
        }
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            let str = "";
            str += print_TESTLT_latex(expr, _);
            return str;
        }
    } else if (car(expr).equals(TESTLE)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += "((" + render_using_non_sexpr_print_mode(cadr(expr), _) + ") <= (" + render_using_non_sexpr_print_mode(caddr(expr), _) + "))";
            return str;
        }
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            let str = "";
            str += print_TESTLE_latex(expr, _);
            return str;
        }
    } else if (car(expr).equals(TESTGT)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += "((" + render_using_non_sexpr_print_mode(cadr(expr), _) + ") > (" + render_using_non_sexpr_print_mode(caddr(expr), _) + "))";
            return str;
        }
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            let str = "";
            str += print_TESTGT_latex(expr, _);
            return str;
        }
    } else if (car(expr).equals(TESTGE)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += "((" + render_using_non_sexpr_print_mode(cadr(expr), _) + ") >= (" + render_using_non_sexpr_print_mode(caddr(expr), _) + "))";
            return str;
        }
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            let str = "";
            str += print_TESTGE_latex(expr, _);
            return str;
        }
    } else if (is_cons(expr) && expr.opr.equals(TESTEQ)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += "((" + render_using_non_sexpr_print_mode(cadr(expr), _) + ") === (" + render_using_non_sexpr_print_mode(caddr(expr), _) + "))";
            return str;
        }
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            let str = "";
            str += print_testeq_latex(expr, _);
            return str;
        }
    } else if (car(expr).equals(FLOOR)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += "Math.floor(" + render_using_non_sexpr_print_mode(cadr(expr), _) + "),$";
            return str;
        }
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            let str = "";
            str += " \\lfloor {" + render_using_non_sexpr_print_mode(cadr(expr), _) + "} \\rfloor ,$";
            return str;
        }
    } else if (car(expr).equals(CEILING)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += "Math.ceiling(" + render_using_non_sexpr_print_mode(cadr(expr), _) + "),$";
            return str;
        }
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            let str = "";
            str += " \\lceil {" + render_using_non_sexpr_print_mode(cadr(expr), _) + "} \\rceil ,$";
            return str;
        }
    } else if (car(expr).equals(ROUND)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += "Math.round(" + render_using_non_sexpr_print_mode(cadr(expr), _) + "),$";
            return str;
        }
    } else if (car(expr).equals(ASSIGN)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            let str = "";
            str += print_SETQ_codegen(expr, _);
            return str;
        } else {
            let str = "";
            str += render_using_non_sexpr_print_mode(cadr(expr), _);
            str += print_str("=");
            str += render_using_non_sexpr_print_mode(caddr(expr), _);
            return str;
        }
    }
    return print_factor_fallback(expr, omtPrns, _);
}

function print_factor_fallback(expr: U, omtPrns: boolean, _: PrintConfig) {
    if (is_cons(expr)) {
        let str = "";
        str += print_factor(expr.car, false, false, _);
        expr = expr.cdr;
        if (expr.isnil) {
            return str;
        } else {
            if (!omtPrns) {
                str += print_str("(");
            }
            if (is_cons(expr)) {
                str += render_using_non_sexpr_print_mode(car(expr), _);
                expr = cdr(expr);
                while (is_cons(expr)) {
                    str += print_str(",");
                    str += render_using_non_sexpr_print_mode(car(expr), _);
                    expr = cdr(expr);
                }
            }
            if (!omtPrns) {
                str += print_str(")");
            }
            return str;
        }
    } else if (is_atom(expr)) {
        if (is_err(expr)) {
            // Ignore
        } else if (is_localizable(expr)) {
            // const handler = _.handlerFor(expr);
            // Ignore
        } else {
            throw new ProgrammingError(`${expr}`);
        }
    }

    if (is_uom(expr)) {
        let str = "";
        str += expr.toString();
        return str;
    }

    if (is_blade(expr)) {
        let str = "";
        str += expr.toString();
        return str;
    }

    if (is_sym(expr) && is_native(expr, Native.derivative)) {
        return print_char("d");
    } else if (is_base_of_natural_logarithm(expr)) {
        if (_.getDirective(Directive.printMode) === PrintMode.EcmaScript) {
            return print_str("Math.E");
        } else {
            if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
                return print_str("e");
            } else {
                return print_str(_.getSymbolPrintName(MATH_E));
            }
        }
    } else if (is_pi(expr)) {
        if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
            return print_str("\\pi");
        } else {
            return print_str(_.getSymbolPrintName(MATH_PI));
        }
    } else {
        if (is_sym(expr)) {
            const handler = _.handlerFor(expr);
            if (_.getDirective(Directive.printMode) === PrintMode.Infix) {
                // FIXME: casting
                return nativeStr(handler.dispatch(expr, native_sym(Native.infix), nil, _ as unknown as ExprContext));
            }
            if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
                // FIXME: casting
                return nativeStr(handler.dispatch(expr, native_sym(Native.latex), nil, _ as unknown as ExprContext));
            }
            return expr.key();
        }
        if (is_hyp(expr)) {
            return expr.printname;
        }
        if (is_keyword(expr)) {
            const handler = _.handlerFor(expr);
            if (_.getDirective(Directive.printMode) === PrintMode.Infix) {
                // FIXME: casting
                return nativeStr(handler.dispatch(expr, native_sym(Native.infix), nil, _ as unknown as ExprContext));
            }
            if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
                // FIXME: casting
                return nativeStr(handler.dispatch(expr, native_sym(Native.latex), nil, _ as unknown as ExprContext));
            }
            return expr.key();
        }
        if (is_err(expr)) {
            const handler = _.handlerFor(expr);
            return nativeStr(handler.dispatch(expr, native_sym(Native.infix), nil, _ as unknown as ExprContext));
        }
        if (is_imu(expr)) {
            if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
                return print_str("i");
            } else {
                return print_str(_.getSymbolPrintName(MATH_IMU));
            }
        }
        if (is_atom(expr)) {
            // A user-defined atom
            switch (_.getDirective(Directive.printMode)) {
                case PrintMode.Ascii:
                case PrintMode.Human:
                case PrintMode.Infix:
                case PrintMode.LaTeX:
                case PrintMode.SExpr:
                default: {
                    throw new ProgrammingError(`${expr}: ${expr.type}`);
                }
            }
        }
        if (expr.isnil) {
            return print_str(_.getSymbolPrintName(native_sym(Native.NIL)));
        }
        throw new ProgrammingError(`${expr} ???`);
    }
}

function print_multiply_sign(_: PrintConfig): string {
    if (_.getDirective(Directive.printMode) === PrintMode.LaTeX) {
        return "";
    }

    if (_.getDirective(Directive.printMode) === PrintMode.Human) {
        return print_str(" ");
    } else {
        return print_str("*");
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function is_denominator(expr: U): boolean {
    if (is_cons(expr)) {
        if (is_power(expr)) {
            const argList = expr.cdr;
            if (is_cons(argList)) {
                const base = argList.car;
                if (!is_base_of_natural_logarithm(base)) {
                    const cdr_argList = argList.cdr;
                    if (is_cons(cdr_argList)) {
                        const exponent = cdr_argList.car;
                        return is_negative(exponent);
                    }
                }
            }
        }
    }
    return false;
}

// don't consider the leading fraction
// we want 2/3*a*b*c instead of 2*a*b*c/3
function any_denominators(expr: Cons): boolean {
    let p = expr.cdr;
    while (is_cons(p)) {
        const q = p.car;
        if (is_denominator(q)) {
            return true;
        }
        p = p.cdr;
    }
    return false;
}
