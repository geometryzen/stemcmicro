import { mp_denominator, mp_numerator } from '../bignum';
import { scan } from '../brite/scan';
import { lt_num_num } from '../calculators/compare/lt_num_num';
import { Directive, ExtensionEnv } from '../env/ExtensionEnv';
import { equaln, isfraction, isNumberOneOverSomething, is_num_and_equal_one_half, is_num_and_eq_minus_one, is_num_and_eq_two } from '../is';
import { Native } from '../native/Native';
import { native_sym } from '../native/native_sym';
import { abs } from '../operators/abs/abs';
import { is_boo } from '../operators/boo/is_boo';
import { denominator } from '../operators/denominator/denominator';
import { MATH_DERIVATIVE } from '../operators/derivative/MATH_DERIVATIVE';
import { is_err } from '../operators/err/is_err';
import { is_flt } from '../operators/flt/is_flt';
import { is_hyp } from '../operators/hyp/is_hyp';
import { is_imu } from '../operators/imu/is_imu';
import { is_num } from '../operators/num/is_num';
import { numerator } from '../operators/numerator/numerator';
import { is_pi } from '../operators/pi/is_pi';
import { is_rat } from '../operators/rat/is_rat';
import { is_str } from '../operators/str/is_str';
import { is_sym } from '../operators/sym/is_sym';
import { is_tensor } from '../operators/tensor/is_tensor';
import { is_uom } from '../operators/uom/is_uom';
import { is_base_of_natural_logarithm } from '../predicates/is_base_of_natural_logarithm';
import { is_negative } from '../predicates/is_negative';
import { is_negative_number } from '../predicates/is_negative_number';
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
    FOR,
    FUNCTION,
    LAST_ASCII_PRINT, LAST_HUMAN_PRINT, LAST_INFIX_PRINT, LAST_LATEX_PRINT,
    LAST_SEXPR_PRINT,
    MULTIPLY,
    PATTERN, POWER,
    PRINT_LEAVE_E_ALONE,
    PRINT_LEAVE_X_ALONE,
    PRODUCT,
    ROUND,
    SIN,
    SQRT,
    SUM,
    SYM_MATH_COMPONENT,
    TAN,
    TEST,
    TESTGE,
    TESTGT,
    TESTLE,
    TESTLT,
    UNIT
} from '../runtime/constants';
import { defs, PrintMode, PRINTMODE_ASCII, PRINTMODE_HUMAN, PRINTMODE_INFIX, PRINTMODE_LATEX, PRINTMODE_SEXPR } from '../runtime/defs';
import { is_abs, is_add, is_factorial, is_inner_or_dot, is_lco, is_multiply, is_opr_eq_inv, is_outer, is_power, is_rco, is_transpose } from '../runtime/helpers';
import { RESERVED_KEYWORD_LAST } from '../runtime/ns_script';
import { booT } from '../tree/boo/Boo';
import { caadr, caar, caddddr, cadddr, caddr, cadr, cddr } from '../tree/helpers';
import { negOne, one, Rat, zero } from '../tree/rat/Rat';
import { assert_str } from '../tree/str/assert_str';
import { create_sym, Sym } from '../tree/sym/Sym';
import { Tensor } from '../tree/tensor/Tensor';
import { car, cdr, Cons, is_cons, is_nil, nil, U } from '../tree/tree';
import { is_blade } from '../tree/vec/Algebra';
import { print_number } from './print_number';
import { render_as_ascii } from './render_as_ascii';
import { render_as_sexpr } from './render_as_sexpr';

const ENGLISH_UNDEFINED = 'undefined';

const MATH_E = native_sym(Native.E);
const MATH_IMU = native_sym(Native.IMU);
const MATH_PI = native_sym(Native.PI);
const testeq = native_sym(Native.test_eq);

export function get_script_last($: ExtensionEnv): U {
    return $.valueOf(RESERVED_KEYWORD_LAST);
}

export function get_last_print_mode_symbol(printMode: PrintMode): Sym {
    switch (printMode) {
        case PRINTMODE_ASCII: return LAST_ASCII_PRINT;
        case PRINTMODE_HUMAN: return LAST_HUMAN_PRINT;
        case PRINTMODE_LATEX: return LAST_LATEX_PRINT;
        case PRINTMODE_INFIX: return LAST_INFIX_PRINT;
        case PRINTMODE_SEXPR: return LAST_SEXPR_PRINT;
        default: throw new Error(printMode);
    }
}

/**
 * 
 * @param argList 
 * @param printMode
 */
export function print_in_mode(argList: Cons, printMode: PrintMode, $: ExtensionEnv): string[] {
    const texts: string[] = [];

    let subList: U = argList;
    while (is_cons(subList)) {
        const value = $.valueOf(subList.car);

        const origPrintMode = printMode;
        defs.setPrintMode(printMode);
        try {
            if (printMode === PRINTMODE_INFIX) {
                const str = render_using_non_sexpr_print_mode(value, $);
                texts.push(str);
                store_text_in_binding(str, get_last_print_mode_symbol(printMode), $);
            }
            else if (printMode === PRINTMODE_HUMAN) {
                const str = render_using_non_sexpr_print_mode(value, $);
                texts.push(str);
                store_text_in_binding(str, get_last_print_mode_symbol(printMode), $);
            }
            else if (printMode === PRINTMODE_ASCII) {
                const str = render_as_ascii(value, $);
                texts.push(str);
                store_text_in_binding(str, get_last_print_mode_symbol(printMode), $);
            }
            else if (printMode === PRINTMODE_LATEX) {
                const str = render_using_non_sexpr_print_mode(value, $);
                texts.push(str);
                store_text_in_binding(str, get_last_print_mode_symbol(printMode), $);
            }
            else if (printMode === PRINTMODE_SEXPR) {
                const str = render_as_sexpr(value, $);
                texts.push(str);
                store_text_in_binding(str, get_last_print_mode_symbol(printMode), $);
            }
        }
        finally {
            defs.setPrintMode(origPrintMode);
        }

        subList = subList.argList;
    }

    return texts;
}

/**
 * 
 * @param text The text that will be the binding value.
 * @param sym The symbol that will be used as a key to store the text.
 */
export function store_text_in_binding(text: string, sym: Sym, $: ExtensionEnv): void {
    // TODO: Not clear why we go to the trouble to scan the string when we'll just get a string.
    // It does not seem that reliable anyway given the simplistic escaping of the text.
    // Fails when the text is aleady contains double quotes.
    const sourceText = '"' + text + '"';
    // TOOD: Need a better routing to initialize the ScanOptions.
    const [scanned, tree] = scan(sourceText, {
        useCaretForExponentiation: $.getNativeDirective(Directive.useCaretForExponentiation),
        explicitAssocAdd: false,
        explicitAssocMul: false
    });
    if (scanned === sourceText.length) {
        const str = assert_str(tree);
        $.setSymbolValue(sym, str);
    }
    else {
        // TODO
        // throw new SystemError(`${JSON.stringify(text)}`);
    }
}

export function print_str(s: string): string {
    return s;
}

function print_char(c: string): string {
    return c;
}


function print_base_of_denom(base: U, $: ExtensionEnv): string {
    if (should_group_base_of_denom(base)) {
        return `(${render_using_non_sexpr_print_mode(base, $)})`;
    }
    else {
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

function print_expo_of_denom(expo: U, $: ExtensionEnv): string {
    if (is_rat(expo) && expo.isFraction()) {
        return `(${render_using_non_sexpr_print_mode(expo, $)})`;
    }
    if (is_add(expo) || is_multiply(expo) || is_power(expo)) {
        return `(${render_using_non_sexpr_print_mode(expo, $)})`;
    }
    else {
        return render_using_non_sexpr_print_mode(expo, $);
    }
}

// prints stuff after the divide symbol "/"

// d is the number of denominators
function print_denom(p: U, d: number, $: ExtensionEnv): string {
    let str = '';

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
        str += print_char('(');
    }

    // prepare the exponent
    // (needs to be negated)
    // before printing it out
    EXPO = $.negate(EXPO);
    str += print_power(BASE, EXPO, $);
    if (d === 1) {
        str += print_char(')');
    }
    return str;
}

function print_a_over_b(p: Cons, $: ExtensionEnv): string {
    // console.lg(`print_a_over_b p => ${$.toListString(p)}`);
    let A: U, B: U;
    let str = '';
    let flag = 0;

    // count numerators and denominators
    let n = 0;
    let d = 0;

    let p1: U = p.cdr;
    let p2 = car(p1);

    if (is_rat(p2)) {
        A = abs(mp_numerator(p2), $);
        B = mp_denominator(p2);
        if (!$.isOne(A)) {
            n++;
        }
        if (!$.isOne(B)) {
            d++;
        }
        p1 = cdr(p1);
    }
    else {
        A = one;
        B = one;
    }

    while (is_cons(p1)) {
        p2 = car(p1);
        if (is_denominator(p2, $)) {
            d++;
        }
        else {
            n++;
        }
        p1 = cdr(p1);
    }

    //breakpoint
    if (defs.printMode === PRINTMODE_LATEX) {
        str += print_str('\\frac{');
    }

    if (n === 0) {
        str += print_char('1');
    }
    else {
        flag = 0;
        p1 = cdr(p);
        if (is_rat(car(p1))) {
            p1 = cdr(p1);
        }
        if (!$.isOne(A)) {
            str += print_factor(A, false, false, $);
            flag = 1;
        }
        while (is_cons(p1)) {
            p2 = car(p1);
            if (!is_denominator(p2, $)) {
                if (flag) {
                    str += print_multiply_sign();
                }
                str += print_factor(p2, false, false, $);
                flag = 1;
            }
            p1 = cdr(p1);
        }
    }

    if (defs.printMode === PRINTMODE_LATEX) {
        str += print_str('}{');
    }
    else if (defs.printMode === PRINTMODE_HUMAN && !defs.testFlag) {
        str += print_str(' / ');
    }
    else {
        str += print_str('/');
    }

    if (d > 1 && defs.printMode !== PRINTMODE_LATEX) {
        str += print_char('(');
    }

    flag = 0;
    p1 = cdr(p);

    if (is_rat(car(p1))) {
        p1 = cdr(p1);
    }

    if (!$.isOne(B)) {
        str += print_factor(B, false, false, $);
        flag = 1;
    }

    while (is_cons(p1)) {
        p2 = car(p1);
        if (is_denominator(p2, $)) {
            if (flag) {
                str += print_multiply_sign();
            }
            str += print_denom(p2, d, $);
            flag = 1;
        }
        p1 = cdr(p1);
    }

    if (d > 1 && defs.printMode !== PRINTMODE_LATEX) {
        str += print_char(')');
    }

    if (defs.printMode === PRINTMODE_LATEX) {
        str += print_str('}');
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
export function render_using_non_sexpr_print_mode(expr: U, $: ExtensionEnv): string {
    return print_additive_expr(expr, $);
}

export function print_additive_expr(p: U, $: ExtensionEnv): string {
    // console.lg(`print_additive_expr ${p}`);
    let str = '';
    if (is_add(p)) {
        p = cdr(p);
        if (sign_of_term(car(p)) === '-') {
            str += print_str('-');
        }
        str += print_multiplicative_expr(car(p), $);
        p = cdr(p);
        while (is_cons(p)) {
            if (sign_of_term(car(p)) === '+') {
                if (defs.printMode === PRINTMODE_HUMAN && !defs.testFlag) {
                    str += print_str(' + ');
                }
                else {
                    str += print_str('+');
                }
            }
            else {
                if (defs.printMode === PRINTMODE_HUMAN && !defs.testFlag) {
                    str += print_str(' - ');
                }
                else {
                    str += print_str('-');
                }
            }
            str += print_multiplicative_expr(car(p), $);
            p = cdr(p);
        }
    }
    else {
        if (sign_of_term(p) === '-') {
            str += print_str('-');
        }
        str += print_multiplicative_expr(p, $);
    }
    return str;
}

/**
 * Returns '-' if term is a number less that zero, or if term has the form (* num ...) and num is less than zero.
 * For this to work correctly, it assumes that the term is in canonical form (with numbers move to the left).
 */
export function sign_of_term(term: U): '+' | '-' {
    // (* num ...) and num is less than zero.
    if (is_cons(term)) {
        if (is_multiply(term)) {
            const cadr_p = car(term.cdr);
            if (is_num(cadr_p)) {
                if (lt_num_num(cadr_p, zero)) {
                    return '-';
                }
            }
        }
    }

    //  term itslef is a number less tahn zero.
    if (is_num(term) && lt_num_num(term, zero)) {
        return '-';
    }
    else {
        return '+';
    }
}

function print_multiply_when_no_denominators(expr: Cons, $: ExtensionEnv) {
    let denom = '';
    let origAccumulator = '';
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
    if (
        defs.printMode === PRINTMODE_LATEX &&
        is_cons(cdr(p)) &&
        isNumberOneOverSomething(car(p))
    ) {
        numberOneOverSomething = true;
        denom = (car(p) as Rat).b.toString();
    }

    let str = '';
    if (numberOneOverSomething) {
        origAccumulator = str;
        str = '';
    }
    else {
        str += print_outer_expr(car(p), false, false, $);
    }

    p = cdr(p);

    // print all the other factors -------
    while (is_cons(p)) {
        // check if we end up having a case where two numbers
        // are next to each other. In those cases, latex needs
        // to insert a \cdot otherwise they end up
        // right next to each other and read like one big number
        if (defs.printMode === PRINTMODE_LATEX) {
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
                        if (!isfraction(car(cdr(cdr(car(p)))))) {
                            str += ' \\cdot ';
                        }
                    }
                }
            }
        }
        str += print_multiply_sign();
        str += print_outer_expr(car(p), false, true, $);

        previousFactorWasANumber = false;
        if (is_num(car(p))) {
            previousFactorWasANumber = true;
        }

        p = cdr(p);
    }

    if (numberOneOverSomething) {
        str = origAccumulator + '\\frac{' + str + '}{' + denom + '}';
    }
    return str;
}

export function print_multiplicative_expr(expr: U, $: ExtensionEnv): string {
    // console.lg(`print_multiplicative_expr ${expr}`);
    if (is_cons(expr) && is_multiply(expr)) {
        if (any_denominators(expr, $)) {
            return print_a_over_b(expr, $);
        }
        return print_multiply_when_no_denominators(expr, $);
    }
    else {
        return print_outer_expr(expr, false, false, $);
    }
}

export function print_outer_expr(expr: U, omitParens: boolean, pastFirstFactor: boolean, $: ExtensionEnv): string {
    // console.lg(`print_outer_expr ${expr}`);
    if (is_cons(expr) && is_outer(expr)) {
        let argList = expr.argList;
        if (is_cons(argList)) {
            let str = print_inner_expr(argList.car, false, false, $);
            argList = argList.cdr;
            while (is_cons(argList)) {
                str += print_outer_operator();
                str += print_inner_expr(car(argList), false, true, $);
                argList = argList.cdr;
            }
            return str;
        }
        else {
            throw new Error();
        }
    }
    else {
        return print_inner_expr(expr, omitParens, pastFirstFactor, $);
    }
}

function print_outer_operator(): string {
    if (defs.printMode === PRINTMODE_LATEX) {
        return ' \\wedge ';
    }

    if (defs.printMode === PRINTMODE_HUMAN && !defs.testFlag && !defs.codeGen) {
        return print_str(' ^ ');
    }
    else {
        return print_str('^');
    }
}

export function print_inner_expr(expr: U, omitParens: boolean, pastFirstFactor: boolean, $: ExtensionEnv): string {
    // console.lg(`print_inner_expr ${expr}`);
    if (is_cons(expr) && is_inner_or_dot(expr)) {
        let argList = expr.argList;
        if (is_cons(argList)) {
            let str = print_factor(argList.car, false, false, $);
            argList = argList.cdr;
            while (is_cons(argList)) {
                str += print_inner_operator();
                str += print_factor(car(argList), false, true, $);
                argList = argList.cdr;
            }
            return str;
        }
        else {
            throw new Error();
        }
    }
    else if (is_cons(expr) && is_lco(expr)) {
        let argList = expr.argList;
        if (is_cons(argList)) {
            let str = print_factor(argList.car, false, false, $);
            argList = argList.cdr;
            while (is_cons(argList)) {
                str += print_lco_operator();
                str += print_factor(car(argList), false, true, $);
                argList = argList.cdr;
            }
            return str;
        }
        else {
            throw new Error();
        }
    }
    else if (is_cons(expr) && is_rco(expr)) {
        let argList = expr.argList;
        if (is_cons(argList)) {
            let str = print_factor(argList.car, false, false, $);
            argList = argList.cdr;
            while (is_cons(argList)) {
                str += print_rco_operator();
                str += print_factor(car(argList), false, true, $);
                argList = argList.cdr;
            }
            return str;
        }
        else {
            throw new Error();
        }
    }
    else {
        return print_factor(expr, omitParens, pastFirstFactor, $);
    }
}

function print_inner_operator(): string {
    if (defs.printMode === PRINTMODE_LATEX) {
        return ' \\mid ';
    }

    if (defs.printMode === PRINTMODE_HUMAN && !defs.testFlag && !defs.codeGen) {
        return print_str(' | ');
    }
    else {
        return print_str('|');
    }
}

function print_lco_operator(): string {
    if (defs.printMode === PRINTMODE_LATEX) {
        return ' \\ll ';
    }

    if (defs.printMode === PRINTMODE_HUMAN && !defs.testFlag && !defs.codeGen) {
        return print_str(' << ');
    }
    else {
        return print_str('<<');
    }
}

function print_rco_operator(): string {
    if (defs.printMode === PRINTMODE_LATEX) {
        return ' \\gg ';
    }

    if (defs.printMode === PRINTMODE_HUMAN && !defs.testFlag && !defs.codeGen) {
        return print_str(' >> ');
    }
    else {
        return print_str('>>');
    }
}

function print_grouping_expr(expr: U, $: ExtensionEnv): string {
    // console.lg(`print_grouping_expr ${expr}`);
    let str = '';
    str += print_char('(');
    str += render_using_non_sexpr_print_mode(expr, $);
    str += print_char(')');
    return str;
}

function print_factorial_function(p: U, $: ExtensionEnv): string {
    let accumulator = '';
    p = cadr(p);
    if (
        isfraction(p) ||
        is_add(p) ||
        is_multiply(p) ||
        is_power(p) ||
        is_factorial(p)
    ) {
        accumulator += print_grouping_expr(p, $);
    }
    else {
        accumulator += render_using_non_sexpr_print_mode(p, $);
    }
    accumulator += print_char('!');
    return accumulator;
}

function print_abs_latex(expr: Cons, $: ExtensionEnv): string {
    const arg = expr.argList.head;
    let s = '';
    s += print_str('\\left |');
    s += render_using_non_sexpr_print_mode(arg, $);
    s += print_str(' \\right |');
    return s;
}

function print_abs_infix(expr: Cons, $: ExtensionEnv): string {
    const arg = expr.argList.head;
    let s = '';
    s += print_str('abs(');
    s += render_using_non_sexpr_print_mode(arg, $);
    s += print_str(')');
    return s;
}

function print_BINOMIAL_latex(p: U, $: ExtensionEnv): string {
    let accumulator = '';
    accumulator += print_str('\\binom{');
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += print_str('}{');
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    accumulator += print_str('} ');
    return accumulator;
}

function print_DOT_latex(p: U, $: ExtensionEnv): string {
    let accumulator = '';
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += print_str(' \\cdot ');
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    return accumulator;
}

function print_DOT_codegen(p: U, $: ExtensionEnv): string {
    let accumulator = 'dot(';
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += ', ';
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    accumulator += ')';
    return accumulator;
}

function print_SIN_codegen(p: U, $: ExtensionEnv): string {
    let accumulator = 'Math.sin(';
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += ')';
    return accumulator;
}

function print_COS_codegen(p: U, $: ExtensionEnv): string {
    let accumulator = 'Math.cos(';
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += ')';
    return accumulator;
}

function print_TAN_codegen(p: U, $: ExtensionEnv): string {
    let accumulator = 'Math.tan(';
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += ')';
    return accumulator;
}

function print_ARCSIN_codegen(p: U, $: ExtensionEnv): string {
    let accumulator = 'Math.asin(';
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += ')';
    return accumulator;
}

function print_ARCCOS_codegen(p: U, $: ExtensionEnv): string {
    let accumulator = 'Math.acos(';
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += ')';
    return accumulator;
}

function print_ARCTAN_codegen(p: U, $: ExtensionEnv): string {
    let accumulator = 'Math.atan(';
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += ')';
    return accumulator;
}

function print_SQRT_latex(p: U, $: ExtensionEnv): string {
    let accumulator = '';
    accumulator += print_str('\\sqrt{');
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += print_str('} ');
    return accumulator;
}

function print_TRANSPOSE_latex(p: U, $: ExtensionEnv): string {
    let accumulator = '';
    accumulator += print_str('{');
    if (is_cons(cadr(p))) {
        accumulator += print_str('(');
    }
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    if (is_cons(cadr(p))) {
        accumulator += print_str(')');
    }
    accumulator += print_str('}');
    accumulator += print_str('^T');
    return accumulator;
}

function print_TRANSPOSE_codegen(p: U, $: ExtensionEnv): string {
    let accumulator = '';
    accumulator += print_str('transpose(');
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += print_str(')');
    return accumulator;
}

function print_UNIT_codegen(p: U, $: ExtensionEnv): string {
    let accumulator = '';
    accumulator += print_str('identity(');
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += print_str(')');
    return accumulator;
}

function print_INV_latex(p: Cons, $: ExtensionEnv): string {
    let str = '';
    str += print_str('{');
    if (is_cons(cadr(p))) {
        str += print_str('(');
    }
    str += render_using_non_sexpr_print_mode(cadr(p), $);
    if (is_cons(cadr(p))) {
        str += print_str(')');
    }
    str += print_str('}');
    str += print_str('^{-1}');
    return str;
}

function print_INV_codegen(p: U, $: ExtensionEnv): string {
    let accumulator = '';
    accumulator += print_str('inv(');
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += print_str(')');
    return accumulator;
}

function print_DEFINT_latex(p: U, $: ExtensionEnv): string {
    let accumulator = '';
    const functionBody = car(cdr(p));

    p = cdr(p);
    const originalIntegral = p;
    let numberOfIntegrals = 0;

    while (is_cons(cdr(cdr(p)))) {
        numberOfIntegrals++;
        const theIntegral = cdr(cdr(p));

        accumulator += print_str('\\int^{');
        accumulator += render_using_non_sexpr_print_mode(car(cdr(theIntegral)), $);
        accumulator += print_str('}_{');
        accumulator += render_using_non_sexpr_print_mode(car(theIntegral), $);
        accumulator += print_str('} \\! ');
        p = cdr(theIntegral);
    }

    accumulator += render_using_non_sexpr_print_mode(functionBody, $);
    accumulator += print_str(' \\,');

    p = originalIntegral;

    for (let i = 1; i <= numberOfIntegrals; i++) {
        const theVariable = cdr(p);
        accumulator += print_str(' \\mathrm{d} ');
        accumulator += render_using_non_sexpr_print_mode(car(theVariable), $);
        if (i < numberOfIntegrals) {
            accumulator += print_str(' \\, ');
        }
        p = cdr(cdr(theVariable));
    }
    return accumulator;
}

function print_tensor(p: Tensor<U>, $: ExtensionEnv): string {
    let accumulator = '';
    accumulator += print_tensor_inner(p, 0, 0, $)[1];
    return accumulator;
}

// j scans the dimensions
// k is an increment for all the printed elements
//   since they are all together in sequence in one array
function print_tensor_inner(p: Tensor<U>, j: number, k: number, $: ExtensionEnv): [number, string] {
    let accumulator = '';

    accumulator += print_str('[');

    // only the last dimension prints the actual elements
    // e.g. in a matrix, the first dimension contains
    // vectors, not elements, and the second dimension
    // actually contains the elements

    // if not the last dimension, we are just printing wrappers
    // and recursing down i.e. we print the next dimension
    if (j < p.ndim - 1) {
        for (let i = 0; i < p.dim(j); i++) {
            let retString: string;
            [k, retString] = Array.from(print_tensor_inner(p, j + 1, k, $)) as [
                number,
                string
            ];
            accumulator += retString;
            // add separator between elements dimensions
            // "above" the inner-most dimension
            if (i !== p.dim(j) - 1) {
                accumulator += print_str(',');
            }
        }
        // if we reached the last dimension, we print the actual
        // elements
    }
    else {
        for (let i = 0; i < p.dim(j); i++) {
            accumulator += render_using_non_sexpr_print_mode(p.elem(k), $);
            // add separator between elements in the
            // inner-most dimension
            if (i !== p.dim(j) - 1) {
                accumulator += print_str(',');
            }
            k++;
        }
    }

    accumulator += print_str(']');
    return [k, accumulator];
}

function print_tensor_latex(p: Tensor<U>, $: ExtensionEnv): string {
    let accumulator = '';
    if (p.ndim <= 2) {
        accumulator += print_tensor_inner_latex(true, p, 0, 0, $)[1];
    }
    return accumulator;
}

// firstLevel is needed because printing a matrix
// is not exactly an elegant recursive procedure:
// the vector on the first level prints the latex
// "wrap", while the vectors that make up the
// rows don't. so it's a bit asymmetric and this
// flag helps.
// j scans the dimensions
// k is an increment for all the printed elements
//   since they are all together in sequence in one array
function print_tensor_inner_latex(firstLevel: boolean, p: Tensor<U>, j: number, k: number, $: ExtensionEnv): [number, string] {
    let accumulator = '';

    // open the outer latex wrap
    if (firstLevel) {
        accumulator += '\\begin{bmatrix} ';
    }

    // only the last dimension prints the actual elements
    // e.g. in a matrix, the first dimension contains
    // vectors, not elements, and the second dimension
    // actually contains the elements

    // if not the last dimension, we are just printing wrappers
    // and recursing down i.e. we print the next dimension
    if (j < p.ndim - 1) {
        for (let i = 0; i < p.dim(j); i++) {
            let retString: string;
            [k, retString] = Array.from(
                print_tensor_inner_latex(false, p, j + 1, k, $)
            ) as [number, string];
            accumulator += retString;
            if (i !== p.dim(j) - 1) {
                // add separator between rows
                accumulator += print_str(' \\\\ ');
            }
        }
        // if we reached the last dimension, we print the actual
        // elements
    }
    else {
        for (let i = 0; i < p.dim(j); i++) {
            accumulator += render_using_non_sexpr_print_mode(p.elem(k), $);
            // separator between elements in each row
            if (i !== p.dim(j) - 1) {
                accumulator += print_str(' & ');
            }
            k++;
        }
    }

    // close the outer latex wrap
    if (firstLevel) {
        accumulator += ' \\end{bmatrix}';
    }

    return [k, accumulator];
}

function print_SUM_latex(p: U, $: ExtensionEnv): string {
    let accumulator = '\\sum_{';
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    accumulator += '=';
    accumulator += render_using_non_sexpr_print_mode(cadddr(p), $);
    accumulator += '}^{';
    accumulator += render_using_non_sexpr_print_mode(caddddr(p), $);
    accumulator += '}{';
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += '}';
    return accumulator;
}

function print_SUM_codegen(p: U, $: ExtensionEnv): string {
    const body = cadr(p);
    const variable = caddr(p);
    const lowerlimit = cadddr(p);
    const upperlimit = caddddr(p);

    const accumulator =
        '(function(){' +
        ' var ' +
        render_using_non_sexpr_print_mode(variable, $) +
        '; ' +
        ' var holderSum = 0; ' +
        ' var lowerlimit = ' +
        render_using_non_sexpr_print_mode(lowerlimit, $) +
        '; ' +
        ' var upperlimit = ' +
        render_using_non_sexpr_print_mode(upperlimit, $) +
        '; ' +
        ' for (' +
        render_using_non_sexpr_print_mode(variable, $) +
        ' = lowerlimit; ' +
        render_using_non_sexpr_print_mode(variable, $) +
        ' < upperlimit; ' +
        render_using_non_sexpr_print_mode(variable, $) +
        '++) { ' +
        '   holderSum += ' +
        render_using_non_sexpr_print_mode(body, $) +
        ';' +
        ' } ' +
        ' return holderSum;' +
        '})()';

    return accumulator;
}

function print_TEST_latex(p: U, $: ExtensionEnv): string {
    let accumulator = '\\left\\{ \\begin{array}{ll}';

    p = cdr(p);
    while (is_cons(p)) {
        // odd number of parameters means that the
        // last argument becomes the default case
        // i.e. the one without a test.
        if (nil === cdr(p)) {
            accumulator += '{';
            accumulator += render_using_non_sexpr_print_mode(car(p), $);
            accumulator += '} & otherwise ';
            accumulator += ' \\\\\\\\';
            break;
        }

        accumulator += '{';
        accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
        accumulator += '} & if & ';
        accumulator += render_using_non_sexpr_print_mode(car(p), $);
        accumulator += ' \\\\\\\\';

        // test unsuccessful, continue to the
        // next pair of test,value
        p = cddr(p);
    }
    accumulator = accumulator.substring(0, accumulator.length - 4);
    return (accumulator += '\\end{array} \\right.');
}

function print_TEST_codegen(p: U, $: ExtensionEnv): string {
    let accumulator = '(function(){';

    p = cdr(p);
    let howManyIfs = 0;
    while (is_cons(p)) {
        // odd number of parameters means that the
        // last argument becomes the default case
        // i.e. the one without a test.
        if (nil === cdr(p)) {
            accumulator += 'else {';
            accumulator += 'return (' + render_using_non_sexpr_print_mode(car(p), $) + ');,$';
            accumulator += '}';
            break;
        }

        if (howManyIfs) {
            accumulator += ' else ';
        }

        accumulator += 'if (' + render_using_non_sexpr_print_mode(car(p), $) + '){,$';
        accumulator += 'return (' + render_using_non_sexpr_print_mode(cadr(p), $) + ');,$';
        accumulator += '}';

        // test unsuccessful, continue to the
        // next pair of test,value
        howManyIfs++;
        p = cddr(p);
    }

    accumulator += '})()';

    return accumulator;
}

function print_TESTLT_latex(p: U, $: ExtensionEnv): string {
    let accumulator = '{';
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += '}';
    accumulator += ' < ';
    accumulator += '{';
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    return (accumulator += '}');
}

function print_TESTLE_latex(p: U, $: ExtensionEnv): string {
    let accumulator = '{';
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += '}';
    accumulator += ' \\leq ';
    accumulator += '{';
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    return (accumulator += '}');
}

function print_TESTGT_latex(p: U, $: ExtensionEnv): string {
    let accumulator = '{';
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += '}';
    accumulator += ' > ';
    accumulator += '{';
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    return (accumulator += '}');
}

function print_TESTGE_latex(p: U, $: ExtensionEnv): string {
    let accumulator = '{';
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += '}';
    accumulator += ' \\geq ';
    accumulator += '{';
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    return (accumulator += '}');
}

function print_testeq_latex(expr: Cons, $: ExtensionEnv): string {
    let s = '{';
    s += render_using_non_sexpr_print_mode(expr.lhs, $);
    s += '}';
    s += ' = ';
    s += '{';
    s += render_using_non_sexpr_print_mode(expr.rhs, $);
    return (s += '}');
}

function print_FOR_codegen(p: U, $: ExtensionEnv): string {
    const body = cadr(p);
    const variable = caddr(p);
    const lowerlimit = cadddr(p);
    const upperlimit = caddddr(p);

    const accumulator =
        '(function(){' +
        ' var ' +
        variable +
        '; ' +
        ' var lowerlimit = ' +
        render_using_non_sexpr_print_mode(lowerlimit, $) +
        '; ' +
        ' var upperlimit = ' +
        render_using_non_sexpr_print_mode(upperlimit, $) +
        '; ' +
        ' for (' +
        variable +
        ' = lowerlimit; ' +
        variable +
        ' < upperlimit; ' +
        variable +
        '++) { ' +
        '   ' +
        render_using_non_sexpr_print_mode(body, $) +
        ' } ' +
        '})()';

    return accumulator;
}

function print_DO_codegen(p: U, $: ExtensionEnv): string {
    let accumulator = '';

    p = cdr(p);
    while (is_cons(p)) {
        accumulator += render_using_non_sexpr_print_mode(car(p), $);
        p = cdr(p);
    }

    return accumulator;
}

function print_SETQ_codegen(p: U, $: ExtensionEnv): string {
    let accumulator = '';
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += ' = ';
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    accumulator += '; ';
    return accumulator;
}

function print_PRODUCT_latex(p: U, $: ExtensionEnv): string {
    let accumulator = '\\prod_{';
    accumulator += render_using_non_sexpr_print_mode(caddr(p), $);
    accumulator += '=';
    accumulator += render_using_non_sexpr_print_mode(cadddr(p), $);
    accumulator += '}^{';
    accumulator += render_using_non_sexpr_print_mode(caddddr(p), $);
    accumulator += '}{';
    accumulator += render_using_non_sexpr_print_mode(cadr(p), $);
    accumulator += '}';
    return accumulator;
}

function print_PRODUCT_codegen(p: U, $: ExtensionEnv): string {
    const body = cadr(p);
    const variable = caddr(p);
    const lowerlimit = cadddr(p);
    const upperlimit = caddddr(p);

    const accumulator =
        '(function(){' +
        ' var ' +
        render_using_non_sexpr_print_mode(variable, $) +
        '; ' +
        ' var holderProduct = 1; ' +
        ' var lowerlimit = ' +
        render_using_non_sexpr_print_mode(lowerlimit, $) +
        '; ' +
        ' var upperlimit = ' +
        render_using_non_sexpr_print_mode(upperlimit, $) +
        '; ' +
        ' for (' +
        render_using_non_sexpr_print_mode(variable, $) +
        ' = lowerlimit; ' +
        render_using_non_sexpr_print_mode(variable, $) +
        ' < upperlimit; ' +
        render_using_non_sexpr_print_mode(variable, $) +
        '++) { ' +
        '   holderProduct *= ' +
        render_using_non_sexpr_print_mode(body, $) +
        ';' +
        ' } ' +
        ' return holderProduct;' +
        '})()';

    return accumulator;
}

function should_tweak_exponent_syntax(base: U, $: ExtensionEnv): boolean {
    if (is_sym(base)) {
        if (base.equals(create_sym('x'))) {
            const sym = PRINT_LEAVE_X_ALONE;
            const binding = $.getSymbolValue(sym);
            if (sym === binding) {
                // There is no override, therefore tweak!
                return true;
            }
            else {
                return !equaln(binding, 1);
            }
        }
        else {
            // base symbols that don't have the printname 'x' can have their power expressions tweaked. 
            return true;
        }
    }
    else {
        // e.g. (expt 5 -1) can be written as 1/5
        return true;
    }
}

function print_power(base: U, expo: U, $: ExtensionEnv) {
    // console.lg(`print_power base = ${base} expo = ${expo}`);

    let str = '';

    // quick check this is actually a square root.
    if (is_num_and_equal_one_half(expo)) {
        if (equaln(base, 2)) {
            if (defs.codeGen) {
                str += print_str('Math.SQRT2');
                return str;
            }
        }
        else {
            if (defs.printMode === PRINTMODE_LATEX) {
                str += print_str('\\sqrt{');
                str += render_using_non_sexpr_print_mode(base, $);
                str += print_str('}');
                return str;
            }
            else if (defs.codeGen) {
                str += print_str('Math.sqrt(');
                str += render_using_non_sexpr_print_mode(base, $);
                str += print_str(')');
                return str;
            }
        }
    }

    if (equaln($.getSymbolValue(PRINT_LEAVE_E_ALONE), 1) && is_base_of_natural_logarithm(base)) {
        if (defs.codeGen) {
            str += print_str('Math.exp(');
            str += print_expo_of_denom(expo, $);
            str += print_str(')');
            return str;
        }

        if (defs.printMode === PRINTMODE_LATEX) {
            str += print_str('e^{');
            str += render_using_non_sexpr_print_mode(expo, $);
            str += print_str('}');
        }
        else {
            str += print_str('exp(');
            str += render_using_non_sexpr_print_mode(expo, $);
            str += print_str(')');
        }
        return str;
    }

    if (defs.codeGen) {
        str += print_str('Math.pow(');
        str += print_base_of_denom(base, $);
        str += print_str(', ');
        str += print_expo_of_denom(expo, $);
        str += print_str(')');
        return str;
    }

    if (should_tweak_exponent_syntax(base, $)) {
        // if the exponent is negative then
        // we invert the base BUT we don't do
        // that if the base is "e", because for
        // example when trigonometric functions are
        // expressed in terms of exponential functions
        // that would be really confusing, one wants to
        // keep "e" as the base and the negative exponent
        if (!is_base_of_natural_logarithm(base)) {
            if (is_num(expo) && expo.isMinusOne()) {
                if (defs.printMode === PRINTMODE_LATEX) {
                    str += print_str('\\frac{1}{');
                }
                else if (defs.printMode === PRINTMODE_HUMAN && !defs.testFlag) {
                    str += print_str('1 / ');
                }
                else {
                    str += print_str('1/');
                }

                if (is_cons(base) && defs.printMode !== PRINTMODE_LATEX) {
                    str += print_str('(');
                    str += render_using_non_sexpr_print_mode(base, $);
                    str += print_str(')');
                }
                else {
                    str += render_using_non_sexpr_print_mode(base, $);
                }

                if (defs.printMode === PRINTMODE_LATEX) {
                    str += print_str('}');
                }

                return str;
            }

            if (is_negative(expo)) {
                if (defs.printMode === PRINTMODE_LATEX) {
                    str += print_str('\\frac{1}{');
                }
                else if (defs.printMode === PRINTMODE_HUMAN && !defs.testFlag) {
                    str += print_str('1 / ');
                }
                else {
                    str += print_str('1/');
                }

                const newExponent = $.multiply(expo, negOne);

                if (is_cons(base) && defs.printMode !== PRINTMODE_LATEX) {
                    str += print_str('(');
                    str += print_power(base, newExponent, $);
                    str += print_str(')');
                }
                else {
                    str += print_power(base, newExponent, $);
                }

                if (defs.printMode === PRINTMODE_LATEX) {
                    str += print_str('}');
                }

                return str;
            }
        }

        if (isfraction(expo) && defs.printMode === PRINTMODE_LATEX) {
            str += print_str('\\sqrt');
            const denomExponent = denominator(expo, $);
            // we omit the "2" on the radical
            if (!is_num_and_eq_two(denomExponent)) {
                str += print_str('[');
                str += render_using_non_sexpr_print_mode(denomExponent, $);
                str += print_str(']');
            }
            str += print_str('{');
            expo = numerator(expo, $);
            str += print_power(base, expo, $);
            str += print_str('}');
            return str;
        }
    }

    if (defs.printMode === PRINTMODE_LATEX && $.isOne(expo)) {
        // if we are in latex mode we turn many
        // radicals into a radix sign with a power
        // underneath, and the power is often one
        // (e.g. square root turns into a radical
        // with a power one underneath) so handle
        // this case simply here, just print the base
        str += render_using_non_sexpr_print_mode(base, $);
    }
    else {
        // print the base,
        // determining if it needs to be
        // wrapped in parentheses or not
        if (is_power(base)) {
            // power is right associative so without parens it would be interpreted wrong.
            // Not sure why we have the LaTeX shananigans.
            if (defs.printMode !== PRINTMODE_LATEX) {
                str += print_str('(');
                str += print_factor(base, true, false, $);
                str += print_str(')');
            }
            else {
                str += print_factor(base, true, false, $);
            }
        }
        else if (is_negative_number(base)) {
            // Prevent ambiguity when dealing with unary minus.
            // As an example, in JavaScript unary minus technically has higher precedence than exponentiation,
            // but compilers sometimes require parentheses to avoid errors.
            str += print_str('(');
            str += render_using_non_sexpr_print_mode(base, $);
            str += print_str(')');
        }
        else if (is_add(base)) {
            // Addition has lower precedence than power so we need to prevent it from being pulled apart by the exponentiation.
            str += print_str('(');
            str += render_using_non_sexpr_print_mode(base, $);
            str += print_str(')');
        }
        else if (is_multiply(base)) {
            // Multiplicationn has lower precedence than power so we need to prevent it from being pulled apart by the exponentiation.
            // Not sure why we have the LaTeX shananigans.
            if (defs.printMode !== PRINTMODE_LATEX) {
                str += print_str('(');
                str += print_factor(base, true, false, $);
                str += print_str(')');
            }
            else {
                str += print_factor(base, true, false, $);
            }
        }
        else if (is_outer(base)) {
            // Outer product has lower precedence than power so we need to prevent it from being pulled apart by the exponentiation.
            str += print_str('(');
            str += render_using_non_sexpr_print_mode(base, $);
            str += print_str(')');
        }
        else if (is_inner_or_dot(base)) {
            // Inner product has lower precedence than power so we need to prevent it from being pulled apart by the exponentiation.
            str += print_str('(');
            str += render_using_non_sexpr_print_mode(base, $);
            str += print_str(')');
        }
        else if (is_num(base) && (lt_num_num(base, zero) || isfraction(base))) {
            str += print_str('(');
            str += print_factor(base, false, false, $);
            str += print_str(')');
        }
        else {
            str += print_factor(base, false, false, $);
        }

        // print the power symbol
        if (defs.printMode === PRINTMODE_HUMAN && !defs.testFlag) {
            if ($.getNativeDirective(Directive.useCaretForExponentiation)) {
                str += print_str('^');
            }
            else {
                str += print_str('**');
            }
        }
        else if (defs.printMode === PRINTMODE_LATEX) {
            // No choice in LaTeX, it's a caret.
            str += print_str('^');
        }
        else {
            if ($.getNativeDirective(Directive.useCaretForExponentiation)) {
                str += print_str('^');
            }
            else {
                str += print_str('**');
            }
        }

        // print the exponent
        if (defs.printMode === PRINTMODE_LATEX) {
            // in latex mode, one can omit the curly braces
            // wrapping the exponent if the exponent is only
            // one character long
            if (render_using_non_sexpr_print_mode(expo, $).length > 1) {
                str += print_str('{');
                str += render_using_non_sexpr_print_mode(expo, $);
                str += print_str('}');
            }
            else {
                str += render_using_non_sexpr_print_mode(expo, $);
            }
        }
        else if (is_cons(expo) || isfraction(expo) || (is_num(expo) && lt_num_num(expo, zero))) {
            str += print_str('(');
            str += render_using_non_sexpr_print_mode(expo, $);
            str += print_str(')');
        }
        else {
            str += print_factor(expo, false, false, $);
        }
    }
    return str;
}

function print_index_function(p: U, $: ExtensionEnv): string {
    let str = '';
    p = cdr(p);
    // TODO: Porobably need INNER, OUTER, RCO, LCO...
    if (caar(p).equals(ADD) || caar(p).equals(MULTIPLY) || caar(p).equals(POWER) || caar(p).equals(FACTORIAL)) {
        str += print_grouping_expr(car(p), $);
    }
    else {
        str += render_using_non_sexpr_print_mode(car(p), $);
    }
    str += print_str('[');
    p = cdr(p);
    if (is_cons(p)) {
        str += render_using_non_sexpr_print_mode(car(p), $);
        p = cdr(p);
        while (is_cons(p)) {
            str += print_str(',');
            str += render_using_non_sexpr_print_mode(car(p), $);
            p = cdr(p);
        }
    }
    str += print_str(']');
    return str;
}

function print_factor(expr: U, omitParens = false, pastFirstFactor = false, $: ExtensionEnv): string {
    const omtPrns = omitParens;
    // console.lg(`print_factor ${expr} omitParens => ${omitParens} pastFirstFactor => ${false}`);
    if (is_num(expr)) {
        let str = '';
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
            str += '(';
        }
        str += print_number(expr, pastFirstFactor, $);
        if (pastFirstFactor && lt_num_num(expr, zero)) {
            str += ')';
        }
        return str;
    }

    if (is_boo(expr)) {
        return expr.equals(booT) ? 'true' : 'false';
    }

    if (is_str(expr)) {
        let str = '';
        str += print_str('"');
        str += print_str(expr.str);
        str += print_str('"');
        return str;
    }

    if (is_tensor(expr)) {
        let str = '';
        if (defs.printMode === PRINTMODE_LATEX) {
            str += print_tensor_latex(expr, $);
        }
        else {
            str += print_tensor(expr, $);
        }
        return str;
    }

    if (is_blade(expr)) {
        let str = '';
        if (defs.printMode === PRINTMODE_LATEX) {
            str += expr.toLatexString();
        }
        else {
            str += expr.toInfixString();
        }
        return str;
    }

    if (is_cons(expr) && is_multiply(expr)) {
        let str = '';
        if (!omtPrns) {
            if (sign_of_term(expr) === '-' || defs.printMode !== PRINTMODE_LATEX) {
                if (defs.printMode === PRINTMODE_LATEX) {
                    str += print_str(' \\left (');
                }
                else {
                    str += print_str('(');
                }
            }
        }
        str += render_using_non_sexpr_print_mode(expr, $);
        if (!omtPrns) {
            if (sign_of_term(expr) === '-' || defs.printMode !== PRINTMODE_LATEX) {
                if (defs.printMode === PRINTMODE_LATEX) {
                    str += print_str(' \\right ) ');
                }
                else {
                    str += print_str(')');
                }
            }
        }
        return str;
    }
    else if (is_add(expr)) {
        let str = '';
        if (!omtPrns) {
            str += print_str('(');
        }
        str += render_using_non_sexpr_print_mode(expr, $);
        if (!omtPrns) {
            str += print_str(')');
        }
        return str;
    }

    if (is_power(expr)) {
        let str = '';
        const base = cadr(expr);
        const exponent = caddr(expr);
        str += print_power(base, exponent, $);
        return str;
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

    if (car(expr).equals(FUNCTION)) {
        let str = '';
        const fbody = cadr(expr);

        if (!defs.codeGen) {
            const parameters = caddr(expr);
            str += print_str('function ');
            const returned = render_as_sexpr(parameters, $);
            str += returned;
            str += print_str(' -> ');
        }
        str += render_using_non_sexpr_print_mode(fbody, $);
        return str;
    }

    if (car(expr).equals(PATTERN)) {
        let str = '';
        str += render_using_non_sexpr_print_mode(caadr(expr), $);
        if (defs.printMode === PRINTMODE_LATEX) {
            str += print_str(' \\rightarrow ');
        }
        else {
            if (defs.printMode === PRINTMODE_HUMAN && !defs.testFlag) {
                str += print_str(' -> ');
            }
            else {
                str += print_str('->');
            }
        }

        str += render_using_non_sexpr_print_mode(car(cdr(cadr(expr))), $);
        return str;
    }

    if (car(expr).equals(SYM_MATH_COMPONENT) && is_sym(cadr(expr))) {
        let str = '';
        str += print_index_function(expr, $);
        return str;
    }

    // TODO: The generalization here would be that we look up the operator then ask for the right format
    // based upon defs.printMode, defs.codeGen
    if (is_cons(expr) && is_factorial(expr)) {
        return print_factorial_function(expr, $);
    }
    else if (is_cons(expr) && is_abs(expr)) {
        // console.lg(`print_factor ${expr} omitParens => ${omitParens} pastFirstFactor => ${false} printMode: ${defs.printMode}`);
        switch (defs.printMode) {
            case PRINTMODE_HUMAN:
            case PRINTMODE_INFIX: {
                return print_abs_infix(expr, $);
            }
            case PRINTMODE_LATEX: {
                return print_abs_latex(expr, $);
            }
            default: {
                // PRINTMODE_ASCII and PRINTMODE_SEXPR is the other mode but that doesn't use this function.
                throw new Error(defs.printMode);
            }
        }
    }
    else if (car(expr).equals(SQRT) && defs.printMode === PRINTMODE_LATEX) {
        let str = '';
        str += print_SQRT_latex(expr, $);
        return str;
        // eslint-disable-next-line no-dupe-else-if
    }
    else if (is_transpose(expr)) {
        if (defs.printMode === PRINTMODE_LATEX) {
            let str = '';
            str += print_TRANSPOSE_latex(expr, $);
            return str;
        }
        else if (defs.codeGen) {
            let str = '';
            str += print_TRANSPOSE_codegen(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(UNIT)) {
        if (defs.codeGen) {
            let str = '';
            str += print_UNIT_codegen(expr, $);
            return str;
        }
    }
    else if (is_cons(expr) && is_opr_eq_inv(expr)) {
        if (defs.printMode === PRINTMODE_LATEX) {
            let str = '';
            str += print_INV_latex(expr, $);
            return str;
        }
        else if (defs.codeGen) {
            let str = '';
            str += print_INV_codegen(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(BINOMIAL) && defs.printMode === PRINTMODE_LATEX) {
        let str = '';
        str += print_BINOMIAL_latex(expr, $);
        return str;
    }
    else if (car(expr).equals(DEFINT) && defs.printMode === PRINTMODE_LATEX) {
        let str = '';
        str += print_DEFINT_latex(expr, $);
        return str;
    }
    else if (is_inner_or_dot(expr)) {
        if (defs.printMode === PRINTMODE_LATEX) {
            let str = '';
            str += print_DOT_latex(expr, $);
            return str;
        }
        else if (defs.codeGen) {
            let str = '';
            str += print_DOT_codegen(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(SIN)) {
        if (defs.codeGen) {
            let str = '';
            str += print_SIN_codegen(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(COS)) {
        if (defs.codeGen) {
            let str = '';
            str += print_COS_codegen(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(TAN)) {
        if (defs.codeGen) {
            let str = '';
            str += print_TAN_codegen(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(ARCSIN)) {
        if (defs.codeGen) {
            let str = '';
            str += print_ARCSIN_codegen(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(ARCCOS)) {
        if (defs.codeGen) {
            let str = '';
            str += print_ARCCOS_codegen(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(ARCTAN)) {
        if (defs.codeGen) {
            let str = '';
            str += print_ARCTAN_codegen(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(SUM)) {
        if (defs.printMode === PRINTMODE_LATEX) {
            let str = '';
            str += print_SUM_latex(expr, $);
            return str;
        }
        else if (defs.codeGen) {
            let str = '';
            str += print_SUM_codegen(expr, $);
            return str;
        }
        //else if car(p) == symbol(QUOTE)
        //  if printMode == PRINTMODE_LATEX
        //    print_expr(cadr(p),$)
        //    return accumulator
    }
    else if (car(expr).equals(PRODUCT)) {
        if (defs.printMode === PRINTMODE_LATEX) {
            let str = '';
            str += print_PRODUCT_latex(expr, $);
            return str;
        }
        else if (defs.codeGen) {
            let str = '';
            str += print_PRODUCT_codegen(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(FOR)) {
        if (defs.codeGen) {
            let str = '';
            str += print_FOR_codegen(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(DO)) {
        if (defs.codeGen) {
            let str = '';
            str += print_DO_codegen(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(TEST)) {
        if (defs.codeGen) {
            let str = '';
            str += print_TEST_codegen(expr, $);
            return str;
        }
        if (defs.printMode === PRINTMODE_LATEX) {
            let str = '';
            str += print_TEST_latex(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(TESTLT)) {
        if (defs.codeGen) {
            let str = '';
            str +=
                '((' + render_using_non_sexpr_print_mode(cadr(expr), $) + ') < (' + render_using_non_sexpr_print_mode(caddr(expr), $) + '))';
            return str;
        }
        if (defs.printMode === PRINTMODE_LATEX) {
            let str = '';
            str += print_TESTLT_latex(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(TESTLE)) {
        if (defs.codeGen) {
            let str = '';
            str +=
                '((' + render_using_non_sexpr_print_mode(cadr(expr), $) + ') <= (' + render_using_non_sexpr_print_mode(caddr(expr), $) + '))';
            return str;
        }
        if (defs.printMode === PRINTMODE_LATEX) {
            let str = '';
            str += print_TESTLE_latex(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(TESTGT)) {
        if (defs.codeGen) {
            let str = '';
            str +=
                '((' + render_using_non_sexpr_print_mode(cadr(expr), $) + ') > (' + render_using_non_sexpr_print_mode(caddr(expr), $) + '))';
            return str;
        }
        if (defs.printMode === PRINTMODE_LATEX) {
            let str = '';
            str += print_TESTGT_latex(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(TESTGE)) {
        if (defs.codeGen) {
            let str = '';
            str +=
                '((' + render_using_non_sexpr_print_mode(cadr(expr), $) + ') >= (' + render_using_non_sexpr_print_mode(caddr(expr), $) + '))';
            return str;
        }
        if (defs.printMode === PRINTMODE_LATEX) {
            let str = '';
            str += print_TESTGE_latex(expr, $);
            return str;
        }
    }
    else if (is_cons(expr) && expr.opr.equals(testeq)) {
        if (defs.codeGen) {
            let str = '';
            str +=
                '((' + render_using_non_sexpr_print_mode(cadr(expr), $) + ') === (' + render_using_non_sexpr_print_mode(caddr(expr), $) + '))';
            return str;
        }
        if (defs.printMode === PRINTMODE_LATEX) {
            let str = '';
            str += print_testeq_latex(expr, $);
            return str;
        }
    }
    else if (car(expr).equals(FLOOR)) {
        if (defs.codeGen) {
            let str = '';
            str += 'Math.floor(' + render_using_non_sexpr_print_mode(cadr(expr), $) + '),$';
            return str;
        }
        if (defs.printMode === PRINTMODE_LATEX) {
            let str = '';
            str += ' \\lfloor {' + render_using_non_sexpr_print_mode(cadr(expr), $) + '} \\rfloor ,$';
            return str;
        }
    }
    else if (car(expr).equals(CEILING)) {
        if (defs.codeGen) {
            let str = '';
            str += 'Math.ceiling(' + render_using_non_sexpr_print_mode(cadr(expr), $) + '),$';
            return str;
        }
        if (defs.printMode === PRINTMODE_LATEX) {
            let str = '';
            str += ' \\lceil {' + render_using_non_sexpr_print_mode(cadr(expr), $) + '} \\rceil ,$';
            return str;
        }
    }
    else if (car(expr).equals(ROUND)) {
        if (defs.codeGen) {
            let str = '';
            str += 'Math.round(' + render_using_non_sexpr_print_mode(cadr(expr), $) + '),$';
            return str;
        }
    }
    else if (car(expr).equals(ASSIGN)) {
        if (defs.codeGen) {
            let str = '';
            str += print_SETQ_codegen(expr, $);
            return str;
        }
        else {
            let str = '';
            str += render_using_non_sexpr_print_mode(cadr(expr), $);
            str += print_str('=');
            str += render_using_non_sexpr_print_mode(caddr(expr), $);
            return str;
        }
    }
    return print_factor_fallback(expr, omtPrns, $);
}

function print_factor_fallback(expr: U, omtPrns: boolean, $: ExtensionEnv): string {
    if (is_cons(expr)) {
        let str = '';
        str += print_factor(expr.car, false, false, $);
        expr = expr.cdr;
        if (nil === expr) {
            return str;
        }
        else {
            if (!omtPrns) {
                str += print_str('(');
            }
            if (is_cons(expr)) {
                str += render_using_non_sexpr_print_mode(car(expr), $);
                expr = cdr(expr);
                while (is_cons(expr)) {
                    str += print_str(',');
                    str += render_using_non_sexpr_print_mode(car(expr), $);
                    expr = cdr(expr);
                }
            }
            if (!omtPrns) {
                str += print_str(')');
            }
            return str;
        }
    }

    if (is_uom(expr)) {
        let str = '';
        str += expr.toString();
        return str;
    }

    if (is_blade(expr)) {
        let str = '';
        str += expr.toString();
        return str;
    }

    if (MATH_DERIVATIVE.equals(expr)) {
        return print_char('d');
    }
    else if (is_base_of_natural_logarithm(expr)) {
        if (defs.codeGen) {
            return print_str('Math.E');
        }
        else {
            if (defs.printMode === PRINTMODE_LATEX) {
                return print_str('e');
            }
            else {
                return print_str($.getSymbolPrintName(MATH_E));
            }
        }
    }
    else if (is_pi(expr)) {
        if (defs.printMode === PRINTMODE_LATEX) {
            return print_str('\\pi');
        }
        else {
            return print_str($.getSymbolPrintName(MATH_PI));
        }
    }
    else {
        if (is_sym(expr)) {
            if (defs.printMode === PRINTMODE_INFIX) {
                return $.toInfixString(expr);
            }
            if (defs.printMode === PRINTMODE_LATEX) {
                return $.toLatexString(expr);
            }
            return expr.text;
        }
        if (is_hyp(expr)) {
            return expr.printname;
        }
        if (is_nil(expr)) {
            return print_str($.getSymbolPrintName(native_sym(Native.NIL)));
        }
        if (is_err(expr)) {
            return ENGLISH_UNDEFINED;
        }
        if (is_imu(expr)) {
            if (defs.printMode === PRINTMODE_LATEX) {
                return print_str('i');
            }
            else {
                return print_str($.getSymbolPrintName(MATH_IMU));
            }
        }
        throw new Error(`${expr} ???`);
    }
}

function print_multiply_sign(): string {
    if (defs.printMode === PRINTMODE_LATEX) {
        return '';
    }

    if (defs.printMode === PRINTMODE_HUMAN && !defs.testFlag && !defs.codeGen) {
        return print_str(' ');
    }
    else {
        return print_str('*');
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function is_denominator(expr: U, $: ExtensionEnv): boolean {
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
function any_denominators(expr: Cons, $: ExtensionEnv): boolean {
    let p = expr.cdr;
    while (is_cons(p)) {
        const q = p.car;
        if (is_denominator(q, $)) {
            return true;
        }
        p = p.cdr;
    }
    return false;
}
