import { Flt, is_flt, is_num, is_rat, is_str, is_sym, is_tensor, Num, Rat, Tensor } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Atom, car, cdr, Cons, is_atom, is_cons, is_nil, U } from "math-expression-tree";
import { ExprContextFromProgram } from "../adapters/ExprContextFromProgram";
import { StackU } from "../env/StackU";
import { is_imu } from "../operators/imu/is_imu";
import { caddr, cadr, cddr } from "../tree/helpers";
import { bignum_itoa } from "./bignum_itoa";
import { count_denominators } from "./count_denominators";
import { find_denominator } from "./find_denominator";
import { fmtnum } from "./fmtnum";
import { isdenominator } from "./isdenominator";
import { isinteger } from "./isinteger";
import { isminusone } from "./isminusone";
import { isnegativenumber } from "./isnegativenumber";
import { isnegativeterm } from "./isnegativeterm";
import { isnumerator } from "./isnumerator";
import { isposint } from "./isposint";
import { printname_from_symbol } from "./printname_from_symbol";
import { ProgramControl } from "./ProgramControl";
import { ProgramEnv } from "./ProgramEnv";

const ADD = native_sym(Native.add);
const ASSIGN = native_sym(Native.assign);
const MULTIPLY = native_sym(Native.multiply);
const DERIVATIVE = native_sym(Native.derivative);
const FACTORIAL = native_sym(Native.factorial);
const INDEX = native_sym(Native.component);
const POWER = native_sym(Native.pow);
const TESTEQ = native_sym(Native.testeq);
const TESTGE = native_sym(Native.testge);
const TESTGT = native_sym(Native.testgt);
const TESTLE = native_sym(Native.testle);
const TESTLT = native_sym(Native.testlt);
const MATH_E = native_sym(Native.E);


function infixform_subexpr(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    infixform_write("(", config, outbuf);
    infixform_expr(p, env, ctrl, config, outbuf);
    infixform_write(")", config, outbuf);
}

export interface InfixOptions {
    useCaretForExponentiation?: boolean,
    useParenForTensors?: boolean;
}

export interface InfixConfig {
    useCaretForExponentiation: boolean,
    useParenForTensors: boolean;
}

export function infix_config_from_options(options: InfixOptions): InfixConfig {
    const config: InfixConfig = {
        useCaretForExponentiation: options.useCaretForExponentiation ? true : false,
        useParenForTensors: options.useParenForTensors ? true : false
    };
    return config;
}

export function to_infix(expr: U, env: ProgramEnv, ctrl: ProgramControl, options: InfixOptions = {}): string {
    const config = infix_config_from_options(options);
    const outbuf: string[] = [];
    infixform_expr(expr, env, ctrl, config, outbuf);
    return outbuf.join('');
}

export function infixform_expr(x: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    if (is_cons(x)) {
        if (isnegativeterm(x) || (car(x).equals(ADD) && isnegativeterm(cadr(x)))) {
            infixform_write("-", config, outbuf);
        }
    }
    else {
        if (isnegativeterm(x)) {
            infixform_write("-", config, outbuf);
        }
    }
    if (car(x).equals(ADD)) {
        infixform_expr_nib(x, env, ctrl, config, outbuf);
    }
    else {
        infixform_term(x, env, ctrl, config, outbuf);
    }
}

function infixform_expr_nib(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    infixform_term(cadr(p), env, ctrl, config, outbuf);
    p = cddr(p);
    while (is_cons(p)) {
        if (isnegativeterm(car(p)))
            infixform_write(" - ", config, outbuf);
        else
            infixform_write(" + ", config, outbuf);
        infixform_term(car(p), env, ctrl, config, outbuf);
        p = cdr(p);
    }
}

function infixform_term(x: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    if (is_cons(x) && x.opr.equals(MULTIPLY)) {
        infixform_term_nib(x, env, ctrl, config, outbuf);
    }
    else {
        infixform_factor(x, env, ctrl, config, outbuf);
    }
}

/**
 * 
 * @param p is a multiplicative expression
 * @param config 
 * @param outbuf 
 * @returns 
 */
function infixform_term_nib(p: Cons, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    if (find_denominator(p)) {
        infixform_numerators(p, env, ctrl, config, outbuf);
        infixform_write(" / ", config, outbuf);
        infixform_denominators(p, env, ctrl, config, outbuf);
        return;
    }

    // no denominators

    p = cdr(p);

    if (isminusone(car(p)))
        p = cdr(p); // sign already emitted

    infixform_factor(car(p), env, ctrl, config, outbuf);

    p = cdr(p);

    while (is_cons(p)) {
        infixform_write(" ", config, outbuf); // space in between factors
        infixform_factor(car(p), env, ctrl, config, outbuf);
        p = cdr(p);
    }
}

function infixform_numerators(p: Cons, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {

    let k = 0;

    p = cdr(p);

    while (is_cons(p)) {

        const q = car(p);
        p = cdr(p);

        if (!isnumerator(q))
            continue;

        if (++k > 1)
            infixform_write(" ", config, outbuf); // space in between factors

        if (is_rat(q)) {
            const s = bignum_itoa(q.a);
            infixform_write(s, config, outbuf);
            continue;
        }

        infixform_factor(q, env, ctrl, config, outbuf);
    }

    if (k === 0)
        infixform_write("1", config, outbuf);
}

function infixform_denominators(p: Cons, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {

    const n = count_denominators(p);

    if (n > 1)
        infixform_write("(", config, outbuf);

    let k = 0;

    p = cdr(p);

    while (is_cons(p)) {

        let q = car(p);
        p = cdr(p);

        if (!isdenominator(q))
            continue;

        if (++k > 1)
            infixform_write(" ", config, outbuf); // space in between factors

        if (is_rat(q)) {
            const s = bignum_itoa(q.b);
            infixform_write(s, config, outbuf);
            continue;
        }

        if (isminusone(caddr(q))) {
            q = cadr(q);
            infixform_factor(q, env, ctrl, config, outbuf);
        }
        else {
            infixform_base(cadr(q), env, ctrl, config, outbuf);
            if (config.useCaretForExponentiation) {
                infixform_write("^", config, outbuf);
            }
            else {
                infixform_write("**", config, outbuf);
            }
            infixform_numeric_exponent(caddr(q) as Num, config, outbuf); // sign is not emitted
        }
    }

    if (n > 1)
        infixform_write(")", config, outbuf);
}

function infixform_factor(x: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    // Rat
    if (is_rat(x)) {
        infixform_rational(x, config, outbuf);
        return;
    }

    // Flt
    if (is_flt(x)) {
        infixform_double(x, config, outbuf);
        return;
    }

    // Sym
    if (is_sym(x)) {
        if (x.equalsSym(MATH_E)) {
            infixform_write("exp(1)", config, outbuf);
        }
        else {
            infixform_write(printname_from_symbol(x), config, outbuf);
        }
        return;
    }

    // Str
    if (is_str(x)) {
        infixform_write(x.str, config, outbuf);
        return;
    }

    // Tensor
    if (is_tensor(x)) {
        infixform_tensor(x, env, ctrl, config, outbuf);
        return;
    }

    if (is_atom(x)) {
        infixform_atom(x, env, ctrl, config, outbuf);
        return;
    }

    if (is_cons(x) && (x.opr.equals(ADD) || x.opr.equals(MULTIPLY))) {
        infixform_subexpr(x, env, ctrl, config, outbuf);
        return;
    }

    if (is_cons(x) && x.opr.equals(POWER)) {
        infixform_power(x, env, ctrl, config, outbuf);
        return;
    }

    if (car(x).equals(FACTORIAL)) {
        infixform_factorial(x, env, ctrl, config, outbuf);
        return;
    }

    if (car(x).equals(INDEX)) {
        infixform_index(x, env, ctrl, config, outbuf);
        return;
    }

    // use d if for derivative if d not defined

    if (car(x).equals(DERIVATIVE) /*&& is_nil(get_usrfunc(symbol(D_LOWER), $))*/) {
        infixform_write("d", config, outbuf);
        infixform_arglist(x, env, ctrl, config, outbuf);
        return;
    }

    if (is_cons(x) && x.opr.equals(ASSIGN)) {
        const lhs = x.lhs;
        const rhs = x.rhs;
        infixform_expr(lhs, env, ctrl, config, outbuf);
        infixform_write(" = ", config, outbuf);
        infixform_expr(rhs, env, ctrl, config, outbuf);
        return;
    }

    if (car(x).equals(TESTEQ)) {
        infixform_expr(cadr(x), env, ctrl, config, outbuf);
        infixform_write(" == ", config, outbuf);
        infixform_expr(caddr(x), env, ctrl, config, outbuf);
        return;
    }

    if (car(x).equals(TESTGE)) {
        infixform_expr(cadr(x), env, ctrl, config, outbuf);
        infixform_write(" >= ", config, outbuf);
        infixform_expr(caddr(x), env, ctrl, config, outbuf);
        return;
    }

    if (car(x).equals(TESTGT)) {
        infixform_expr(cadr(x), env, ctrl, config, outbuf);
        infixform_write(" > ", config, outbuf);
        infixform_expr(caddr(x), env, ctrl, config, outbuf);
        return;
    }

    if (car(x).equals(TESTLE)) {
        infixform_expr(cadr(x), env, ctrl, config, outbuf);
        infixform_write(" <= ", config, outbuf);
        infixform_expr(caddr(x), env, ctrl, config, outbuf);
        return;
    }

    if (car(x).equals(TESTLT)) {
        infixform_expr(cadr(x), env, ctrl, config, outbuf);
        infixform_write(" < ", config, outbuf);
        infixform_expr(caddr(x), env, ctrl, config, outbuf);
        return;
    }

    // other function

    if (is_cons(x)) {
        infixform_base(car(x), env, ctrl, config, outbuf);
        infixform_arglist(x, env, ctrl, config, outbuf);
        return;
    }
    else if (is_nil(x)) {
        infixform_write("nil", config, outbuf);
    }
    else {
        infixform_write(" ? ", config, outbuf);
    }

}

function infixform_power(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    if (cadr(p).equals(MATH_E)) {
        infixform_write("exp(", config, outbuf);
        infixform_expr(caddr(p), env, ctrl, config, outbuf);
        infixform_write(")", config, outbuf);
        return;
    }

    if (is_imu(p)) {
        /*
        if (isimaginaryunit(get_binding(symbol(J_LOWER), $))) {
            infixform_write("j", outbuf);
            return;
        }
        if (isimaginaryunit(get_binding(symbol(I_LOWER), $))) {
            infixform_write("i", outbuf);
            return;
        }
        */
        infixform_write("i", config, outbuf);
        return;
    }

    const expo = caddr(p);
    if (is_num(expo) && isnegativenumber(expo)) {
        infixform_reciprocal(p, env, ctrl, config, outbuf);
        return;
    }

    infixform_base(cadr(p), env, ctrl, config, outbuf);

    if (config.useCaretForExponentiation) {
        infixform_write("^", config, outbuf);
    }
    else {
        infixform_write("**", config, outbuf);
    }

    p = caddr(p); // p now points to exponent

    if (is_num(p)) {
        infixform_numeric_exponent(p, config, outbuf);
    }
    else if (is_cons(p) && (p.opr.equals(ADD) || p.opr.equals(MULTIPLY) || p.opr.equals(POWER) || p.opr.equals(FACTORIAL))) {
        infixform_subexpr(p, env, ctrl, config, outbuf);
    }
    else {
        infixform_expr(p, env, ctrl, config, outbuf);
    }
}

// p = y^x where x is a negative number

function infixform_reciprocal(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    infixform_write("1 / ", config, outbuf); // numerator
    if (isminusone(caddr(p))) {
        p = cadr(p);
        infixform_factor(p, env, ctrl, config, outbuf);
    }
    else {
        infixform_base(cadr(p), env, ctrl, config, outbuf);
        if (config.useCaretForExponentiation) {
            infixform_write("^", config, outbuf);
        }
        else {
            infixform_write("**", config, outbuf);
        }
        infixform_numeric_exponent(caddr(p) as Num, config, outbuf); // sign is not emitted
    }
}

function infixform_factorial(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    infixform_base(cadr(p), env, ctrl, config, outbuf);
    infixform_write("!", config, outbuf);
}

function infixform_index(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    infixform_base(cadr(p), env, ctrl, config, outbuf);
    infixform_write("[", config, outbuf);
    p = cddr(p);
    if (is_cons(p)) {
        infixform_expr(car(p), env, ctrl, config, outbuf);
        p = cdr(p);
        while (is_cons(p)) {
            infixform_write(",", config, outbuf);
            infixform_expr(car(p), env, ctrl, config, outbuf);
            p = cdr(p);
        }
    }
    infixform_write("]", config, outbuf);
}

function infixform_arglist(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    infixform_write("(", config, outbuf);
    p = cdr(p);
    if (is_cons(p)) {
        infixform_expr(car(p), env, ctrl, config, outbuf);
        p = cdr(p);
        while (is_cons(p)) {
            infixform_write(",", config, outbuf);
            infixform_expr(car(p), env, ctrl, config, outbuf);
            p = cdr(p);
        }
    }
    infixform_write(")", config, outbuf);
}

// sign is not emitted

function infixform_rational(x: Rat, config: InfixConfig, outbuf: string[]): void {
    // DGH: For sign to not be emitted we should abs() here.
    const a = bignum_itoa(x.a);
    infixform_write(a, config, outbuf);

    if (x.isInteger()) {
        return;
    }

    infixform_write("/", config, outbuf);

    const b = bignum_itoa(x.b);
    infixform_write(b, config, outbuf);
}

// sign is not emitted

function infixform_double(p: Flt, config: InfixConfig, outbuf: string[]): void {

    const s = fmtnum(p.d);

    let k = 0;

    while (k < s.length && s.charAt(k) !== "." && s.charAt(k) !== "E" && s.charAt(k) !== "e")
        k++;

    infixform_write(s.substring(0, k), config, outbuf);

    // handle trailing zeroes

    if (s.charAt(k) === ".") {

        const i = k++;

        while (k < s.length && s.charAt(k) !== "E" && s.charAt(k) !== "e")
            k++;

        let j = k;

        while (s.charAt(j - 1) === "0")
            j--;

        if (j - i > 1)
            infixform_write(s.substring(i, j), config, outbuf);
    }

    if (s.charAt(k) !== "E" && s.charAt(k) !== "e")
        return;

    k++;

    infixform_write(" 10^", config, outbuf);

    if (s.charAt(k) === "-") {
        infixform_write("(-", config, outbuf);
        k++;
        while (s.charAt(k) === "0") // skip leading zeroes
            k++;
        infixform_write(s.substring(k), config, outbuf);
        infixform_write(")", config, outbuf);
    }
    else {
        if (s.charAt(k) === "+")
            k++;
        while (s.charAt(k) === "0") // skip leading zeroes
            k++;
        infixform_write(s.substring(k), config, outbuf);
    }
}

function infixform_base(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    if (is_num(p)) {
        infixform_numeric_base(p, env, ctrl, config, outbuf);
    }
    else if (is_cons(p) && (p.opr.equals(ADD) || p.opr.equals(MULTIPLY) || p.opr.equals(POWER) || p.opr.equals(FACTORIAL))) {
        infixform_subexpr(p, env, ctrl, config, outbuf);
    }
    else {
        infixform_expr(p, env, ctrl, config, outbuf);
    }
}

function infixform_numeric_base(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    if (is_rat(p) && isposint(p))
        infixform_rational(p, config, outbuf);
    else
        infixform_subexpr(p, env, ctrl, config, outbuf);
}

// sign is not emitted

function infixform_numeric_exponent(p: Num, config: InfixConfig, outbuf: string[]): void {
    if (is_flt(p)) {
        infixform_write("(", config, outbuf);
        infixform_double(p, config, outbuf);
        infixform_write(")", config, outbuf);
        return;
    }

    if (is_rat(p) && isinteger(p)) {
        infixform_rational(p, config, outbuf);
        return;
    }

    infixform_write("(", config, outbuf);
    infixform_rational(p, config, outbuf);
    infixform_write(")", config, outbuf);
}

function infixform_tensor(p: Tensor, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    infixform_tensor_nib(p, 0, 0, env, ctrl, config, outbuf);
}

function infixform_tensor_nib(p: Tensor, d: number, k: number, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {

    if (d === p.ndim) {
        infixform_expr(p.elems[k], env, ctrl, config, outbuf);
        return;
    }

    let span = 1;

    let n = p.ndim;

    for (let i = d + 1; i < n; i++) {
        span *= p.dims[i];
    }

    if (config.useParenForTensors) {
        infixform_write("(", config, outbuf);
    }
    else {
        infixform_write("[", config, outbuf);
    }

    n = p.dims[d];

    for (let i = 0; i < n; i++) {

        infixform_tensor_nib(p, d + 1, k, env, ctrl, config, outbuf);

        if (i < n - 1)
            infixform_write(",", config, outbuf);

        k += span;
    }

    if (config.useParenForTensors) {
        infixform_write(")", config, outbuf);
    }
    else {
        infixform_write("]", config, outbuf);
    }
}
function infixform_atom(atom: Atom, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    const stack = new StackU();
    const $ = new ExprContextFromProgram(env, ctrl, stack);
    const handler = env.handlerFor(atom);
    infixform_write(JSON.stringify(handler.toInfixString(atom, $)), config, outbuf);
}

export function infixform_write(s: string, config: InfixConfig, outbuf: string[]): void {
    outbuf.push(s);
}
