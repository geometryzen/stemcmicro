import { Flt, is_err, is_flt, is_imu, is_num, is_rat, is_str, is_sym, is_tensor, Num, Rat, Tensor } from "@stemcmicro/atoms";
import { str_to_string } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Atom, caddr, cadr, car, cddr, cdr, Cons, is_atom, is_cons, is_nil, nil, U } from "@stemcmicro/tree";
import { bignum_itoa } from "./bignum_itoa";
import { count_denominators } from "./count_denominators";
import { ExprContextFromProgram } from "./ExprContextFromProgram";
import { find_denominator } from "./find_denominator";
import { fmtnum } from "./fmtnum";
import { isdenominator } from "./isdenominator";
import { isminusone } from "./isminusone";
import { isnegativenumber } from "./isnegativenumber";
import { isnegativeterm } from "./isnegativeterm";
import { isnumerator } from "./isnumerator";
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

function infix_subexpr(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    infix_write("(", config, outbuf);
    infix_expr(p, env, ctrl, config, outbuf);
    infix_write(")", config, outbuf);
}

export interface InfixOptions {
    useCaretForExponentiation?: boolean;
    useParenForTensors?: boolean;
}

export interface InfixConfig {
    useCaretForExponentiation: boolean;
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
    infix_expr(expr, env, ctrl, config, outbuf);
    return outbuf.join("");
}

export function infix_expr(x: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    if (is_cons(x)) {
        if (isnegativeterm(x) || (car(x).equals(ADD) && isnegativeterm(cadr(x)))) {
            infix_write("-", config, outbuf);
        }
    } else {
        if (isnegativeterm(x)) {
            infix_write("-", config, outbuf);
        }
    }
    if (car(x).equals(ADD)) {
        formatinfix_expr_nib(x, env, ctrl, config, outbuf);
    } else {
        formatinfix_term(x, env, ctrl, config, outbuf);
    }
}

function formatinfix_expr_nib(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    formatinfix_term(cadr(p), env, ctrl, config, outbuf);
    p = cddr(p);
    while (is_cons(p)) {
        if (isnegativeterm(car(p))) infix_write(" - ", config, outbuf);
        else infix_write(" + ", config, outbuf);
        formatinfix_term(car(p), env, ctrl, config, outbuf);
        p = cdr(p);
    }
}

function formatinfix_term(x: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    if (is_cons(x) && x.opr.equals(MULTIPLY)) {
        infix_term_nib(x, env, ctrl, config, outbuf);
    } else {
        infix_factor(x, env, ctrl, config, outbuf);
    }
}

/**
 *
 * @param p is a multiplicative expression
 * @param config
 * @param outbuf
 * @returns
 */
function infix_term_nib(p: Cons, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    if (find_denominator(p)) {
        infix_numerators(p, env, ctrl, config, outbuf);
        infix_write(" / ", config, outbuf);
        infix_denominators(p, env, ctrl, config, outbuf);
        return;
    }

    // no denominators

    p = cdr(p);

    if (isminusone(car(p))) p = cdr(p); // sign already emitted

    infix_factor(car(p), env, ctrl, config, outbuf);

    p = cdr(p);

    while (is_cons(p)) {
        infix_write(" ", config, outbuf); // space in between factors
        infix_factor(car(p), env, ctrl, config, outbuf);
        p = cdr(p);
    }
}

function infix_numerators(p: Cons, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    let k = 0;

    p = cdr(p);

    while (is_cons(p)) {
        const q = car(p);
        p = cdr(p);

        if (!isnumerator(q)) continue;

        if (++k > 1) infix_write(" ", config, outbuf); // space in between factors

        if (is_rat(q)) {
            const s = bignum_itoa(q.a);
            infix_write(s, config, outbuf);
            continue;
        }

        infix_factor(q, env, ctrl, config, outbuf);
    }

    if (k === 0) infix_write("1", config, outbuf);
}

function infix_denominators(p: Cons, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    const n = count_denominators(p);

    if (n > 1) infix_write("(", config, outbuf);

    let k = 0;

    p = cdr(p);

    while (is_cons(p)) {
        let q = car(p);
        p = cdr(p);

        if (!isdenominator(q)) continue;

        if (++k > 1) infix_write(" ", config, outbuf); // space in between factors

        if (is_rat(q)) {
            const s = bignum_itoa(q.b);
            infix_write(s, config, outbuf);
            continue;
        }

        if (isminusone(caddr(q))) {
            q = cadr(q);
            infix_factor(q, env, ctrl, config, outbuf);
        } else {
            infix_base(cadr(q), env, ctrl, config, outbuf);
            if (config.useCaretForExponentiation) {
                infix_write("^", config, outbuf);
            } else {
                infix_write("**", config, outbuf);
            }
            infix_numeric_exponent(caddr(q) as Num, config, outbuf); // sign is not emitted
        }
    }

    if (n > 1) infix_write(")", config, outbuf);
}

function infix_factor(x: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    // Rat
    if (is_rat(x)) {
        infix_rational(x, config, outbuf);
        return;
    }

    // Flt
    if (is_flt(x)) {
        infix_double(x, config, outbuf);
        return;
    }

    // Sym
    if (is_sym(x)) {
        if (x.equalsSym(MATH_E)) {
            infix_write("exp(1)", config, outbuf);
        } else {
            infix_write(printname_from_symbol(x), config, outbuf);
        }
        return;
    }

    // Str
    if (is_str(x)) {
        infix_write(x.str, config, outbuf);
        return;
    }

    // Tensor
    if (is_tensor(x)) {
        infix_tensor(x, env, ctrl, config, outbuf);
        return;
    }

    if (is_atom(x)) {
        infix_atom(x, env, ctrl, config, outbuf);
        return;
    }

    if (is_cons(x) && (x.opr.equals(ADD) || x.opr.equals(MULTIPLY))) {
        infix_subexpr(x, env, ctrl, config, outbuf);
        return;
    }

    if (is_cons(x) && x.opr.equals(POWER)) {
        infix_power(x, env, ctrl, config, outbuf);
        return;
    }

    if (car(x).equals(FACTORIAL)) {
        infix_factorial(x, env, ctrl, config, outbuf);
        return;
    }

    if (car(x).equals(INDEX)) {
        infix_index(x, env, ctrl, config, outbuf);
        return;
    }

    // use d if for derivative if d not defined

    if (car(x).equals(DERIVATIVE) /*&& is_nil(get_usrfunc(symbol(D_LOWER), $))*/) {
        infix_write("d", config, outbuf);
        infix_arglist(x, env, ctrl, config, outbuf);
        return;
    }

    if (is_cons(x) && x.opr.equals(ASSIGN)) {
        const lhs = x.lhs;
        const rhs = x.rhs;
        infix_expr(lhs, env, ctrl, config, outbuf);
        infix_write(" = ", config, outbuf);
        infix_expr(rhs, env, ctrl, config, outbuf);
        return;
    }

    if (car(x).equals(TESTEQ)) {
        infix_expr(cadr(x), env, ctrl, config, outbuf);
        infix_write(" == ", config, outbuf);
        infix_expr(caddr(x), env, ctrl, config, outbuf);
        return;
    }

    if (car(x).equals(TESTGE)) {
        infix_expr(cadr(x), env, ctrl, config, outbuf);
        infix_write(" >= ", config, outbuf);
        infix_expr(caddr(x), env, ctrl, config, outbuf);
        return;
    }

    if (car(x).equals(TESTGT)) {
        infix_expr(cadr(x), env, ctrl, config, outbuf);
        infix_write(" > ", config, outbuf);
        infix_expr(caddr(x), env, ctrl, config, outbuf);
        return;
    }

    if (car(x).equals(TESTLE)) {
        infix_expr(cadr(x), env, ctrl, config, outbuf);
        infix_write(" <= ", config, outbuf);
        infix_expr(caddr(x), env, ctrl, config, outbuf);
        return;
    }

    if (car(x).equals(TESTLT)) {
        infix_expr(cadr(x), env, ctrl, config, outbuf);
        infix_write(" < ", config, outbuf);
        infix_expr(caddr(x), env, ctrl, config, outbuf);
        return;
    }

    // other function

    if (is_cons(x)) {
        infix_base(car(x), env, ctrl, config, outbuf);
        infix_arglist(x, env, ctrl, config, outbuf);
        return;
    } else if (is_nil(x)) {
        infix_write("nil", config, outbuf);
    } else {
        infix_write(" ? ", config, outbuf);
    }
}

function infix_power(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    if (cadr(p).equals(MATH_E)) {
        infix_write("exp(", config, outbuf);
        infix_expr(caddr(p), env, ctrl, config, outbuf);
        infix_write(")", config, outbuf);
        return;
    }

    if (is_imu(p)) {
        /*
        if (isimaginaryunit(get_binding(symbol(J_LOWER), $))) {
            infix_write("j", outbuf);
            return;
        }
        if (isimaginaryunit(get_binding(symbol(I_LOWER), $))) {
            infixf_write("i", outbuf);
            return;
        }
        */
        infix_write("i", config, outbuf);
        return;
    }

    const expo = caddr(p);
    if (is_num(expo) && isnegativenumber(expo)) {
        infix_reciprocal(p, env, ctrl, config, outbuf);
        return;
    }

    infix_base(cadr(p), env, ctrl, config, outbuf);

    if (config.useCaretForExponentiation) {
        infix_write("^", config, outbuf);
    } else {
        infix_write("**", config, outbuf);
    }

    p = caddr(p); // p now points to exponent

    if (is_num(p)) {
        infix_numeric_exponent(p, config, outbuf);
    } else if (is_cons(p) && (p.opr.equals(ADD) || p.opr.equals(MULTIPLY) || p.opr.equals(POWER) || p.opr.equals(FACTORIAL))) {
        infix_subexpr(p, env, ctrl, config, outbuf);
    } else {
        infix_expr(p, env, ctrl, config, outbuf);
    }
}

// p = y^x where x is a negative number

function infix_reciprocal(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    infix_write("1 / ", config, outbuf); // numerator
    if (isminusone(caddr(p))) {
        p = cadr(p);
        infix_factor(p, env, ctrl, config, outbuf);
    } else {
        infix_base(cadr(p), env, ctrl, config, outbuf);
        if (config.useCaretForExponentiation) {
            infix_write("^", config, outbuf);
        } else {
            infix_write("**", config, outbuf);
        }
        infix_numeric_exponent(caddr(p) as Num, config, outbuf); // sign is not emitted
    }
}

function infix_factorial(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    infix_base(cadr(p), env, ctrl, config, outbuf);
    infix_write("!", config, outbuf);
}

function infix_index(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    infix_base(cadr(p), env, ctrl, config, outbuf);
    infix_write("[", config, outbuf);
    p = cddr(p);
    if (is_cons(p)) {
        infix_expr(car(p), env, ctrl, config, outbuf);
        p = cdr(p);
        while (is_cons(p)) {
            infix_write(",", config, outbuf);
            infix_expr(car(p), env, ctrl, config, outbuf);
            p = cdr(p);
        }
    }
    infix_write("]", config, outbuf);
}

function infix_arglist(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    infix_write("(", config, outbuf);
    p = cdr(p);
    if (is_cons(p)) {
        infix_expr(car(p), env, ctrl, config, outbuf);
        p = cdr(p);
        while (is_cons(p)) {
            infix_write(",", config, outbuf);
            infix_expr(car(p), env, ctrl, config, outbuf);
            p = cdr(p);
        }
    }
    infix_write(")", config, outbuf);
}

// sign is not emitted

function infix_rational(x: Rat, config: InfixConfig, outbuf: string[]): void {
    // DGH: For sign to not be emitted we should abs() here.
    const a = bignum_itoa(x.a);
    infix_write(a, config, outbuf);

    if (x.isInteger()) {
        return;
    }

    infix_write("/", config, outbuf);

    const b = bignum_itoa(x.b);
    infix_write(b, config, outbuf);
}

// sign is not emitted

function infix_double(p: Flt, config: InfixConfig, outbuf: string[]): void {
    const s = fmtnum(p.d);

    let k = 0;

    while (k < s.length && s.charAt(k) !== "." && s.charAt(k) !== "E" && s.charAt(k) !== "e") k++;

    infix_write(s.substring(0, k), config, outbuf);

    // handle trailing zeroes

    if (s.charAt(k) === ".") {
        const i = k++;

        while (k < s.length && s.charAt(k) !== "E" && s.charAt(k) !== "e") k++;

        let j = k;

        while (s.charAt(j - 1) === "0") j--;

        if (j - i > 1) infix_write(s.substring(i, j), config, outbuf);
    }

    if (s.charAt(k) !== "E" && s.charAt(k) !== "e") return;

    k++;

    infix_write(" 10^", config, outbuf);

    if (s.charAt(k) === "-") {
        infix_write("(-", config, outbuf);
        k++;
        while (s.charAt(k) === "0")
            // skip leading zeroes
            k++;
        infix_write(s.substring(k), config, outbuf);
        infix_write(")", config, outbuf);
    } else {
        if (s.charAt(k) === "+") k++;
        while (s.charAt(k) === "0")
            // skip leading zeroes
            k++;
        infix_write(s.substring(k), config, outbuf);
    }
}

function infix_base(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    if (is_num(p)) {
        infix_numeric_base(p, env, ctrl, config, outbuf);
    } else if (is_cons(p) && (p.opr.equals(ADD) || p.opr.equals(MULTIPLY) || p.opr.equals(POWER) || p.opr.equals(FACTORIAL))) {
        infix_subexpr(p, env, ctrl, config, outbuf);
    } else {
        infix_expr(p, env, ctrl, config, outbuf);
    }
}

function infix_numeric_base(p: U, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    if (is_rat(p) && p.isPositiveInteger()) {
        infix_rational(p, config, outbuf);
    } else {
        infix_subexpr(p, env, ctrl, config, outbuf);
    }
}

// sign is not emitted

function infix_numeric_exponent(p: Num, config: InfixConfig, outbuf: string[]): void {
    if (is_flt(p)) {
        infix_write("(", config, outbuf);
        infix_double(p, config, outbuf);
        infix_write(")", config, outbuf);
        return;
    }

    if (is_rat(p) && p.isInteger()) {
        infix_rational(p, config, outbuf);
        return;
    }

    infix_write("(", config, outbuf);
    infix_rational(p, config, outbuf);
    infix_write(")", config, outbuf);
}

function infix_tensor(p: Tensor, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    infix_tensor_nib(p, 0, 0, env, ctrl, config, outbuf);
}

function infix_tensor_nib(p: Tensor, d: number, k: number, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    if (d === p.ndim) {
        infix_expr(p.elems[k], env, ctrl, config, outbuf);
        return;
    }

    let span = 1;

    let n = p.ndim;

    for (let i = d + 1; i < n; i++) {
        span *= p.dims[i];
    }

    if (config.useParenForTensors) {
        infix_write("(", config, outbuf);
    } else {
        infix_write("[", config, outbuf);
    }

    n = p.dims[d];

    for (let i = 0; i < n; i++) {
        infix_tensor_nib(p, d + 1, k, env, ctrl, config, outbuf);

        if (i < n - 1) infix_write(",", config, outbuf);

        k += span;
    }

    if (config.useParenForTensors) {
        infix_write(")", config, outbuf);
    } else {
        infix_write("]", config, outbuf);
    }
}
function infix_atom(atom: Atom, env: ProgramEnv, ctrl: ProgramControl, config: InfixConfig, outbuf: string[]): void {
    const context = new ExprContextFromProgram(env, ctrl);
    try {
        const handler = env.handlerFor(atom);
        const response = handler.dispatch(atom, native_sym(Native.infix), nil, context);
        try {
            if (is_str(response)) {
                const infix = str_to_string(response);
                infix_write(infix, config, outbuf);
            } else if (is_err(response)) {
                throw response;
            } else {
                throw new Error();
            }
        } finally {
            response.release();
        }
    } finally {
        context.release();
    }
}

export function infix_write(s: string, config: InfixConfig, outbuf: string[]): void {
    outbuf.push(s);
}
