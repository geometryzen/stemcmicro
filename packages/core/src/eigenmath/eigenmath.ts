import {
    Adapter,
    assert_num,
    assert_sym,
    assert_tensor,
    BasisBlade,
    BigInteger,
    Blade,
    create_algebra,
    create_flt,
    create_int,
    create_rat,
    create_sym,
    Err,
    Flt,
    imu,
    is_blade,
    is_boo,
    is_err,
    is_flt,
    is_imu,
    is_lambda,
    is_num,
    is_rat,
    is_str,
    is_sym,
    is_tensor,
    is_uom,
    negOne,
    Num,
    QQ,
    Rat,
    Str,
    SumTerm,
    Sym,
    Tensor
} from "@stemcmicro/atoms";
import { CompareFn, ExprContext, LambdaExpr, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { is_native, Native, native_sym } from "@stemcmicro/native";
import { assert_cons, assert_cons_or_nil, car, cdr, Cons, cons as create_cons, Cons2, is_atom, is_cons, is_nil, items_to_cons, nil, U } from "@stemcmicro/tree";
import { ExprContextFromProgram } from "../adapters/ExprContextFromProgram";
import { StackFunction } from "../adapters/StackFunction";
import { ExprEngineListener } from "../api/api";
import { contains_single_blade } from "../calculators/compare/contains_single_blade";
import { complex_comparator, complex_to_item, item_to_complex } from "../complex/complex";
import { prolog_eval_varargs } from "../dispatch/prolog_eval_varargs";
import { Directive } from "../env/ExtensionEnv";
import { StackU } from "../env/StackU";
import { guess } from "../guess";
import { convert_tensor_to_strings } from "../helpers/convert_tensor_to_strings";
import { handle_atom_atom_binop } from "../helpers/handle_atom_atom_binop";
import { predicate_return_value } from "../helpers/predicate_return_value";
import { hook_create_err } from "../hooks/hook_create_err";
import { convertMetricToNative } from "../operators/algebra/create_algebra_as_tensor";
import { hadamard } from "../operators/hadamard/stack_hadamard";
import { is_binop } from "../operators/helpers/is_binop";
import { mag } from "../operators/mag/stack_mag";
import { ProgrammingError } from "../programming/ProgrammingError";
import { is_power } from "../runtime/helpers";
import { flatten_items } from "../stack/flatten_items";
import { half, two } from "../tree/rat/Rat";
import { bignum_equal } from "./bignum_equal";
import { bignum_itoa } from "./bignum_itoa";
import { ColorCode, html_escape_and_colorize } from "./html_escape_and_colorize";
import { isdigit } from "./isdigit";
import { isdoublez } from "./isdoublez";
import { isequaln } from "./isequaln";
import { isequalq } from "./isequalq";
import { isfraction } from "./isfraction";
import { isinteger } from "./isinteger";
import { isminusone } from "./isminusone";
import { isnegativenumber } from "./isnegativenumber";
import { isnegativeterm } from "./isnegativeterm";
import { isplusone } from "./isplusone";
import { isposint } from "./isposint";
import { iszero } from "./iszero";
import { lengthf } from "./lengthf";
import { ProgramControl } from "./ProgramControl";
import { ProgramEnv } from "./ProgramEnv";
import { ProgramIO } from "./ProgramIO";
import { ProgramStack } from "./ProgramStack";

const ABS = native_sym(Native.abs);
const ARCCOS = native_sym(Native.arccos);
const ARCCOSH = native_sym(Native.arccosh);
const ARCSIN = native_sym(Native.arcsin);
const ARCSINH = native_sym(Native.arcsinh);
const ARCTAN = native_sym(Native.arctan);
const ARCTANH = native_sym(Native.arctanh);
const CEILING = create_sym("ceiling");
const COS = native_sym(Native.cos);
const COSH = native_sym(Native.cosh);
const DERIVATIVE = create_sym("derivative");
const ERF = create_sym("erf");
const ERFC = create_sym("erfc");
const EXPCOS = create_sym("expcos");
const EXPCOSH = create_sym("expcosh");
const EXPSIN = create_sym("expsin");
const EXPSINH = create_sym("expsinh");
const EXPTAN = create_sym("exptan");
const EXPTANH = create_sym("exptanh");
const FACTORIAL = create_sym("factorial");
const FLOOR = create_sym("floor");
const INTEGRAL = create_sym("integral");
const LOG = native_sym(Native.log);
const MOD = create_sym("mod");
const SGN = create_sym("sgn");
const SIN = native_sym(Native.sin);
const SINH = native_sym(Native.sinh);
const TAN = native_sym(Native.tan);
const TANH = native_sym(Native.tanh);
const TESTEQ = create_sym("testeq");
const TESTGE = create_sym("testge");
const TESTGT = create_sym("testgt");
const TESTLE = create_sym("testle");
const TESTLT = create_sym("testlt");
export const TTY = create_sym("tty");

const ADD = native_sym(Native.add);
const MULTIPLY = native_sym(Native.multiply);
const POWER = native_sym(Native.pow);
const INDEX = native_sym(Native.component);
const ASSIGN = native_sym(Native.assign);

export const LAST = create_sym("last");

const MATH_E = native_sym(Native.E);
const MATH_PI = native_sym(Native.PI);

const TRACE = create_sym("trace");

/**
 * 'd'
 */
const D_LOWER = create_sym("d");
const X_LOWER = create_sym("x");

const DOLLAR_A = create_sym("$a");
const DOLLAR_B = create_sym("$b");
const DOLLAR_X = create_sym("$x");

const ARG1 = create_sym("$1");
const ARG2 = create_sym("$2");
const ARG3 = create_sym("$3");
const ARG4 = create_sym("$4");
const ARG5 = create_sym("$5");
const ARG6 = create_sym("$6");
const ARG7 = create_sym("$7");
const ARG8 = create_sym("$8");
const ARG9 = create_sym("$9");

function alloc_tensor<T extends U>(): Tensor<T> {
    return new Tensor<T>([], []);
}

function alloc_matrix<T extends U>(nrow: number, ncol: number): Tensor<T> {
    const p = alloc_tensor<T>();
    p.dims[0] = nrow;
    p.dims[1] = ncol;
    return p;
}

function alloc_vector(n: number): Tensor {
    const p = alloc_tensor();
    p.dims[0] = n;
    return p;
}

function any_radical_factors(h: number, $: ProgramStack): 0 | 1 {
    const n = $.length;
    for (let i = h; i < n; i++) if (isradical($.getAt(i))) return 1;
    return 0;
}

function bignum_int(n: number): BigInteger {
    return new BigInteger(BigInt(n));
}

function bignum_iszero(u: BigInteger): boolean {
    return u.isZero();
}

function bignum_odd(u: BigInteger): boolean {
    return u.isOdd();
}
/*
function bignum_float(u: BigInteger): number {

    const d = u.toJSNumber();

    if (!isFinite(d)) {
        stopf("floating point nan or infinity");
    }

    return d;
}
*/
// convert bignum to int32

function bignum_smallnum(u: BigInteger): number {
    return u.toJSNumber();
}

const MAX_SMALL_INTEGER = new BigInteger(BigInt(Number.MAX_SAFE_INTEGER));
const MIN_SMALL_INTEGER = new BigInteger(BigInt(Number.MIN_SAFE_INTEGER));

function bignum_issmallnum(u: BigInteger): boolean {
    if (u.geq(MIN_SMALL_INTEGER) && u.leq(MAX_SMALL_INTEGER)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Pushes a Rat onto the stack.
 * @param sign
 * @param a
 * @param b
 */
function push_bignum(sign: 1 | -1, a: BigInteger, b: BigInteger, $: ProgramStack): void {
    // normalize zero

    if (bignum_iszero(a)) {
        sign = 1;
        if (!bignum_equal(b, 1)) {
            b = bignum_int(1);
        }
    }

    const X: Rat = sign > 0 ? new Rat(a, b) : new Rat(a.negate(), b);

    push(X, $);
}

// convert string to bignum (7 decimal digits fits in 24 bits)
function bignum_atoi(s: string): BigInteger {
    return new BigInteger(BigInt(s));
}

function bignum_cmp(u: BigInteger, v: BigInteger): 0 | 1 | -1 {
    return u.compare(v);
}
// floor(u / v)

function bignum_div(u: BigInteger, v: BigInteger): BigInteger {
    return u.divide(v);
}

function bignum_mod(u: BigInteger, v: BigInteger): BigInteger {
    return u.mod(v);
}

function bignum_pow(u: BigInteger, v: BigInteger): BigInteger {
    if (v.isNegative()) {
        throw new Error(`bignum_pow(u=${u}, v=${v}): v must be positive.`);
    }
    const result = u.pow(v);
    return result;
}

// returns null if not perfect root, otherwise returns u^(1/v)

function bignum_root(u: BigInteger, v: BigInteger): BigInteger | null {
    return u.pow(new BigInteger(BigInt(1)).divide(v));
}

function caaddr(p: U): U {
    return car(car(cdr(cdr(p))));
}

function caadr(p: U): U {
    return car(car(cdr(p)));
}

function cadaddr(p: U): U {
    return car(cdr(car(cdr(cdr(p)))));
}

function cadadr(p: U): U {
    return car(cdr(car(cdr(p))));
}

function caddddr(p: U): U {
    return car(cdr(cdr(cdr(cdr(p)))));
}

function cadddr(p: U): U {
    return car(cdr(cdr(cdr(p))));
}

function caddr(p: U): U {
    return car(cdr(cdr(p)));
}

function cadr(p: U): U {
    return car(cdr(p));
}

function cancel_factor(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    let p2 = pop($);
    const p1 = pop($);

    if (car(p2).equals(ADD)) {
        const h = $.length;
        p2 = cdr(p2);
        while (is_cons(p2)) {
            push(p1, $);
            push(car(p2), $);
            multiply(env, ctrl, $);
            p2 = cdr(p2);
        }
        sum_terms($.length - h, env, ctrl, $);
        return;
    }

    push(p1, $);
    push(p2, $);
    multiply(env, ctrl, $);
}

function cdadr(p: U): Cons {
    return cdr(car(cdr(p)));
}

function cddadr(p: U): Cons {
    return cdr(cdr(car(cdr(p))));
}

function cddddr(p: U): Cons {
    return cdr(cdr(cdr(cdr(p))));
}

function cdddr(p: U): Cons {
    return cdr(cdr(cdr(p)));
}

function cddr(p: U): Cons {
    return cdr(cdr(p));
}

function cmp(lhs: U, rhs: U): Sign {
    if (lhs === rhs) return SIGN_EQ;

    if (lhs.isnil) return SIGN_LT;

    if (rhs.isnil) return SIGN_GT;

    if (is_num(lhs) && is_num(rhs)) return cmp_numbers(lhs, rhs);

    if (is_num(lhs)) return SIGN_LT;

    if (is_num(rhs)) return SIGN_GT;

    if (is_str(lhs) && isstring(rhs)) return cmp_strings(lhs.str, rhs.str);

    if (is_str(lhs)) return SIGN_LT;

    if (is_str(rhs)) return SIGN_GT;

    if (is_sym(lhs) && is_sym(rhs)) {
        // The comparison is by namespace then localName.
        return lhs.compare(rhs);
    }

    if (is_sym(lhs)) return SIGN_LT;

    if (is_sym(rhs)) return SIGN_GT;

    if (is_tensor(lhs) && istensor(rhs)) return cmp_tensors(lhs, rhs);

    if (is_tensor(lhs)) return SIGN_LT;

    if (is_tensor(rhs)) return SIGN_GT;

    while (is_cons(lhs) && is_cons(rhs)) {
        const t = cmp(car(lhs), car(rhs));
        if (t) return t;
        lhs = cdr(lhs);
        rhs = cdr(rhs);
    }

    if (is_cons(rhs)) return SIGN_LT; // lengthf(p1) < lengthf(p2)

    if (is_cons(lhs)) return SIGN_GT; // lengthf(p1) > lengthf(p2)

    if (is_uom(lhs) && is_uom(rhs)) {
        // TODO: Perhaps there is a better way to compare?
        return cmp_strings(lhs.toString(), rhs.toString());
    }

    if (is_uom(lhs)) {
        return SIGN_LT;
    }

    if (is_uom(rhs)) {
        return SIGN_GT;
    }

    // console.lg(`cmp(lhs=${lhs}, rhs=${rhs})=>0`);
    return SIGN_EQ;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function cmp_factors(lhs: U, rhs: U): Sign {
    const a = order_factor(lhs);
    const b = order_factor(rhs);

    if (a < b) return -1;

    if (a > b) return 1;

    let base1: U;
    let base2: U;
    let expo1: U;
    let expo2: U;

    if (is_cons(lhs) && lhs.opr.equals(POWER)) {
        base1 = lhs.base;
        expo1 = lhs.expo;
    } else {
        base1 = lhs;
        expo1 = one;
    }

    if (is_cons(rhs) && rhs.opr.equals(POWER)) {
        base2 = rhs.base;
        expo2 = rhs.expo;
    } else {
        base2 = rhs;
        expo2 = one;
    }

    let c = cmp(base1, base2);

    if (c === 0) {
        c = cmp(expo2, expo1); // swapped to reverse sort order
    }

    return c;
}

function cmp_factors_provisional(p1: U, p2: U): 0 | 1 | -1 {
    if (is_cons(p1) && p1.opr.equals(POWER)) {
        p1 = p1.base;
    }

    if (is_cons(p2) && p2.opr.equals(POWER)) {
        p2 = p2.base;
    }

    return cmp(p1, p2);
}

function cmp_numbers(lhs: Num, rhs: Num): Sign {
    if (is_rat(lhs) && is_rat(rhs)) {
        return lhs.compare(rhs);
    }

    const d1 = assert_num_to_number(lhs);

    const d2 = assert_num_to_number(rhs);

    if (d1 < d2) {
        return SIGN_LT;
    }

    if (d1 > d2) {
        return SIGN_GT;
    }

    return SIGN_EQ;
}

// this way matches strcmp (localeCompare differs from strcmp)
function cmp_strings(s1: string, s2: string): 0 | 1 | -1 {
    if (s1 < s2) return -1;
    if (s1 > s2) return 1;
    return 0;
}

function cmp_tensors(p1: Tensor, p2: Tensor): 1 | 0 | -1 {
    const t = p1.ndim - p2.ndim;

    if (t) return t > 0 ? 1 : t < 0 ? -1 : 0;

    for (let i = 0; i < p1.ndim; i++) {
        const t = p1.dims[i] - p2.dims[i];
        if (t) return t > 0 ? 1 : t < 0 ? -1 : 0;
    }

    for (let i = 0; i < p1.nelem; i++) {
        const t = cmp(p1.elems[i], p2.elems[i]);
        if (t) return t;
    }

    return 0;
}
// push coefficients of polynomial P(X) on stack

function coeffs(P: U, X: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    for (;;) {
        push(P, $); //  [..., P(x)]
        push(X, $); //  [..., P(x), X]
        push_integer(0, $); //  [..., P(x), X, 0]
        subst($); //  [..., P(0)]
        value_of(env, ctrl, $);
        const C = pop($); //  [...]

        push(C, $); //  [..., P(0)]

        push(P, $); //  [..., P(0), P(x)]
        push(C, $); //  [..., P(0), P(x), P(0)]
        subtract(env, ctrl, $); //  [..., P(0), P(x)-P(0)]
        P = pop($); //  [..., P(0)]

        if (iszero(P, env)) {
            break;
        }

        push(P, $); //  [..., P(0), P(x)-P(0)]
        push(X, $); //  [..., P(0), P(x)-P(0), x]
        divide(env, ctrl, $); //  [..., P(0), (P(x)-P(0))/x]
        P = pop($); //  [..., P(0)]
    }
}

function combine_factors(start: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    sort_factors_provisional(start, $);
    let n = $.length;
    for (let i = start; i < n - 1; i++) {
        if (combine_factors_nib(i, i + 1, env, ctrl, $)) {
            $.splice(i + 1, 1); // remove factor
            i--; // use same index again
            n--;
        }
    }
}

function combine_factors_nib(i: number, j: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): 0 | 1 {
    let BASE1: U;
    let EXPO1: U;
    let BASE2: U;
    let EXPO2: U;

    const p1 = $.getAt(i);
    const p2 = $.getAt(j);

    if (is_cons(p1) && p1.opr.equals(POWER)) {
        BASE1 = p1.base;
        EXPO1 = p1.expo;
    } else {
        BASE1 = p1;
        EXPO1 = one;
    }

    if (car(p2).equals(POWER)) {
        BASE2 = cadr(p2);
        EXPO2 = caddr(p2);
    } else {
        BASE2 = p2;
        EXPO2 = one;
    }

    // console.lg(`BASE1=${BASE1}, BASE2=${BASE2}`);
    if (!equal(BASE1, BASE2)) {
        return 0;
    }

    // console.lg(`BASE1=${BASE1}, BASE2=${BASE2} are considered EQUAL`);

    if (is_flt(BASE2)) BASE1 = BASE2; // if mixed rational and double, use double

    push(POWER, $);
    push(BASE1, $);
    push(EXPO1, $);
    push(EXPO2, $);
    add(env, ctrl, $);
    list(3, $);

    $.setAt(i, pop($));

    return 1;
}

function combine_numerical_factors(start: number, coeff: Num | Err, $: ProgramStack): Num | Err {
    let end = $.length;

    for (let i = start; i < end; i++) {
        const x = $.getAt(i);

        if (is_num(x)) {
            if (is_num(coeff)) {
                multiply_numbers(coeff, x, $); //  [..., a, b, c, coeff * x], assume i points to a
                coeff = pop($) as Num; //  [..., a, b, c]
                $.splice(i, 1); // remove factor        //  [..., b, c]
                i--; //  [..., b, c],                i points to element before b
                end--;
            } else {
                $.splice(i, 1); // remove factor
                i--;
                end--;
            }
        } else if (is_err(x)) {
            coeff = x;
            $.splice(i, 1); // remove factor
            i--;
            end--;
        }
    }

    return coeff;
}

function compatible_dimensions(p1: U, p2: U): 0 | 1 {
    if (!istensor(p1) && !istensor(p2)) return 1; // both are scalars

    if (!istensor(p1) || !istensor(p2)) return 0; // scalar and tensor

    const n = p1.ndim;

    if (n !== p2.ndim) return 0;

    for (let i = 0; i < n; i++) if (p1.dims[i] !== p2.dims[i]) return 0;

    return 1;
}

/**
 * Used in simplify functions to assess progress.
 * complexity(Atom) => 1
 * complexity(Nil)  => 0
 * complexity(Cons) => Sum of complexity of each item.
 */
export function complexity(expr: U): number {
    if (is_nil(expr)) {
        return 0;
    } else if (is_cons(expr)) {
        const head = expr.head;
        const rest = expr.rest;
        try {
            return complexity(head) + complexity(rest);
        } finally {
            head.release();
            rest.release();
        }
    } else {
        // Atoms have complexity of 1
        return 1;
    }
}

/**
 * The stack is reduced as follows...
 *
 * -----
 * | b |
 * ----- => --------------
 * | a |    | Cons(a, b) |
 * -----    --------------
 * | X |    |      X     |
 * -----    --------------
 *
 * b must be cons or nil.
 */
export function cons($: Pick<ProgramStack, "push" | "pop">): void {
    const b = assert_cons_or_nil(pop($));
    const a = pop($);
    try {
        push(create_cons(a, b), $);
    } finally {
        a.release();
        b.release();
    }
}

export function copy_tensor<T extends U>(source: Tensor<T>): Tensor<T> {
    const dst = alloc_tensor<T>();

    const ndim = source.ndim;

    for (let i = 0; i < ndim; i++) {
        dst.dims[i] = source.dims[i];
    }

    const nelem = source.nelem;

    for (let i = 0; i < nelem; i++) {
        dst.elems[i] = source.elems[i];
    }

    return dst;
}

function decomp(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack) {
    const X = pop($);
    const F = pop($);

    // is the entire expression constant?

    if (!findf(F, X)) {
        push(F, $);
        return;
    }

    // sum?

    if (car(F).equals(ADD)) {
        decomp_sum(F, X, env, ctrl, $);
        return;
    }

    // product?

    if (car(F).equals(MULTIPLY)) {
        decomp_product(F, X, env, ctrl, $);
        return;
    }

    // naive decomp

    let p1 = cdr(F);
    while (is_cons(p1)) {
        push(car(p1), $);
        push(X, $);
        decomp(env, ctrl, $);
        p1 = cdr(p1);
    }
}

function decomp_sum(F: U, X: U, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): void {
    let p2: U;

    const N = _.length;

    // partition terms

    let xs: U = cdr(F);

    while (is_cons(xs)) {
        p2 = car(xs);
        if (findf(p2, X)) {
            if (car(p2).equals(MULTIPLY)) {
                push(p2, _);
                push(X, _);
                partition_term(_); // push const part then push var part
            } else {
                push_integer(1, _); // const part
                push(p2, _); // var part
            }
        }
        xs = cdr(xs);
    }

    // combine const parts of matching var parts

    let end = _.length - N;

    for (let i = 0; i < end - 2; i += 2)
        for (let j = i + 2; j < end; j += 2) {
            if (!equal(_.getAt(N + i + 1), _.getAt(N + j + 1))) {
                continue;
            }
            _.push(_.getAt(N + i)); // add const parts
            _.push(_.getAt(N + j));
            sum_terms(2, env, ctrl, _);
            _.setAt(N + i, pop(_));
            for (let k = j; k < end - 2; k++) _.setAt(N + k, _.getAt(N + k + 2));
            j -= 2; // use same j again
            end -= 2;
            _.splice(_.length - 2); // pop
        }

    // push const parts, decomp var parts

    list(_.length - N, _);
    let parts = _.pop();

    while (is_cons(parts)) {
        push(car(parts), _); // const part
        push(cadr(parts), _); // var part
        push(X, _);
        decomp(env, ctrl, _);
        parts = cddr(parts);
    }

    // add together all constant terms

    const h = _.length;
    let terms = cdr(F);
    while (is_cons(terms)) {
        if (!findf(car(terms), X)) {
            _.push(car(terms));
        }
        terms = terms.rest;
    }

    const n = _.length - h;

    if (n > 1) {
        list(n, _);
        _.push(ADD);
        _.swap();
        cons(_); // makes ADD head of list
    }
}

function decomp_product(F: U, X: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    // decomp factors involving x

    let p1 = cdr(F);
    while (is_cons(p1)) {
        if (findf(car(p1), X)) {
            push(car(p1), $);
            push(X, $);
            decomp(env, ctrl, $);
        }
        p1 = cdr(p1);
    }

    // combine constant factors

    const h = $.length;
    p1 = cdr(F);
    while (is_cons(p1)) {
        if (!findf(car(p1), X)) {
            push(car(p1), $);
        }
        p1 = cdr(p1);
    }

    const n = $.length - h;

    if (n > 1) {
        list(n, $);
        push(MULTIPLY, $);
        swap($);
        cons($); // makes MULTIPLY head of list
    }
}

/**
 * [..., a, b] => [..., a * (1/b)]
 */
export function divide(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    //                                          [..., a, b]
    reciprocate(env, ctrl, $); //  [..., a, 1/b]
    multiply_factors(2, env, ctrl, $); //  [..., a/b]
}

function dupl($: ProgramStack): void {
    const expr = pop($);
    try {
        push(expr, $);
        push(expr, $);
    } finally {
        expr.release();
    }
}

function equal(lhs: U, rhs: U): boolean {
    return cmp(lhs, rhs) === 0;
}

export function stack_abs(expr: U, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): void {
    _.push(expr);
    _.rest();
    _.head();
    value_of(env, ctrl, _);
    absfunc(env, ctrl, _);
}

export function absfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const x = pop($);
    try {
        if (is_atom(x)) {
            const handler = env.handlerFor(x);
            const retval = handler.dispatch(x, ABS, nil, new ExprContextFromProgram(env, ctrl));
            try {
                $.push(retval);
                return;
            } finally {
                retval.release();
            }
            /*
            if (is_num(x)) {
                push(x, $);
                if (isnegativenumber(x)) {
                    negate(env, ctrl, $);
                }
                return;
            }
            if (is_tensor(x)) {
                if (x.ndim > 1) {
                    push(ABS, $);
                    push(x, $);
                    list(2, $);
                    return;
                }
                push(x, $);
                push(x, $);
                conjfunc(env, ctrl, $);
                inner(env, ctrl, $);
                push_rational(1, 2, $);
                power(env, ctrl, $);
                return;
            }
            if (is_uom(x)) {
                push(x, $);
                return;
            }
            */
        }

        push(x, $);
        push(x, $);
        conjfunc(env, ctrl, $);
        multiply(env, ctrl, $);
        push_rational(1, 2, $);
        power(env, ctrl, $);

        const p2 = pop($);
        push(p2, $);
        floatfunc(env, ctrl, $);
        const p3 = pop($);
        if (is_flt(p3)) {
            push(p2, $);
            if (isnegativenumber(p3)) negate(env, ctrl, $);
            return;
        }

        // abs(1/a) evaluates to 1/abs(a)

        if (car(x).equals(POWER) && isnegativeterm(caddr(x))) {
            push(x, $);
            reciprocate(env, ctrl, $);
            absfunc(env, ctrl, $);
            reciprocate(env, ctrl, $);
            return;
        }

        // abs(a*b) evaluates to abs(a)*abs(b)

        if (car(x).equals(MULTIPLY)) {
            const h = $.length;
            let p1 = cdr(x);
            while (is_cons(p1)) {
                push(car(p1), $);
                absfunc(env, ctrl, $);
                p1 = cdr(p1);
            }
            multiply_factors($.length - h, env, ctrl, $);
            return;
        }

        if (isnegativeterm(x) || (car(x).equals(ADD) && isnegativeterm(cadr(x)))) {
            push(x, $);
            negate(env, ctrl, $);
            const X = pop($);
            push(ABS, $);
            push(X, $);
            list(2, $);
        } else {
            push(ABS, $);
            push(x, $);
            list(2, $);
        }
    } finally {
        x.release();
    }
}

/**
 * [..., (x1 x2 ... xn)] => [..., v1, v2, ..., vn] where (v1 v2 ... vn) are the values of (x1 x2 ... xn).
 *
 * @returns n, the number of values in the list (x1 x2 ... xn)
 */
export function value_of_args(env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): number {
    const L0 = _.length; // [..., (x1 x2 ... xn)]
    while (_.iscons) {
        _.dupl(); // [..., (x1 x2 ... xn), (x1 x2 ... xn)]
        _.head(); // [..., (x1 x2 ... xn), x1]
        value_of(env, ctrl, _); // [..., (x1 x2 ... xn), v1]
        _.swap(); // [..., v1, (x1 x2 ... xn)]
        _.rest(); // [..., v1, (x2 x3 ... xn)]
    }
    //                                 [..., v1, v2, ..., vn, nil]
    // We must drop the final nil, releasing it isn't really needed.
    _.pop().release(); // [..., v1, v2, ..., vn]
    return _.length - L0 + 1; // Adding 1 because we replaced the (x1 x2 ... xn)
}

export function assert_stack_length(expectedLength: number, _: ProgramStack): void | never {
    if (_.length !== expectedLength) {
        throw new ProgrammingError(`expected stack length, ${expectedLength}, does not match actual ${_.length}`);
    }
}

/**
 * [...] => [..., X], where X is the sum of the evaluated terms, (x1 x2 x3 ... xn).
 */
export function stack_add(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): void {
    ctrl.pushDirective(Directive.expanding, ctrl.getDirective(Directive.expanding) - 1);
    try {
        const L0 = _.length; // [...]
        // By pushing the identity element for addition, zero, we ensure (+) evaluates to zero.
        _.push(zero); // [..., 0]
        _.push(expr); // [..., 0, (+ x1 x2 ... xn)]
        _.rest(); // [..., 0, (x1 x2 ... xn)]
        const n = value_of_args(env, ctrl, _); // [..., 0, v1, v2, ..., vn]
        sum_terms(n + 1, env, ctrl, _); // [..., X]
        assert_stack_length(L0 + 1, _);
    } finally {
        ctrl.popDirective();
    }
}

/**
 * @deprecated Use sum_terms(2) instead
 */
export function add(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    sum_terms(2, env, ctrl, $);
}

/**
 * [..., v1, v2, ..., vn] => [..., X] where X is the sum of v1 through vn
 */
export function sum_terms(n: number, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): void {
    if (n < 0) {
        throw new ProgrammingError(`n => ${n}`);
    }

    const start = _.length - n;

    flatten_items(start, ADD, _);

    const sigma = sum_tensors(start, env, ctrl, _);

    combine_terms(start, env, ctrl, _);

    if (simplify_terms(start, env, ctrl, _)) {
        combine_terms(start, env, ctrl, _);
    }

    const k = _.length - start;

    if (k === 0) {
        _.push(sigma);
        return;
    }

    if (k > 1) {
        list(k, _);
        _.push(ADD);
        _.swap();
        cons(_); // prepend ADD to list
    }

    if (istensor(sigma)) {
        const p1 = _.pop();

        const T = copy_tensor(sigma);

        const nelem = T.nelem;

        for (let i = 0; i < nelem; i++) {
            _.push(T.elems[i]);
            _.push(p1);
            sum_terms(2, env, ctrl, _);
            T.elems[i] = pop(_);
        }

        _.push(T);
    }
}

export function sum_atoms(start: number, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): Tensor {
    let T: U = nil;
    for (let i = start; i < _.length; i++) {
        const p1 = _.getAt(i);
        if (is_atom(p1)) {
            if (is_atom(T)) {
                push(T, _);
                push(p1, _);
                add_2_tensors(env, ctrl, _);
                T = pop(_);
            } else {
                T = p1;
            }
            _.splice(i, 1);
            i--; // use same index again
        }
    }
    return T as Tensor;
}

export function sum_tensors(start: number, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): Rat | Tensor {
    let sum: Rat | Tensor = zero;
    for (let i = start; i < _.length; i++) {
        const rhs = _.getAt(i);
        if (is_tensor(rhs)) {
            if (is_tensor(sum)) {
                push(sum, _);
                push(rhs, _);
                add_2_tensors(env, ctrl, _);
                sum = assert_tensor(pop(_));
            } else {
                sum = rhs;
            }
            _.splice(i, 1);
            i--; // use same index again
        }
    }
    return sum;
}

/**
 * [..., A, B] => [..., (+ A B)]
 */
function add_2_tensors(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    //                              [..., A, B]
    const B = pop($) as Tensor; //  [..., A]
    const A = pop($) as Tensor; //  [...]

    if (!compatible_dimensions(A, B)) {
        stopf("incompatible tensor arithmetic");
    }

    const C = copy_tensor(A);

    const n = C.nelem;

    for (let i = 0; i < n; i++) {
        push(A.elems[i], $);
        push(B.elems[i], $);
        sum_terms(2, env, ctrl, $);
        C.elems[i] = pop($);
    }

    push(C, $); //  [..., (+ A B)]
}

export function combine_terms(start: number, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): void {
    sort_terms(start, ctrl, _);
    for (let i = start; i < _.length - 1; i++) {
        if (combine_terms_nib(i, i + 1, env, ctrl, _)) {
            if (iszero(_.getAt(i), env))
                _.splice(i, 2); // remove 2 terms
            else _.splice(i + 1, 1); // remove 1 term
            i--; // use same index again
        }
    }
    if (start < _.length && iszero(_.getAt(_.length - 1), env)) {
        _.pop();
    }
}

function combine_terms_nib(i: number, j: number, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): boolean {
    const lhs = _.getAt(i);
    const rhs = _.getAt(j);

    // console.lg("combine_terms_nib", `${lhs}`, `${rhs}`);

    if (is_atom(lhs) && is_atom(rhs)) {
        // const expr = items_to_cons(native_sym(Native.add), lhs, rhs);
        // const sum = env.valueOf(expr);
        // throw new ProgrammingError();
    }

    // We really can't do this properly without appealing to some
    if (iszero(rhs, env)) {
        return true;
    }

    if (iszero(lhs, env)) {
        _.setAt(i, rhs);
        return true;
    }

    if (is_num(lhs) && is_num(rhs)) {
        add_numbers(lhs, rhs, _);
        _.setAt(i, pop(_));
        return true;
    }

    if (is_num(lhs) || is_num(rhs)) {
        return false; // cannot add number and something else
    }

    let coeff1: Num = one;
    let coeff2: Num = one;

    let denorm = 0;

    let p1 = lhs;
    if (car(lhs).equals(MULTIPLY)) {
        p1 = cdr(lhs);
        denorm = 1;
        const head = car(p1);
        if (is_num(head)) {
            coeff1 = head;
            p1 = cdr(p1);
            if (cdr(p1).isnil) {
                p1 = car(p1);
                denorm = 0;
            }
        }
    }

    let p2 = rhs;
    if (car(rhs).equals(MULTIPLY)) {
        p2 = cdr(rhs);
        const head = car(p2);
        if (is_num(head)) {
            coeff2 = head;
            p2 = cdr(p2);
            if (cdr(p2).isnil) p2 = car(p2);
        }
    }

    if (!equal(p1, p2)) {
        return false;
    }

    add_numbers(coeff1, coeff2, _);

    coeff1 = assert_num(pop(_));

    if (iszero(coeff1, env)) {
        _.setAt(i, coeff1);
        return true;
    }

    if (isplusone(coeff1) && !is_flt(coeff1)) {
        if (denorm) {
            push(MULTIPLY, _);
            push(p1, _); // p1 is a list, not an atom
            cons(_); // prepend MULTIPLY
        } else push(p1, _);
    } else {
        if (denorm) {
            push(MULTIPLY, _);
            push(coeff1, _);
            push(p1, _); // p1 is a list, not an atom
            cons(_); // prepend coeff1
            cons(_); // prepend MULTIPLY
        } else {
            push(MULTIPLY, _);
            push(coeff1, _);
            push(p1, _);
            list(3, _);
        }
    }

    _.setAt(i, pop(_));

    return true;
}

function sort_terms(start: number, ctrl: ProgramControl, $: ProgramStack): void {
    const compareFn = ctrl.compareFn(native_sym(Native.add));
    const sorted: U[] = $.splice(start).sort(compareFn);
    $.concat(sorted);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function make_terms_compare_fn(compareFactors: CompareFn): CompareFn {
    return function (lhs: U, rhs: U): Sign {
        // 1st level: imaginary terms on the right

        let a = isimaginaryterm(lhs);
        let b = isimaginaryterm(rhs);

        if (a === 0 && b === 1) return SIGN_LT; // ok

        if (a === 1 && b === 0) return SIGN_GT; // out of order

        // 2nd level: numericals on the right

        if (is_num(lhs) && is_num(rhs)) return SIGN_EQ; // don't care about order, save time, don't compare

        if (is_num(lhs)) return SIGN_GT; // out of order

        if (is_num(rhs)) return SIGN_LT; // ok

        // 3rd level: sort by factors

        a = 0;
        b = 0;

        if (car(lhs).equals(MULTIPLY)) {
            lhs = cdr(lhs);
            a = 1; // p1 is a list of factors
            if (is_num(car(lhs))) {
                // skip over coeff
                lhs = cdr(lhs);
                if (cdr(lhs).isnil) {
                    lhs = car(lhs);
                    a = 0;
                }
            }
        }

        if (car(rhs).equals(MULTIPLY)) {
            rhs = cdr(rhs);
            b = 1; // p2 is a list of factors
            if (is_num(car(rhs))) {
                // skip over coeff
                rhs = cdr(rhs);
                if (cdr(rhs).isnil) {
                    rhs = car(rhs);
                    b = 0;
                }
            }
        }

        if (a === 0 && b === 0) return compareFactors(lhs, rhs);

        if (a === 0 && b === 1) {
            let c: Sign = compareFactors(lhs, car(rhs));
            if (c === SIGN_EQ) {
                c = SIGN_LT; // lengthf(p1) < lengthf(p2)
            }
            return c;
        }

        if (a === 1 && b === 0) {
            let c = compareFactors(car(lhs), rhs);
            if (c === SIGN_EQ) c = SIGN_GT; // lengthf(p1) > lengthf(p2)
            return c;
        }

        while (is_cons(lhs) && is_cons(rhs)) {
            const c: Sign = compareFactors(car(lhs), car(rhs));
            if (c) return c;
            lhs = cdr(lhs);
            rhs = cdr(rhs);
        }

        if (is_cons(lhs)) return SIGN_GT; // lengthf(p1) > lengthf(p2)

        if (is_cons(rhs)) return SIGN_LT; // lengthf(p1) < lengthf(p2)

        return SIGN_EQ;
    };
}

export function simplify_terms(h: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): number {
    let n = 0;
    for (let i = h; i < $.length; i++) {
        const p1 = $.getAt(i);
        if (isradicalterm(p1)) {
            push(p1, $);
            value_of(env, ctrl, $);
            const p2 = pop($);
            if (!equal(p1, p2)) {
                $.setAt(i, p2);
                n++;
            }
        }
    }
    return n;
}

function isradicalterm(p: U): boolean {
    return car(p).equals(MULTIPLY) && is_num(cadr(p)) && isradical(caddr(p));
}

function isimaginaryterm(p: U): 0 | 1 {
    if (isimaginaryfactor(p)) return 1;
    if (car(p).equals(MULTIPLY)) {
        p = cdr(p);
        while (is_cons(p)) {
            if (isimaginaryfactor(car(p))) return 1;
            p = cdr(p);
        }
    }
    return 0;
}

function isimaginaryfactor(p: U): boolean | 0 {
    return car(p).equals(POWER) && isminusone(cadr(p));
}

function add_numbers(lhs: Num, rhs: Num, $: Pick<ProgramStack, "push">): void {
    if (is_rat(lhs) && is_rat(rhs)) {
        add_rationals(lhs, rhs, $);
        return;
    }

    const a = assert_num_to_number(lhs);

    const b = assert_num_to_number(rhs);

    push_double(a + b, $);
}

function add_rationals(lhs: Rat, rhs: Rat, _: Pick<ProgramStack, "push">): void {
    const sum = lhs.add(rhs);
    push(sum, _);
}

export function stack_adj(p1: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    adj(env, ctrl, $);
}

function adj(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (!istensor(p1)) {
        push_integer(1, $); // adj of scalar is 1 because adj = det inv
        return;
    }

    if (!issquarematrix(p1)) stopf("adj: square matrix expected");

    const n = p1.dims[0];

    // p2 is the adjunct matrix

    const p2 = alloc_matrix(n, n);

    if (n === 2) {
        p2.elems[0] = p1.elems[3];
        push(p1.elems[1], $);
        negate(env, ctrl, $);
        p2.elems[1] = pop($);
        push(p1.elems[2], $);
        negate(env, ctrl, $);
        p2.elems[2] = pop($);
        p2.elems[3] = p1.elems[0];
        push(p2, $);
        return;
    }

    // p3 is for computing cofactors

    const p3 = alloc_matrix(n - 1, n - 1);

    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            let k = 0;
            for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== row && j !== col) p3.elems[k++] = p1.elems[n * i + j];
            push(p3, $);
            det(env, ctrl, $);
            if ((row + col) % 2) negate(env, ctrl, $);
            p2.elems[n * col + row] = pop($); // transpose
        }
    }

    push(p2, $);
}

export function stack_algebra(expr: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(assert_cons(expr).item(1), $);
    value_of(env, ctrl, $);
    const metric = pop($);
    if (!is_tensor(metric)) {
        stopf("");
    }
    push(assert_cons(expr).item(2), $);
    value_of(env, ctrl, $);
    const labels = pop($);
    if (!is_tensor(labels)) {
        stopf("");
    }
    push_algebra_tensor(metric, labels, $);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function push_algebra_tensor(metric: Tensor<U>, labels: Tensor<U>, $: ProgramStack): void {
    const metricNative: U[] = convertMetricToNative(metric);
    const labelsNative: string[] = convert_tensor_to_strings(labels);
    const T: Tensor<U> = create_algebra_as_tensor(metricNative, labelsNative);
    push(T, $);
}

class AlgebraFieldAdapter implements Adapter<U, U> {
    constructor(private readonly dimensions: number) {}
    get ε(): U {
        return create_flt(1e-6);
    }
    get one(): U {
        return one;
    }
    get zero(): U {
        return zero;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    abs(arg: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    add(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sub(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eq(lhs: U, rhs: U): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ne(lhs: U, rhs: U): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    le(lhs: U, rhs: U): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    lt(lhs: U, rhs: U): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ge(lhs: U, rhs: U): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    gt(lhs: U, rhs: U): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    max(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    min(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mul(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    div(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    neg(arg: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asString(arg: U): string {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cos(arg: U): U {
        throw new Error("Method not implemented.");
    }
    isField(arg: U | BasisBlade<U, U>): arg is U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOne(arg: U): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isZero(arg: U): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sin(arg: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sqrt(arg: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isDimension(arg: U): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dim(arg: U): number {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sum(terms: SumTerm<U, U>[]): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extractGrade(arg: U, grade: number): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    treeAdd(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    treeLco(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    treeMul(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    treeScp(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    treeSqrt(arg: U): U {
        throw new Error("Method not implemented.");
    }
    treeZero(): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    weightToTree(arg: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    scalarCoordinate(arg: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bladeToTree(blade: BasisBlade<U, U>): U {
        throw new Error("Method not implemented.");
    }
}

function create_algebra_as_tensor<T extends U>(metric: T[], labels: string[]): Tensor<U> {
    const uFieldAdaptor = new AlgebraFieldAdapter(metric.length);
    const GA = create_algebra(metric, uFieldAdaptor, labels);
    /**
     * Number of basis vectors in algebra is dimensionality.
     */
    const dimensions = metric.length;
    const dims = [metric.length];
    const elems = new Array<Blade>(dimensions);
    for (let index = 0; index < dimensions; index++) {
        elems[index] = GA.unit(index);
    }
    return new Tensor(dims, elems);
}

export function stack_and(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    p1 = cdr(p1);
    while (is_cons(p1)) {
        push(car(p1), $);
        evalp(env, ctrl, $);
        const p2 = pop($);
        if (iszero(p2, env)) {
            push_integer(0, $);
            return;
        }
        p1 = cdr(p1);
    }
    push_integer(1, $);
}

/**
 * Evaluates the given expression in the specified context and returns the result.
 * @param expression The expression to be evaluated.
 * @param $ The expression context.
 */
export function evaluate_expression(expression: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): U {
    push(expression, $);
    value_of(env, ctrl, $);
    return pop($);
}

export function stack_arccos(p1: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack) {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    arccos(env, ctrl, $);
}

function arccos(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        const T = copy_tensor(p1);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(T.elems[i], $);
            arccos(env, ctrl, $);
            T.elems[i] = pop($);
        }
        push(T, $);
        return;
    }

    if (is_flt(p1)) {
        let d = p1.toNumber();
        if (-1.0 <= d && d <= 1.0) {
            d = Math.acos(d);
            push_double(d, $);
            return;
        }
    }

    // arccos(z) = -i log(z + i sqrt(1 - z^2))

    if (is_flt(p1) || isdoublez(p1)) {
        push_double(1.0, $);
        push(p1, $);
        push(p1, $);
        multiply(env, ctrl, $);
        subtract(env, ctrl, $);
        sqrtfunc(env, ctrl, $);
        push(imu, $);
        multiply(env, ctrl, $);
        push(p1, $);
        add(env, ctrl, $);
        logfunc(env, ctrl, $);
        push(imu, $);
        multiply(env, ctrl, $);
        negate(env, ctrl, $);
        return;
    }

    // arccos(1 / sqrt(2)) = 1/4 pi

    if (isoneoversqrttwo(p1)) {
        push_rational(1, 4, $);
        push(MATH_PI, $);
        multiply(env, ctrl, $);
        return;
    }

    // arccos(-1 / sqrt(2)) = 3/4 pi

    if (isminusoneoversqrttwo(p1)) {
        push_rational(3, 4, $);
        push(MATH_PI, $);
        multiply(env, ctrl, $);
        return;
    }

    // arccos(0) = 1/2 pi

    if (iszero(p1, env)) {
        push_rational(1, 2, $);
        push(MATH_PI, $);
        multiply(env, ctrl, $);
        return;
    }

    // arccos(1/2) = 1/3 pi

    if (isequalq(p1, 1, 2)) {
        push_rational(1, 3, $);
        push(MATH_PI, $);
        multiply(env, ctrl, $);
        return;
    }

    // arccos(1) = 0

    if (isplusone(p1)) {
        push_integer(0, $);
        return;
    }

    // arccos(-1/2) = 2/3 pi

    if (isequalq(p1, -1, 2)) {
        push_rational(2, 3, $);
        push(MATH_PI, $);
        multiply(env, ctrl, $);
        return;
    }

    // arccos(-1) = pi

    if (isminusone(p1)) {
        push(MATH_PI, $);
        return;
    }

    push(ARCCOS, $);
    push(p1, $);
    list(2, $);
}

export function stack_arccosh(p1: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    arccosh(env, ctrl, $);
}

function arccosh(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        const T = copy_tensor(p1);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(T.elems[i], $);
            arccosh(env, ctrl, $);
            T.elems[i] = pop($);
        }
        push(T, $);
        return;
    }

    if (is_flt(p1)) {
        let d = p1.toNumber();
        if (d >= 1.0) {
            d = Math.acosh(d);
            push_double(d, $);
            return;
        }
    }

    // arccosh(z) = log(sqrt(z^2 - 1) + z)

    if (is_flt(p1) || isdoublez(p1)) {
        push(p1, $);
        push(p1, $);
        multiply(env, ctrl, $);
        push_double(-1.0, $);
        add(env, ctrl, $);
        sqrtfunc(env, ctrl, $);
        push(p1, $);
        add(env, ctrl, $);
        logfunc(env, ctrl, $);
        return;
    }

    if (isplusone(p1)) {
        push_integer(0, $);
        return;
    }

    if (car(p1).equals(COSH)) {
        push(cadr(p1), $);
        return;
    }

    push(ARCCOSH, $);
    push(p1, $);
    list(2, $);
}

export function stack_arcsin(p1: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    arcsin(env, ctrl, $);
}

function arcsin(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        const T = copy_tensor(p1);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(T.elems[i], $);
            arcsin(env, ctrl, $);
            T.elems[i] = pop($);
        }
        push(T, $);
        return;
    }

    if (is_flt(p1)) {
        let d = p1.toNumber();
        if (-1.0 <= d && d <= 1.0) {
            d = Math.asin(d);
            push_double(d, $);
            return;
        }
    }

    // arcsin(z) = -i log(i z + sqrt(1 - z^2))

    if (is_flt(p1) || isdoublez(p1)) {
        push(imu, $);
        negate(env, ctrl, $);
        push(imu, $);
        push(p1, $);
        multiply(env, ctrl, $);
        push_double(1.0, $);
        push(p1, $);
        push(p1, $);
        multiply(env, ctrl, $);
        subtract(env, ctrl, $);
        sqrtfunc(env, ctrl, $);
        add(env, ctrl, $);
        logfunc(env, ctrl, $);
        multiply(env, ctrl, $);
        return;
    }

    // arcsin(-x) = -arcsin(x)

    if (isnegativeterm(p1)) {
        push(p1, $);
        negate(env, ctrl, $);
        arcsin(env, ctrl, $);
        negate(env, ctrl, $);
        return;
    }

    // arcsin(1 / sqrt(2)) = 1/4 pi

    if (isoneoversqrttwo(p1)) {
        push_rational(1, 4, $);
        push(MATH_PI, $);
        multiply(env, ctrl, $);
        return;
    }

    // arcsin(0) = 0

    if (iszero(p1, env)) {
        push_integer(0, $);
        return;
    }

    // arcsin(1/2) = 1/6 pi

    if (isequalq(p1, 1, 2)) {
        push_rational(1, 6, $);
        push(MATH_PI, $);
        multiply(env, ctrl, $);
        return;
    }

    // arcsin(1) = 1/2 pi

    if (isplusone(p1)) {
        push_rational(1, 2, $);
        push(MATH_PI, $);
        multiply(env, ctrl, $);
        return;
    }

    push(ARCSIN, $);
    push(p1, $);
    list(2, $);
}

export function stack_arcsinh(p1: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    arcsinh(env, ctrl, $);
}

function arcsinh(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        const T = copy_tensor(p1);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(T.elems[i], $);
            arcsinh(env, ctrl, $);
            T.elems[i] = pop($);
        }
        push(T, $);
        return;
    }

    if (is_flt(p1)) {
        let d = p1.toNumber();
        d = Math.asinh(d);
        push_double(d, $);
        return;
    }

    // arcsinh(z) = log(sqrt(z^2 + 1) + z)

    if (isdoublez(p1)) {
        push(p1, $);
        push(p1, $);
        multiply(env, ctrl, $);
        push_double(1.0, $);
        add(env, ctrl, $);
        sqrtfunc(env, ctrl, $);
        push(p1, $);
        add(env, ctrl, $);
        logfunc(env, ctrl, $);
        return;
    }

    if (iszero(p1, env)) {
        push(p1, $);
        return;
    }

    // arcsinh(-x) = -arcsinh(x)

    if (isnegativeterm(p1)) {
        push(p1, $);
        negate(env, ctrl, $);
        arcsinh(env, ctrl, $);
        negate(env, ctrl, $);
        return;
    }

    if (car(p1).equals(SINH)) {
        push(cadr(p1), $);
        return;
    }

    push(ARCSINH, $);
    push(p1, $);
    list(2, $);
}

/**
 * (arctan y x)
 */
export function stack_arctan(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const y = expr.item1;
    const x = expr.item2;
    push(y, $);
    value_of(env, ctrl, $);
    if (is_cons(cddr(expr))) {
        push(x, $);
        value_of(env, ctrl, $);
    } else {
        push_integer(1, $);
    }
    arctan(env, ctrl, $);
}

function arctan(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const x = pop($);
    const y = pop($);

    if (is_tensor(y)) {
        const T = copy_tensor(y);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(T.elems[i], $);
            push(x, $);
            arctan(env, ctrl, $);
            T.elems[i] = pop($);
        }
        push(T, $);
        return;
    }

    if (is_num(x) && is_num(y)) {
        eigenmath_arctan_numbers(x, y, env, ctrl, $);
        return;
    }

    // arctan(z) = -1/2 i log((i - z) / (i + z))

    if (!iszero(x, env) && (isdoublez(x) || isdoublez(y))) {
        push(y, $);
        push(x, $);
        divide(env, ctrl, $);
        const Z = pop($);
        push_double(-0.5, $);
        push(imu, $);
        multiply(env, ctrl, $);
        push(imu, $);
        push(Z, $);
        subtract(env, ctrl, $);
        push(imu, $);
        push(Z, $);
        add(env, ctrl, $);
        divide(env, ctrl, $);
        logfunc(env, ctrl, $);
        multiply(env, ctrl, $);
        return;
    }

    // arctan(-y,x) = -arctan(y,x)

    if (isnegativeterm(y)) {
        push(y, $);
        negate(env, ctrl, $);
        push(x, $);
        arctan(env, ctrl, $);
        negate(env, ctrl, $);
        return;
    }

    if (car(y).equals(TAN) && isplusone(x)) {
        push(cadr(y), $); // x of tan(x)
        return;
    }

    push(ARCTAN, $);
    push(y, $);
    push(x, $);
    list(3, $);
}

export function eigenmath_arctan_numbers(X: Num, Y: Num, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    if (iszero(X, env) && iszero(Y, env)) {
        push(ARCTAN, $);
        push_integer(0, $);
        push_integer(0, $);
        list(3, $);
        return;
    }

    if (is_num(X) && is_num(Y) && (is_flt(X) || is_flt(Y))) {
        push_double(Math.atan2(Y.toNumber(), X.toNumber()), $);
        return;
    }

    // X and Y are rational numbers

    if (iszero(Y, env)) {
        if (isnegativenumber(X)) push(MATH_PI, $);
        else push_integer(0, $);
        return;
    }

    if (iszero(X, env)) {
        if (isnegativenumber(Y)) push_rational(-1, 2, $);
        else push_rational(1, 2, $);
        push(MATH_PI, $);
        multiply(env, ctrl, $);
        return;
    }

    // convert fractions to integers

    push(Y, $);
    push(X, $);
    divide(env, ctrl, $);
    absfunc(env, ctrl, $);
    const T = pop($);

    push(T, $);
    numerator(env, ctrl, $);
    if (isnegativenumber(Y)) negate(env, ctrl, $);
    const Ynum = pop($) as Rat;

    push(T, $);
    denominator(env, ctrl, $);
    if (isnegativenumber(X)) negate(env, ctrl, $);
    const Xnum = pop($) as Rat;

    // compare numerators and denominators, ignore signs

    if (bignum_cmp(Xnum.a, Ynum.a) !== 0 || bignum_cmp(Xnum.b, Ynum.b) !== 0) {
        // not equal
        if (isnegativenumber(Ynum)) {
            push(ARCTAN, $);
            push(Ynum, $);
            negate(env, ctrl, $);
            push(Xnum, $);
            list(3, $);
            negate(env, ctrl, $);
        } else {
            push(ARCTAN, $);
            push(Ynum, $);
            push(Xnum, $);
            list(3, $);
        }
        return;
    }

    // X = Y modulo sign

    if (isnegativenumber(Xnum)) {
        if (isnegativenumber(Ynum)) push_rational(-3, 4, $);
        else push_rational(3, 4, $);
    } else {
        if (isnegativenumber(Ynum)) push_rational(-1, 4, $);
        else push_rational(1, 4, $);
    }

    push(MATH_PI, $);
    multiply(env, ctrl, $);
}

export function stack_arctanh(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    arctanh(env, ctrl, $);
}

function arctanh(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        const T = copy_tensor(p1);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(T.elems[i], $);
            arctanh(env, ctrl, $);
            T.elems[i] = pop($);
        }
        push(T, $);
        return;
    }

    if (isplusone(p1) || isminusone(p1)) {
        push(ARCTANH, $);
        push(p1, $);
        list(2, $);
        return;
    }

    if (is_flt(p1)) {
        let d = p1.toNumber();
        if (-1.0 < d && d < 1.0) {
            d = Math.atanh(d);
            push_double(d, $);
            return;
        }
    }

    // arctanh(z) = 1/2 log(1 + z) - 1/2 log(1 - z)

    if (is_flt(p1) || isdoublez(p1)) {
        push_double(1.0, $);
        push(p1, $);
        add(env, ctrl, $);
        logfunc(env, ctrl, $);
        push_double(1.0, $);
        push(p1, $);
        subtract(env, ctrl, $);
        logfunc(env, ctrl, $);
        subtract(env, ctrl, $);
        push_double(0.5, $);
        multiply(env, ctrl, $);
        return;
    }

    if (iszero(p1, env)) {
        push_integer(0, $);
        return;
    }

    // arctanh(-x) = -arctanh(x)

    if (isnegativeterm(p1)) {
        push(p1, $);
        negate(env, ctrl, $);
        arctanh(env, ctrl, $);
        negate(env, ctrl, $);
        return;
    }

    if (car(p1).equals(TANH)) {
        push(cadr(p1), $);
        return;
    }

    push(ARCTANH, $);
    push(p1, $);
    list(2, $);
}

export function stack_arg(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    $.push(expr); // [expr]
    $.rest(); // [expr.argList]
    $.head(); // [expr.argList.head]
    value_of(env, ctrl, $); // [z]
    arg(env, ctrl, $); // [arg(z)]
}

// use numerator and denominator to handle (a + i b) / (c + i d)

function arg(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const z = pop($);
    try {
        if (is_tensor(z)) {
            const T = copy_tensor(z);
            const n = T.nelem;
            for (let i = 0; i < n; i++) {
                push(T.elems[i], $);
                arg(env, ctrl, $);
                T.elems[i] = pop($);
            }
            push(T, $);
            return;
        }

        push(z, $);
        numerator(env, ctrl, $);
        arg1(env, ctrl, $);

        push(z, $);
        denominator(env, ctrl, $);
        arg1(env, ctrl, $);

        subtract(env, ctrl, $);

        if (isdoublesomewhere(z)) {
            floatfunc(env, ctrl, $);
        }
    } finally {
        z.release();
    }
}

function arg1(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const z = pop($);
    try {
        if (is_atom(z)) {
            const handler = env.handlerFor(z);
            const context = new ExprContextFromProgram(env, ctrl);
            try {
                const retval = handler.dispatch(z, native_sym(Native.arg), nil, context);
                try {
                    $.push(retval);
                    return;
                } finally {
                    retval.release();
                }
            } finally {
                context.release();
            }
        }

        if (is_rat(z)) {
            if (z.isZero()) {
                $.push(hook_create_err(new Str("arg of zero (0) is undefined")));
            } else if (isnegativenumber(z)) {
                push(MATH_PI, $);
                negate(env, ctrl, $); // This is wrong, should be PI
            } else {
                push_integer(0, $);
            }
            return;
        }

        if (is_flt(z)) {
            if (z.isZero()) {
                $.push(hook_create_err(new Str("arg of zero (0.0) is undefined")));
            } else if (isnegativenumber(z)) {
                push_double(-Math.PI, $);
            } else {
                push_double(0.0, $);
            }
            return;
        }

        // arg((-1)**expo) => pi*expo

        if (is_cons(z)) {
            const opr = z.opr;
            try {
                if (is_sym(opr) && is_native(opr, Native.pow)) {
                    const base = z.base;
                    try {
                        if (isminusone(base)) {
                            const expo = z.expo;
                            try {
                                $.push(native_sym(Native.PI)); // [pi]
                                $.push(expo); // [pi expo]
                                multiply(env, ctrl, $); // [pi*expo]
                                return;
                            } finally {
                                expo.release();
                            }
                        }
                    } finally {
                        base.release();
                    }
                }
            } finally {
                opr.release();
            }
        }

        // e ^ expr

        if (is_cons(z) && z.opr.equals(POWER) && cadr(z).equals(MATH_E)) {
            push(caddr(z), $);
            imag(env, ctrl, $);
            return;
        }

        if (car(z).equals(MULTIPLY)) {
            const h = $.length;
            let zs = cdr(z);
            while (is_cons(zs)) {
                push(car(zs), $);
                arg(env, ctrl, $);
                zs = cdr(zs);
            }
            sum_terms($.length - h, env, ctrl, $);
            principal_value(env, ctrl, $);
            return;
        }

        if (car(z).equals(ADD)) {
            push(z, $);
            rect(env, ctrl, $); // convert polar and clock forms
            const rect_z = pop($);
            push(rect_z, $);
            real(env, ctrl, $);
            const x = pop($);
            push(rect_z, $);
            imag(env, ctrl, $);
            const y = pop($);
            push(y, $);
            push(x, $);
            arctan(env, ctrl, $);
            return;
        }

        push_integer(0, $); // p1 is real
    } finally {
        z.release();
    }
}

/**
 * Ensures that the value on the stack lies in the interval (-pi, pi]
 *
 * Note that some authors use (0, 2*pi)
 *
 * [..., a*pi] => [..., a*pi]
 */
function principal_value(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const context = new ExprContextFromProgram(env, ctrl);
    const step = two;
    const lowerBound = negOne; // or some authors use zero
    const upperBound = lowerBound.add(step);
    try {
        $.push(native_sym(Native.PI)); //  [..., a*pi, pi]
        divide(env, ctrl, $); //  [..., a]

        $.dupl(); //  [..., a, a]
        push_native(Native.testgt, $); //  [..., a, a, >]
        $.swap(); //  [..., a, >, a]
        $.push(upperBound); //  [..., a, >, a, upperBound]
        list(3, $); //  [..., a, (> a upperBound)]
        value_of(env, ctrl, $); //  [..., a, value(> a upperBound)]
        while ($.istrue) {
            $.pop().release(); //  [..., a]
            $.push(step); //  [..., a, step]
            subtract(env, ctrl, $); //  [..., b], where b = a - step
            $.dupl(); //  [..., b, b]
            push_native(Native.testgt, $); //  [..., b, b, >]
            $.swap(); //  [..., b, >, b]
            $.push(upperBound); //  [..., b, >, b, upperBound]
            list(3, $); //  [..., b, (> b upperBound)]
            value_of(env, ctrl, $); //  [..., b, value(> b upperBound)]
        }
        $.pop().release(); //  [..., b]

        $.dupl(); //  [..., b, b]
        push_native(Native.testle, $); //  [..., b, b, <=]
        $.swap(); //  [..., b, <=, b]
        $.push(lowerBound); //  [..., b, <=, b, lowerBound]
        list(3, $); //  [..., b, (<= b lowerBound)]
        value_of(env, ctrl, $); //  [..., b, value(<= b lowerBound)]
        while ($.istrue) {
            $.pop().release(); //  [..., b]
            $.push(step); //  [..., b, step]
            sum_terms(2, env, ctrl, $); //  [..., c], where c = b + step
            $.dupl(); //  [..., c, c]
            push_native(Native.testle, $); //  [..., c, c, <=]
            $.swap(); //  [..., c, <=, c]
            $.push(lowerBound); //  [..., c, <=, c, lowerBound]
            list(3, $); //  [..., c, (<= c lowerBound)]
            value_of(env, ctrl, $); //  [..., c, value(<= c lowerBound)]
        }
        $.pop().release(); //  [..., c]

        $.push(native_sym(Native.PI)); //  [..., c, pi]
        multiply_factors(2, env, ctrl, $); //  [..., c * pi]
    } finally {
        context.release();
    }
}

/**
 * (binding s)
 */
export function stack_binding(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const sym = assert_sym(cadr(expr));
    push(get_binding(sym, nil, env), $);
}

export function stack_ceiling(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    ceilingfunc(env, ctrl, $);
}

function ceilingfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        const T = copy_tensor(p1);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(T.elems[i], $);
            ceilingfunc(env, ctrl, $);
            T.elems[i] = pop($);
        }
        push(p1, $);
        return;
    }

    if (is_rat(p1) && isinteger(p1)) {
        push(p1, $);
        return;
    }

    if (is_rat(p1)) {
        const a = bignum_div(p1.a, p1.b);
        const b = bignum_int(1);
        if (isnegativenumber(p1)) push_bignum(-1, a, b, $);
        else {
            push_bignum(1, a, b, $);
            push_integer(1, $);
            add(env, ctrl, $);
        }
        return;
    }

    if (is_flt(p1)) {
        let d = p1.toNumber();
        d = Math.ceil(d);
        push_double(d, $);
        return;
    }

    push(CEILING, $);
    push(p1, $);
    list(2, $);
}

export function stack_check(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    $.push(cadr(p1));
    evalp(env, ctrl, $);
    if (iszero($.pop(), env)) {
        stopf("check");
    }
    $.push(nil); // no result is printed
}

export function stack_circexp(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    circexp(env, ctrl, $);
}

function circexp(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    circexp_subst($);
    value_of(env, ctrl, $);
}

function circexp_subst($: ProgramStack): void {
    let p1 = pop($);

    if (is_tensor(p1)) {
        const T = copy_tensor(p1);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(T.elems[i], $);
            circexp_subst($);
            T.elems[i] = pop($);
        }
        push(T, $);
        return;
    }

    if (car(p1).equals(COS)) {
        push(EXPCOS, $);
        push(cadr(p1), $);
        circexp_subst($);
        list(2, $);
        return;
    }

    if (car(p1).equals(SIN)) {
        push(EXPSIN, $);
        push(cadr(p1), $);
        circexp_subst($);
        list(2, $);
        return;
    }

    if (car(p1).equals(TAN)) {
        push(EXPTAN, $);
        push(cadr(p1), $);
        circexp_subst($);
        list(2, $);
        return;
    }

    if (car(p1).equals(COSH)) {
        push(EXPCOSH, $);
        push(cadr(p1), $);
        circexp_subst($);
        list(2, $);
        return;
    }

    if (car(p1).equals(SINH)) {
        push(EXPSINH, $);
        push(cadr(p1), $);
        circexp_subst($);
        list(2, $);
        return;
    }

    if (car(p1).equals(TANH)) {
        push(EXPTANH, $);
        push(cadr(p1), $);
        circexp_subst($);
        list(2, $);
        return;
    }

    // none of the above

    if (is_cons(p1)) {
        const h = $.length;
        push(car(p1), $);
        p1 = cdr(p1);
        while (is_cons(p1)) {
            push(car(p1), $);
            circexp_subst($);
            p1 = cdr(p1);
        }
        list($.length - h, $);
        return;
    }

    push(p1, $);
}

export function stack_clear(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack) {
    save_symbol(TRACE, env);
    save_symbol(TTY, env);
    try {
        env.clearBindings();
    } finally {
        restore_symbol(env);
        restore_symbol(env);
    }
    push(nil, $); // result
}

export function stack_clock(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    $.push(expr); //  [..., expr]
    $.rest(); //  [..., expr.rest]
    $.head(); //  [..., expr.rest.head]
    value_of(env, ctrl, $); //  [..., z]
    clockfunc(env, ctrl, $); //  [..., clock(z)]
}

/**
 * [..., z] => [..., clock(z)]
 *
 * clock(z) = mag(z) * (-1)**(arg(z)/pi)
 */
function clockfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const z = pop($); //  [...]
    try {
        if (is_tensor(z)) {
            const T = copy_tensor(z);
            const n = T.nelem;
            for (let i = 0; i < n; i++) {
                push(T.elems[i], $);
                clockfunc(env, ctrl, $);
                T.elems[i] = pop($);
            }
            push(T, $);
            return;
        }

        push(z, $); //  [..., z]
        mag(env, ctrl, $); //  [..., mag(z)]
        push_integer(-1, $); //  [..., mag(z), -1]
        push(z, $); //  [..., mag(z), -1, z]
        arg(env, ctrl, $); //  [..., mag(z), -1, arg(z)]
        push(MATH_PI, $); //  [..., mag(z), -1, arg(z), pi]
        divide(env, ctrl, $); //  [..., mag(z), -1, arg(z)/pi]
        power(env, ctrl, $); //  [..., mag(z), (-1)**(arg(z)/pi)]
        multiply(env, ctrl, $); //  [..., mag(z) * (-1)**arg(z)/pi)]
    } finally {
        z.release();
    }
}

export function stack_cofactor(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    const p2 = assert_tensor(pop($));

    push(caddr(p1), $);
    value_of(env, ctrl, $);
    const i = pop_integer($);

    push(cadddr(p1), $);
    value_of(env, ctrl, $);
    const j = pop_integer($);

    if (!issquarematrix(p2)) stopf("cofactor: square matrix expected");

    if (i < 1 || i > p2.dims[0] || j < 0 || j > p2.dims[1]) {
        stopf("cofactor: index err");
    }

    push(p2, $);

    minormatrix(i, j, $);

    det(env, ctrl, $);

    if ((i + j) % 2) negate(env, ctrl, $);
}

export function stack_conj(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    conjfunc(env, ctrl, $);
}

export function conjfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    conjfunc_subst(env, ctrl, $);
    value_of(env, ctrl, $);
}

function conjfunc_subst(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const z = pop($);
    try {
        if (is_tensor(z)) {
            const T = copy_tensor(z);
            const n = T.nelem;
            for (let i = 0; i < n; i++) {
                push(T.elems[i], $);
                conjfunc_subst(env, ctrl, $);
                T.elems[i] = pop($);
            }
            push(T, $);
            return;
        }

        if (is_imu(z)) {
            push(native_sym(Native.multiply), $); // [*]
            push_integer(-1, $); // [*,-1]
            push(z, $); // [*,-1,i]
            list(3, $); // [-1*i]
            return;
        }

        // (-1) ^ expr

        if (car(z).equals(POWER) && isminusone(cadr(z))) {
            push(POWER, $);
            push_integer(-1, $);
            push(caddr(z), $);
            negate(env, ctrl, $);
            list(3, $);
            return;
        }

        if (is_cons(z)) {
            const h = $.length;
            push(car(z), $);
            let p1 = cdr(z);
            while (is_cons(p1)) {
                push(car(p1), $);
                conjfunc_subst(env, ctrl, $);
                p1 = cdr(p1);
            }
            list($.length - h, $);
            return;
        }

        push(z, $);
    } finally {
        z.release();
    }
}

export function stack_contract(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);

    p1 = cddr(p1);

    if (!is_cons(p1)) {
        push_integer(1, $);
        push_integer(2, $);
        contract(env, ctrl, $);
        return;
    }

    while (is_cons(p1)) {
        push(car(p1), $);
        value_of(env, ctrl, $);
        push(cadr(p1), $);
        value_of(env, ctrl, $);
        contract(env, ctrl, $);
        p1 = cddr(p1);
    }
}

function contract(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const index: number[] = [];

    const p3 = pop($);
    const p2 = pop($);
    const p1 = pop($);

    if (!istensor(p1)) {
        push(p1, $);
        return;
    }

    const ndim = p1.ndim;

    push(p2, $);
    let n = pop_integer($);

    push(p3, $);
    let m = pop_integer($);

    if (n < 1 || n > ndim || m < 1 || m > ndim || n === m) stopf("contract: index error");

    n--; // make zero based
    m--;

    const ncol = p1.dims[n];
    const nrow = p1.dims[m];

    if (ncol !== nrow) stopf("contract: unequal tensor dimensions");

    // nelem is the number of elements in result

    const nelem = p1.nelem / ncol / nrow;

    const T = alloc_tensor();

    for (let i = 0; i < ndim; i++) index[i] = 0;

    for (let i = 0; i < nelem; i++) {
        for (let j = 0; j < ncol; j++) {
            index[n] = j;
            index[m] = j;
            let k = index[0];
            for (let h = 1; h < ndim; h++) k = k * p1.dims[h] + index[h];
            push(p1.elems[k], $);
        }

        sum_terms(ncol, env, ctrl, $);

        T.elems[i] = pop($);

        // increment index

        for (let j = ndim - 1; j >= 0; j--) {
            if (j === n || j === m) continue;
            if (++index[j] < p1.dims[j]) break;
            index[j] = 0;
        }
    }

    if (nelem === 1) {
        push(T.elems[0], $);
        return;
    }

    // add dim info

    let k = 0;

    for (let i = 0; i < ndim; i++) if (i !== n && i !== m) T.dims[k++] = p1.dims[i];

    push(T, $);
}

export function stack_cos(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    cosfunc(env, ctrl, $);
}

function cosfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        push(elementwise(p1, cosfunc, env, ctrl, $), $);
        return;
    }

    if (is_flt(p1)) {
        let d = p1.toNumber();
        d = Math.cos(d);
        push_double(d, $);
        return;
    }

    // cos(z) = 1/2 exp(i z) + 1/2 exp(-i z)

    if (isdoublez(p1)) {
        push_double(0.5, $);
        push(imu, $);
        push(p1, $);
        multiply(env, ctrl, $);
        expfunc(env, ctrl, $);
        push(imu, $);
        negate(env, ctrl, $);
        push(p1, $);
        multiply(env, ctrl, $);
        expfunc(env, ctrl, $);
        add(env, ctrl, $);
        multiply(env, ctrl, $);
        return;
    }

    // cos(-x) = cos(x)

    if (isnegativeterm(p1)) {
        push(p1, $);
        negate(env, ctrl, $);
        cosfunc(env, ctrl, $);
        return;
    }

    if (is_cons(p1) && car(p1).equals(ADD)) {
        cosfunc_sum(p1, env, ctrl, $);
        return;
    }

    // cos(arctan(y,x)) = x (x^2 + y^2)^(-1/2)

    if (car(p1).equals(ARCTAN)) {
        const X = caddr(p1);
        const Y = cadr(p1);
        push(X, $);
        push(X, $);
        push(X, $);
        multiply(env, ctrl, $);
        push(Y, $);
        push(Y, $);
        multiply(env, ctrl, $);
        add(env, ctrl, $);
        push_rational(-1, 2, $);
        power(env, ctrl, $);
        multiply(env, ctrl, $);
        return;
    }

    // cos(arcsin(x)) = sqrt(1 - x^2)

    if (car(p1).equals(ARCSIN)) {
        push_integer(1, $);
        push(cadr(p1), $);
        push_integer(2, $);
        power(env, ctrl, $);
        subtract(env, ctrl, $);
        push_rational(1, 2, $);
        power(env, ctrl, $);
        return;
    }

    // n pi ?

    push(p1, $);
    push(MATH_PI, $);
    divide(env, ctrl, $);
    let p2 = pop($);

    if (!is_num(p2)) {
        push(COS, $);
        push(p1, $);
        list(2, $);
        return;
    }

    if (is_flt(p2)) {
        let d = p2.toNumber();
        d = Math.cos(d * Math.PI);
        push_double(d, $);
        return;
    }

    push(p2, $); // nonnegative by cos(-x) = cos(x) above
    push_integer(180, $);
    multiply(env, ctrl, $);
    p2 = pop($);

    if (!(is_rat(p2) && isinteger(p2))) {
        push(COS, $);
        push(p1, $);
        list(2, $);
        return;
    }

    push(p2, $);
    push_integer(360, $);
    modfunc(env, ctrl, $);
    const n = pop_integer($);

    switch (n) {
        case 90:
        case 270:
            push_integer(0, $);
            break;
        case 60:
        case 300:
            push_rational(1, 2, $);
            break;
        case 120:
        case 240:
            push_rational(-1, 2, $);
            break;
        case 45:
        case 315:
            push_rational(1, 2, $);
            push_integer(2, $);
            push_rational(1, 2, $);
            power(env, ctrl, $);
            multiply(env, ctrl, $);
            break;
        case 135:
        case 225:
            push_rational(-1, 2, $);
            push_integer(2, $);
            push_rational(1, 2, $);
            power(env, ctrl, $);
            multiply(env, ctrl, $);
            break;
        case 30:
        case 330:
            push_rational(1, 2, $);
            push_integer(3, $);
            push_rational(1, 2, $);
            power(env, ctrl, $);
            multiply(env, ctrl, $);
            break;
        case 150:
        case 210:
            push_rational(-1, 2, $);
            push_integer(3, $);
            push_rational(1, 2, $);
            power(env, ctrl, $);
            multiply(env, ctrl, $);
            break;
        case 0:
            push_integer(1, $);
            break;
        case 180:
            push_integer(-1, $);
            break;
        default:
            push(COS, $);
            push(p1, $);
            list(2, $);
            break;
    }
}

// cos(x + n/2 pi) = cos(x) cos(n/2 pi) - sin(x) sin(n/2 pi)

function cosfunc_sum(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    let p2 = cdr(p1);
    while (is_cons(p2)) {
        push_integer(2, $);
        push(car(p2), $);
        multiply(env, ctrl, $);
        push(MATH_PI, $);
        divide(env, ctrl, $);
        let p3 = pop($);
        if (is_rat(p3) && isinteger(p3)) {
            push(p1, $);
            push(car(p2), $);
            subtract(env, ctrl, $);
            p3 = pop($);
            push(p3, $);
            cosfunc(env, ctrl, $);
            push(car(p2), $);
            cosfunc(env, ctrl, $);
            multiply(env, ctrl, $);
            push(p3, $);
            sinfunc(env, ctrl, $);
            push(car(p2), $);
            sinfunc(env, ctrl, $);
            multiply(env, ctrl, $);
            subtract(env, ctrl, $);
            return;
        }
        p2 = cdr(p2);
    }
    push(COS, $);
    push(p1, $);
    list(2, $);
}

export function stack_cosh(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    coshfunc(env, ctrl, $);
}

function coshfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        const T = copy_tensor(p1);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(T.elems[i], $);
            coshfunc(env, ctrl, $);
            T.elems[i] = pop($);
        }
        push(T, $);
        return;
    }

    if (is_flt(p1)) {
        let d = p1.toNumber();
        d = Math.cosh(d);
        push_double(d, $);
        return;
    }

    // cosh(z) = 1/2 exp(z) + 1/2 exp(-z)

    if (isdoublez(p1)) {
        push_rational(1, 2, $);
        push(p1, $);
        expfunc(env, ctrl, $);
        push(p1, $);
        negate(env, ctrl, $);
        expfunc(env, ctrl, $);
        add(env, ctrl, $);
        multiply(env, ctrl, $);
        return;
    }

    if (iszero(p1, env)) {
        push_integer(1, $);
        return;
    }

    // cosh(-x) = cosh(x)

    if (isnegativeterm(p1)) {
        push(p1, $);
        negate(env, ctrl, $);
        coshfunc(env, ctrl, $);
        return;
    }

    if (car(p1).equals(ARCCOSH)) {
        push(cadr(p1), $);
        return;
    }

    push(COSH, $);
    push(p1, $);
    list(2, $);
}

export function stack_defint(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    let F = pop($);

    p1 = cddr(p1);

    while (is_cons(p1)) {
        push(car(p1), $);
        value_of(env, ctrl, $);
        const X = pop($);

        push(cadr(p1), $);
        value_of(env, ctrl, $);
        const A = pop($);

        push(caddr(p1), $);
        value_of(env, ctrl, $);
        const B = pop($);

        push(F, $);
        push(X, $);
        integral(env, ctrl, $);
        F = pop($);

        push(F, $);
        push(X, $);
        push(B, $);
        subst($);
        value_of(env, ctrl, $);

        push(F, $);
        push(X, $);
        push(A, $);
        subst($);
        value_of(env, ctrl, $);

        subtract(env, ctrl, $);
        F = pop($);

        p1 = cdddr(p1);
    }

    push(F, $);
}

export function stack_denominator(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    denominator(env, ctrl, $);
}

export function denominator(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const arg = pop($);

    if (is_rat(arg)) {
        const denom = arg.denom();
        $.push(denom);
        denom.release();
        return;
    }

    let p1 = arg;
    let p2: U = one; // denominator

    while (find_divisor(p1, env, ctrl, $)) {
        const p0 = pop($); // p0 is a denominator

        push(p0, $); // cancel in orig expr
        push(p1, $);
        cancel_factor(env, ctrl, $);
        p1 = pop($);

        push(p0, $); // update denominator
        push(p2, $);
        cancel_factor(env, ctrl, $);
        p2 = pop($);
    }

    push(p2, $);
}

export function stack_derivative(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    p1 = cddr(p1);

    if (!is_cons(p1)) {
        push(X_LOWER, $);
        derivative(env, ctrl, $);
        return;
    }

    let flag = 0;
    let X: U;
    let Y: U = nil;

    while (is_cons(p1) || flag) {
        if (flag) {
            X = Y;
            flag = 0;
        } else {
            push(car(p1), $);
            value_of(env, ctrl, $);
            X = pop($);
            p1 = cdr(p1);
        }

        if (is_num(X)) {
            push(X, $);
            const n = pop_integer($);
            push(X_LOWER, $);
            X = pop($);
            for (let i = 0; i < n; i++) {
                push(X, $);
                derivative(env, ctrl, $);
            }
            continue;
        }

        if (is_cons(p1)) {
            push(car(p1), $);
            value_of(env, ctrl, $);
            Y = pop($);
            p1 = cdr(p1);

            if (is_num(Y)) {
                push(Y, $);
                const n = pop_integer($);
                for (let i = 0; i < n; i++) {
                    push(X, $);
                    derivative(env, ctrl, $);
                }
                continue;
            }

            flag = 1;
        }

        push(X, $);
        derivative(env, ctrl, $);
    }
}

function derivative(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const X = pop($);
    const F = pop($);

    if (is_tensor(F)) {
        if (is_tensor(X)) {
            d_tensor_tensor(F, X, env, ctrl, $);
        } else {
            d_tensor_scalar(F, X, env, ctrl, $);
        }
    } else {
        if (is_tensor(X)) {
            d_scalar_tensor(F, X, env, ctrl, $);
        } else {
            d_scalar_scalar(F, X, env, ctrl, $);
        }
    }
}

function d_scalar_scalar(F: U, X: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    if (is_sym(X)) {
        if (env.hasUserFunction(X)) {
            // OK
        } else {
            stopf(`derivative: symbol '${X.key()}' must have user function.`);
        }
    } else {
        stopf(`derivative: symbol expected.`);
    }

    // d(x,x)?

    if (equal(F, X)) {
        push_integer(1, $);
        return;
    }

    // d(a,x)?

    if (!is_cons(F)) {
        push_integer(0, $);
        return;
    }

    if (car(F).equals(ADD)) {
        dsum(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(MULTIPLY)) {
        dproduct(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(POWER)) {
        dpower(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(DERIVATIVE)) {
        dd(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(LOG)) {
        dlog(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(SIN)) {
        dsin(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(COS)) {
        dcos(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(TAN)) {
        dtan(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(ARCSIN)) {
        darcsin(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(ARCCOS)) {
        darccos(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(ARCTAN)) {
        darctan(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(SINH)) {
        dsinh(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(COSH)) {
        dcosh(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(TANH)) {
        dtanh(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(ARCSINH)) {
        darcsinh(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(ARCCOSH)) {
        darccosh(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(ARCTANH)) {
        darctanh(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(ERF)) {
        derf(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(ERFC)) {
        derfc(F, X, env, ctrl, $);
        return;
    }

    if (car(F).equals(INTEGRAL) && caddr(F).equals(X)) {
        push(cadr(F), $);
        return;
    }

    dfunction(F, X, $);
}

function dsum(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const h = $.length;
    p1 = cdr(p1);
    while (is_cons(p1)) {
        push(car(p1), $);
        push(p2, $);
        derivative(env, ctrl, $);
        p1 = cdr(p1);
    }
    sum_terms($.length - h, env, ctrl, $);
}

function dproduct(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const n = lengthf(p1) - 1;
    for (let i = 0; i < n; i++) {
        let p3 = cdr(p1);
        for (let j = 0; j < n; j++) {
            push(car(p3), $);
            if (i === j) {
                push(p2, $);
                derivative(env, ctrl, $);
            }
            p3 = cdr(p3);
        }
        multiply_factors(n, env, ctrl, $);
    }
    sum_terms(n, env, ctrl, $);
}

//	     v
//	y = u
//
//	log y = v log u
//
//	1 dy   v du           dv
//	- -- = - -- + (log u) --
//	y dx   u dx           dx
//
//	dy    v  v du           dv
//	-- = u  (- -- + (log u) --)
//	dx       u dx           dx

function dpower(F: U, X: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    if (is_num(cadr(F)) && is_num(caddr(F))) {
        push_integer(0, $); // irr or imag
        return;
    }

    push(caddr(F), $); // v/u
    push(cadr(F), $);
    divide(env, ctrl, $);

    push(cadr(F), $); // du/dx
    push(X, $);
    derivative(env, ctrl, $);

    multiply(env, ctrl, $);

    push(cadr(F), $); // log u
    logfunc(env, ctrl, $);

    push(caddr(F), $); // dv/dx
    push(X, $);
    derivative(env, ctrl, $);

    multiply(env, ctrl, $);

    add(env, ctrl, $);

    push(F, $); // u^v

    multiply(env, ctrl, $);
}

function dlog(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);
    push(cadr(p1), $);
    divide(env, ctrl, $);
}

//	derivative of derivative
//
//	example: d(d(f(x,y),y),x)
//
//	p1 = d(f(x,y),y)
//
//	p2 = x
//
//	cadr(p1) = f(x,y)
//
//	caddr(p1) = y

function dd(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    // d(f(x,y),x)

    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);

    const p3 = pop($);

    if (car(p3).equals(DERIVATIVE)) {
        // sort dx terms

        push(DERIVATIVE, $);
        push(DERIVATIVE, $);
        push(cadr(p3), $);

        if (lessp(caddr(p3), caddr(p1))) {
            push(caddr(p3), $);
            list(3, $);
            push(caddr(p1), $);
        } else {
            push(caddr(p1), $);
            list(3, $);
            push(caddr(p3), $);
        }

        list(3, $);
    } else {
        push(p3, $);
        push(caddr(p1), $);
        derivative(env, ctrl, $);
    }
}

// derivative of a generic function

function dfunction(p1: U, p2: U, $: ProgramStack): void {
    const p3 = cdr(p1); // p3 is the argument list for the function

    if (p3.isnil || findf(p3, p2)) {
        push(DERIVATIVE, $);
        push(p1, $);
        push(p2, $);
        list(3, $);
    } else push_integer(0, $);
}

function dsin(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);
    push(cadr(p1), $);
    cosfunc(env, ctrl, $);
    multiply(env, ctrl, $);
}

function dcos(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);
    push(cadr(p1), $);
    sinfunc(env, ctrl, $);
    multiply(env, ctrl, $);
    negate(env, ctrl, $);
}

function dtan(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);
    push(cadr(p1), $);
    cosfunc(env, ctrl, $);
    push_integer(-2, $);
    power(env, ctrl, $);
    multiply(env, ctrl, $);
}

function darcsin(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);
    push_integer(1, $);
    push(cadr(p1), $);
    push_integer(2, $);
    power(env, ctrl, $);
    subtract(env, ctrl, $);
    push_rational(-1, 2, $);
    power(env, ctrl, $);
    multiply(env, ctrl, $);
}

function darccos(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);
    push_integer(1, $);
    push(cadr(p1), $);
    push_integer(2, $);
    power(env, ctrl, $);
    subtract(env, ctrl, $);
    push_rational(-1, 2, $);
    power(env, ctrl, $);
    multiply(env, ctrl, $);
    negate(env, ctrl, $);
}

function darctan(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);
    push_integer(1, $);
    push(cadr(p1), $);
    push_integer(2, $);
    power(env, ctrl, $);
    add(env, ctrl, $);
    reciprocate(env, ctrl, $);
    multiply(env, ctrl, $);
}

function dsinh(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);
    push(cadr(p1), $);
    coshfunc(env, ctrl, $);
    multiply(env, ctrl, $);
}

function dcosh(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);
    push(cadr(p1), $);
    sinhfunc(env, ctrl, $);
    multiply(env, ctrl, $);
}

function dtanh(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);
    push(cadr(p1), $);
    coshfunc(env, ctrl, $);
    push_integer(-2, $);
    power(env, ctrl, $);
    multiply(env, ctrl, $);
}

function darcsinh(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);
    push(cadr(p1), $);
    push_integer(2, $);
    power(env, ctrl, $);
    push_integer(1, $);
    add(env, ctrl, $);
    push_rational(-1, 2, $);
    power(env, ctrl, $);
    multiply(env, ctrl, $);
}

function darccosh(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);
    push(cadr(p1), $);
    push_integer(2, $);
    power(env, ctrl, $);
    push_integer(-1, $);
    add(env, ctrl, $);
    push_rational(-1, 2, $);
    power(env, ctrl, $);
    multiply(env, ctrl, $);
}

function darctanh(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);
    push_integer(1, $);
    push(cadr(p1), $);
    push_integer(2, $);
    power(env, ctrl, $);
    subtract(env, ctrl, $);
    reciprocate(env, ctrl, $);
    multiply(env, ctrl, $);
}

function derf(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    push_integer(2, $);
    power(env, ctrl, $);
    push_integer(-1, $);
    multiply(env, ctrl, $);
    expfunc(env, ctrl, $);
    push(MATH_PI, $);
    push_rational(-1, 2, $);
    power(env, ctrl, $);
    multiply(env, ctrl, $);
    push_integer(2, $);
    multiply(env, ctrl, $);
    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);
    multiply(env, ctrl, $);
}

function derfc(p1: U, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    push_integer(2, $);
    power(env, ctrl, $);
    push_integer(-1, $);
    multiply(env, ctrl, $);
    expfunc(env, ctrl, $);
    push(MATH_PI, $);
    push_rational(-1, 2, $);
    power(env, ctrl, $);
    multiply(env, ctrl, $);
    push_integer(-2, $);
    multiply(env, ctrl, $);
    push(cadr(p1), $);
    push(p2, $);
    derivative(env, ctrl, $);
    multiply(env, ctrl, $);
}

// gradient of tensor p1 wrt tensor p2

function d_tensor_tensor(p1: Tensor, p2: Tensor, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    let n = p1.nelem;
    const m = p2.nelem;

    const p3 = alloc_tensor();

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            push(p1.elems[i], $);
            push(p2.elems[j], $);
            derivative(env, ctrl, $);
            p3.elems[m * i + j] = pop($);
        }
    }

    // dim info

    let k = 0;

    n = p1.ndim;

    for (let i = 0; i < n; i++) p3.dims[k++] = p1.dims[i];

    n = p2.ndim;

    for (let i = 0; i < n; i++) p3.dims[k++] = p2.dims[i];

    push(p3, $);
}

// gradient of scalar p1 wrt tensor p2

function d_scalar_tensor(p1: U, p2: Tensor, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p3 = copy_tensor(p2);

    const n = p2.nelem;

    for (let i = 0; i < n; i++) {
        push(p1, $);
        push(p2.elems[i], $);
        derivative(env, ctrl, $);
        p3.elems[i] = pop($);
    }

    push(p3, $);
}

// derivative of tensor p1 wrt scalar p2

function d_tensor_scalar(p1: Tensor, p2: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p3 = copy_tensor(p1);

    const n = p1.nelem;

    for (let i = 0; i < n; i++) {
        push(p1.elems[i], $);
        push(p2, $);
        derivative(env, ctrl, $);
        p3.elems[i] = pop($);
    }

    push(p3, $);
}

export function stack_det(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    det(env, ctrl, $);
}

function det(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (!istensor(p1)) {
        push(p1, $);
        return;
    }

    if (!issquarematrix(p1)) stopf("det: square matrix expected");

    const n = p1.dims[0];

    switch (n) {
        case 1:
            push(p1.elems[0], $);
            return;
        case 2:
            push(p1.elems[0], $);
            push(p1.elems[3], $);
            multiply(env, ctrl, $);
            push(p1.elems[1], $);
            push(p1.elems[2], $);
            multiply(env, ctrl, $);
            subtract(env, ctrl, $);
            return;
        case 3:
            push(p1.elems[0], $);
            push(p1.elems[4], $);
            push(p1.elems[8], $);
            multiply_factors(3, env, ctrl, $);
            push(p1.elems[1], $);
            push(p1.elems[5], $);
            push(p1.elems[6], $);
            multiply_factors(3, env, ctrl, $);
            push(p1.elems[2], $);
            push(p1.elems[3], $);
            push(p1.elems[7], $);
            multiply_factors(3, env, ctrl, $);
            push_integer(-1, $);
            push(p1.elems[2], $);
            push(p1.elems[4], $);
            push(p1.elems[6], $);
            multiply_factors(4, env, ctrl, $);
            push_integer(-1, $);
            push(p1.elems[1], $);
            push(p1.elems[3], $);
            push(p1.elems[8], $);
            multiply_factors(4, env, ctrl, $);
            push_integer(-1, $);
            push(p1.elems[0], $);
            push(p1.elems[5], $);
            push(p1.elems[7], $);
            multiply_factors(4, env, ctrl, $);
            sum_terms(6, env, ctrl, $);
            return;
        default:
            break;
    }

    const p2 = alloc_matrix(n - 1, n - 1);

    const h = $.length;

    for (let m = 0; m < n; m++) {
        if (iszero(p1.elems[m], env)) {
            continue;
        }
        let k = 0;
        for (let i = 1; i < n; i++) for (let j = 0; j < n; j++) if (j !== m) p2.elems[k++] = p1.elems[n * i + j];
        push(p2, $);
        det(env, ctrl, $);
        push(p1.elems[m], $);
        multiply(env, ctrl, $);
        if (m % 2) negate(env, ctrl, $);
    }

    const s = $.length - h;

    if (s === 0) push_integer(0, $);
    else sum_terms(s, env, ctrl, $);
}

export function stack_dim(p1: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    const p2 = pop($);

    if (!istensor(p2)) {
        push_integer(1, $);
        return;
    }

    let k: number;

    if (lengthf(p1) === 2) k = 1;
    else {
        push(caddr(p1), $);
        value_of(env, ctrl, $);
        k = pop_integer($);
    }

    if (k < 1 || k > p2.ndim) stopf("dim 2nd arg: error");

    push_integer(p2.dims[k - 1], $);
}

export function stack_do(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(nil, $);
    p1 = cdr(p1);
    while (is_cons(p1)) {
        pop($);
        push(car(p1), $);
        value_of(env, ctrl, $);
        p1 = cdr(p1);
    }
}

export function stack_dot(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    stack_inner(p1, env, ctrl, $);
}

export function stack_eigenvec(punk: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const D: number[] = [];
    const Q: number[] = [];

    push(cadr(punk), $);
    value_of(env, ctrl, $);
    floatfunc(env, ctrl, $);
    let T = pop($) as Tensor<Flt>;

    if (!issquarematrix(T)) stopf("eigenvec: square matrix expected");

    const n = T.dims[0];

    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (!is_flt(T.elems[n * i + j])) stopf("eigenvec: numerical matrix expected");

    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            const Tij: number = T.elems[n * i + j].d;
            const Tji: number = T.elems[n * j + i].d;
            if (Math.abs(Tij - Tji) > 1e-10) {
                stopf("eigenvec: symmetrical matrix expected");
            }
        }
    }

    // initialize D

    for (let i = 0; i < n; i++) {
        D[n * i + i] = (T.elems[n * i + i] as Flt).d;
        for (let j = i + 1; j < n; j++) {
            D[n * i + j] = (T.elems[n * i + j] as Flt).d;
            D[n * j + i] = (T.elems[n * i + j] as Flt).d;
        }
    }

    // initialize Q

    for (let i = 0; i < n; i++) {
        Q[n * i + i] = 1.0;
        for (let j = i + 1; j < n; j++) {
            Q[n * i + j] = 0.0;
            Q[n * j + i] = 0.0;
        }
    }

    eigenvec(D, Q, n);

    T = alloc_matrix<Flt>(n, n);

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            T.elems[n * i + j] = create_flt(Q[n * j + i]); // transpose
        }
    }

    push(T, $);
}

function eigenvec(D: number[], Q: number[], n: number): void {
    for (let i = 0; i < 100; i++) if (eigenvec_step(D, Q, n) === 0) return;

    stopf("eigenvec: convergence error");
}

function eigenvec_step(D: number[], Q: number[], n: number) {
    let count = 0;

    // for each upper triangle "off-diagonal" component do step_nib

    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            if (D[n * i + j] !== 0.0) {
                eigenvec_step_nib(D, Q, n, i, j);
                count++;
            }
        }
    }

    return count;
}

function eigenvec_step_nib(D: number[], Q: number[], n: number, p: number, q: number): void {
    // compute c and s

    // from Numerical Recipes (except they have a_qq - a_pp)

    const theta = (0.5 * (D[n * p + p] - D[n * q + q])) / D[n * p + q];

    let t = 1.0 / (Math.abs(theta) + Math.sqrt(theta * theta + 1.0));

    if (theta < 0.0) t = -t;

    const c = 1.0 / Math.sqrt(t * t + 1.0);

    const s = t * c;

    // D = GD

    // which means "add rows"

    for (let k = 0; k < n; k++) {
        const cc = D[n * p + k];
        const ss = D[n * q + k];
        D[n * p + k] = c * cc + s * ss;
        D[n * q + k] = c * ss - s * cc;
    }

    // D = D transpose(G)

    // which means "add columns"

    for (let k = 0; k < n; k++) {
        const cc = D[n * k + p];
        const ss = D[n * k + q];
        D[n * k + p] = c * cc + s * ss;
        D[n * k + q] = c * ss - s * cc;
    }

    // Q = GQ

    // which means "add rows"

    for (let k = 0; k < n; k++) {
        const cc = Q[n * p + k];
        const ss = Q[n * q + k];
        Q[n * p + k] = c * cc + s * ss;
        Q[n * q + k] = c * ss - s * cc;
    }

    D[n * p + q] = 0.0;
    D[n * q + p] = 0.0;
}

export function stack_erf(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    erffunc(env, ctrl, $);
}

function erffunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        const T = copy_tensor(p1);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(T.elems[i], $);
            erffunc(env, ctrl, $);
            T.elems[i] = pop($);
        }
        push(T, $);
        return;
    }

    if (is_flt(p1)) {
        let d = p1.toNumber();
        d = erf(d);
        push_double(d, $);
        return;
    }

    if (iszero(p1, env)) {
        push_integer(0, $);
        return;
    }

    if (isnegativeterm(p1)) {
        push(ERF, $);
        push(p1, $);
        negate(env, ctrl, $);
        list(2, $);
        negate(env, ctrl, $);
        return;
    }

    push(ERF, $);
    push(p1, $);
    list(2, $);
}

export function stack_erfc(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    erfcfunc(env, $);
}

function erfcfunc(env: ProgramEnv, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        const T = copy_tensor(p1);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(T.elems[i], $);
            erfcfunc(env, $);
            T.elems[i] = pop($);
        }
        push(T, $);
        return;
    }

    if (is_flt(p1)) {
        let d = p1.toNumber();
        d = erfc(d);
        push_double(d, $);
        return;
    }

    if (iszero(p1, env)) {
        push_integer(1, $);
        return;
    }

    push(ERFC, $);
    push(p1, $);
    list(2, $);
}

/**
 * (eval f x1 a1 x2 a2 ...)
 */
export function stack_eval(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): void {
    _.push(expr); //  [expr]
    _.rest(); //  [expr.rest]
    _.head(); //  [expr.rest.head]
    value_of(env, ctrl, _); //  [F]
    let p1 = cddr(expr);
    while (is_cons(p1)) {
        push(car(p1), _); //  [F, expr.rest.rest.head]
        value_of(env, ctrl, _); //  [F, x]
        push(cadr(p1), _); //  [F, x, expr.rest.rest.rest.head]
        value_of(env, ctrl, _); //  [F, x, a]
        subst(_);
        p1 = cddr(p1);
    }
    value_of(env, ctrl, _);
}

export function stack_exit(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(nil, $);
}

export function stack_exp(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    expfunc(env, ctrl, $);
}

export function expfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(MATH_E, $);
    swap($);
    power(env, ctrl, $);
}

export function stack_expcos(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    expcos(env, ctrl, $);
}

function expcos(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    push(imu, $);
    push(p1, $);
    multiply(env, ctrl, $);
    expfunc(env, ctrl, $);
    push_rational(1, 2, $);
    multiply(env, ctrl, $);

    push(imu, $);
    negate(env, ctrl, $);
    push(p1, $);
    multiply(env, ctrl, $);
    expfunc(env, ctrl, $);
    push_rational(1, 2, $);
    multiply(env, ctrl, $);

    add(env, ctrl, $);
}

export function stack_expcosh(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    expcosh(env, ctrl, $);
}

function expcosh(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);
    push(p1, $);
    expfunc(env, ctrl, $);
    push(p1, $);
    negate(env, ctrl, $);
    expfunc(env, ctrl, $);
    add(env, ctrl, $);
    push_rational(1, 2, $);
    multiply(env, ctrl, $);
}

export function stack_expsin(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    expsin(env, ctrl, $);
}

function expsin(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    push(imu, $);
    push(p1, $);
    multiply(env, ctrl, $);
    expfunc(env, ctrl, $);
    push(imu, $);
    divide(env, ctrl, $);
    push_rational(1, 2, $);
    multiply(env, ctrl, $);

    push(imu, $);
    negate(env, ctrl, $);
    push(p1, $);
    multiply(env, ctrl, $);
    expfunc(env, ctrl, $);
    push(imu, $);
    divide(env, ctrl, $);
    push_rational(1, 2, $);
    multiply(env, ctrl, $);

    subtract(env, ctrl, $);
}

export function stack_expsinh(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    expsinh(env, ctrl, $);
}

function expsinh(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);
    push(p1, $);
    expfunc(env, ctrl, $);
    push(p1, $);
    negate(env, ctrl, $);
    expfunc(env, ctrl, $);
    subtract(env, ctrl, $);
    push_rational(1, 2, $);
    multiply(env, ctrl, $);
}
// tan(z) = (i - i exp(2 i z)) / (exp(2 i z) + 1)

export function stack_exptan(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    exptan(env, ctrl, $);
}

function exptan(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push_integer(2, $);
    push(imu, $);
    multiply_factors(3, env, ctrl, $);
    expfunc(env, ctrl, $);

    const p1 = pop($);

    push(imu, $);
    push(imu, $);
    push(p1, $);
    multiply(env, ctrl, $);
    subtract(env, ctrl, $);

    push(p1, $);
    push_integer(1, $);
    add(env, ctrl, $);

    divide(env, ctrl, $);
}

export function stack_exptanh(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    exptanh(env, ctrl, $);
}

function exptanh(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push_integer(2, $);
    multiply(env, ctrl, $);
    expfunc(env, ctrl, $);
    const p1 = pop($);
    push(p1, $);
    push_integer(1, $);
    subtract(env, ctrl, $);
    push(p1, $);
    push_integer(1, $);
    add(env, ctrl, $);
    divide(env, ctrl, $);
}

export function stack_factorial(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    factorial(env, ctrl, $);
}

function factorial(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_rat(p1) && isposint(p1)) {
        push(p1, $);
        const n = pop_integer($);
        push_integer(1, $);
        for (let i = 2; i <= n; i++) {
            push_integer(i, $);
            multiply(env, ctrl, $);
        }
        return;
    }

    if (is_flt(p1) && p1.d >= 0 && Math.floor(p1.d) === p1.d) {
        push(p1, $);
        const n = pop_integer($);
        let m = 1.0;
        for (let i = 2; i <= n; i++) m *= i;
        push_double(m, $);
        return;
    }

    push(FACTORIAL, $);
    push(p1, $);
    list(2, $);
}

export function stack_float(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    floatfunc(env, ctrl, $);
}

export function floatfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    floatfunc_subst($);
    value_of(env, ctrl, $);
    floatfunc_subst($); // in case pi popped up
    value_of(env, ctrl, $);
}

function floatfunc_subst($: ProgramStack): void {
    const expr = pop($);
    try {
        if (is_tensor(expr)) {
            const T = copy_tensor(expr);
            const n = T.nelem;
            for (let i = 0; i < n; i++) {
                push(T.elems[i], $);
                floatfunc_subst($);
                T.elems[i] = pop($);
            }
            push(T, $);
            return;
        }

        if (expr.equals(MATH_PI)) {
            push_double(Math.PI, $);
            return;
        }

        if (expr.equals(MATH_E)) {
            push_double(Math.E, $);
            return;
        }

        if (is_rat(expr)) {
            push_double(expr.toNumber(), $);
            return;
        }

        // don't float exponential

        if (car(expr).equals(POWER) && cadr(expr).equals(MATH_E)) {
            push(POWER, $);
            push(MATH_E, $);
            push(caddr(expr), $);
            floatfunc_subst($);
            list(3, $);
            return;
        }

        // don't float imaginary unit, but multiply it by 1.0

        if (car(expr).equals(POWER) && isminusone(cadr(expr))) {
            push(MULTIPLY, $);
            push_double(1.0, $);
            push(POWER, $);
            push(cadr(expr), $);
            push(caddr(expr), $);
            floatfunc_subst($);
            list(3, $);
            list(3, $);
            return;
        }

        if (is_cons(expr)) {
            const h = $.length;
            $.push(expr);
            $.head();
            let xs = expr.rest;
            while (is_cons(xs)) {
                $.push(xs);
                $.head();
                floatfunc_subst($);
                xs = xs.rest;
            }
            list($.length - h, $);
            return;
        }

        push(expr, $);
    } finally {
        expr.release();
    }
}

export function stack_floor(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack) {
    const argList = expr.argList;
    try {
        $.push(argList);
        $.head();
        value_of(env, ctrl, $);
        floorfunc(env, ctrl, $);
    } finally {
        argList.release();
    }
}

function floorfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        const T = copy_tensor(p1);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(T.elems[i], $);
            floorfunc(env, ctrl, $);
            T.elems[i] = pop($);
        }
        push(T, $);
        return;
    }

    if (is_rat(p1) && isinteger(p1)) {
        push(p1, $);
        return;
    }

    if (is_rat(p1)) {
        const a = bignum_div(p1.a, p1.b);
        const b = bignum_int(1);
        if (isnegativenumber(p1)) {
            push_bignum(-1, a, b, $);
            push_integer(-1, $);
            add(env, ctrl, $);
        } else push_bignum(1, a, b, $);
        return;
    }

    if (is_flt(p1)) {
        let d = p1.toNumber();
        d = Math.floor(d);
        push_double(d, $);
        return;
    }

    push(FLOOR, $);
    push(p1, $);
    list(2, $);
}

/**
 * (for i j k a b ...)
 *      0 1 2 3 4 ...
 */
export function stack_for(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const argList = expr.argList;
    try {
        const I = argList.item0;
        const J = argList.item1;
        const K = argList.item2;
        try {
            if (!(is_sym(I) && env.hasUserFunction(I))) {
                stopf("for: symbol error");
            }

            push(J, $);
            value_of(env, ctrl, $);
            let index = pop_integer($);

            push(K, $);
            value_of(env, ctrl, $);
            const k = pop_integer($);

            save_symbol(I, env);
            try {
                for (;;) {
                    set_symbol(I, create_int(index), nil, env);
                    let xs = argList.item3;
                    while (is_cons(xs)) {
                        $.push(xs.head);
                        value_of(env, ctrl, $);
                        // Evaluating the expression for its side-effect, so throw away the return value.
                        $.pop().release();
                        xs = xs.rest;
                    }
                    if (index === k) {
                        break;
                    }
                    if (index < k) {
                        index++;
                    } else {
                        index--;
                    }
                }
            } finally {
                restore_symbol(env);
            }
        } finally {
            I.release();
            J.release();
            K.release();
        }
    } finally {
        argList.release();
    }

    push(nil, $); // return value
}

export function stack_imag(p1: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    imag(env, ctrl, $);
}

export function imag(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    let p1 = pop($);

    if (is_tensor(p1)) {
        const T = copy_tensor(p1);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(T.elems[i], $);
            imag(env, ctrl, $);
            T.elems[i] = pop($);
        }
        push(T, $);
        return;
    }

    push(p1, $);
    rect(env, ctrl, $);
    p1 = pop($);
    push_rational(-1, 2, $);
    push(imu, $);
    push(p1, $);
    push(p1, $);
    conjfunc(env, ctrl, $);
    subtract(env, ctrl, $);
    multiply_factors(3, env, ctrl, $);
}

export function stack_index(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    let T = cadr(expr);

    let indices: Cons = cddr(expr);

    const h = $.length;

    while (is_cons(indices)) {
        push(car(indices), $);
        value_of(env, ctrl, $);
        indices = cdr(indices);
    }

    // try to optimize by indexing before eval

    if (is_sym(T) && env.hasUserFunction(T)) {
        const x = get_binding(T, nil, env);
        const n = $.length - h;
        if (is_tensor(x) && n <= x.ndim) {
            T = x;
            indexfunc(x, h, $);
            value_of(env, ctrl, $);
            return;
        }
    }

    push(T, $);
    value_of(env, ctrl, $);
    T = pop($);

    if (!istensor(T)) {
        $.splice(h); // pop all
        push(T, $); // quirky, but EVA2.txt depends on it
        return;
    }

    indexfunc(T, h, $);
}

function indexfunc(T: Tensor, h: number, $: ProgramStack): void {
    const m = T.ndim;

    const n = $.length - h;

    const r = m - n; // rank of result

    if (r < 0) stopf("index error");

    let k = 0;

    for (let i = 0; i < n; i++) {
        push($.getAt(h + i), $);
        const t = pop_integer($);
        if (t < 1 || t > T.dims[i]) stopf("index error");
        k = k * T.dims[i] + t - 1;
    }

    $.splice(h); // pop all

    if (r === 0) {
        push(T.elems[k], $); // scalar result
        return;
    }

    let w = 1;

    for (let i = n; i < m; i++) w *= T.dims[i];

    k *= w;

    const p1 = alloc_tensor();

    for (let i = 0; i < w; i++) p1.elems[i] = T.elems[k + i];

    for (let i = 0; i < r; i++) p1.dims[i] = T.dims[n + i];

    push(p1, $);
}

export function stack_inner(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const h = $.length;

    // evaluate from right to left

    p1 = cdr(p1);

    while (is_cons(p1)) {
        push(car(p1), $);
        p1 = cdr(p1);
    }

    if (h === $.length) stopf("inner: no args");

    value_of(env, ctrl, $);

    while ($.length - h > 1) {
        swap($);
        value_of(env, ctrl, $);
        swap($);
        inner(env, ctrl, $);
    }
}

export function inner(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    let p2 = pop($);
    let p1 = pop($);
    let p3: Tensor;

    if (!istensor(p1) && !istensor(p2)) {
        push(p1, $);
        push(p2, $);
        multiply(env, ctrl, $);
        return;
    }

    if (is_tensor(p1) && !istensor(p2)) {
        p3 = p1;
        p1 = p2;
        p2 = p3;
    }

    if (!istensor(p1) && istensor(p2)) {
        const T = copy_tensor(p2);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(p1, $);
            push(T.elems[i], $);
            multiply(env, ctrl, $);
            T.elems[i] = pop($);
        }
        push(T, $);
        return;
    }

    if (is_tensor(p1) && istensor(p2)) {
        // Do nothing
    } else {
        throw new Error();
    }

    let k = p1.ndim - 1;

    const ncol = p1.dims[k];
    const mrow = p2.dims[0];

    if (ncol !== mrow) stopf("inner: dimension err");

    const ndim = p1.ndim + p2.ndim - 2;

    //	nrow is the number of rows in p1
    //
    //	mcol is the number of columns p2
    //
    //	Example:
    //
    //	A[3][3][4] B[4][4][3]
    //
    //	  3  3				nrow = 3 * 3 = 9
    //
    //	                4  3		mcol = 4 * 3 = 12

    const nrow = p1.nelem / ncol;
    const mcol = p2.nelem / mrow;

    p3 = alloc_tensor();

    for (let i = 0; i < nrow; i++) {
        for (let j = 0; j < mcol; j++) {
            for (let k = 0; k < ncol; k++) {
                push(p1.elems[i * ncol + k], $);
                push(p2.elems[k * mcol + j], $);
                multiply(env, ctrl, $);
            }
            sum_terms(ncol, env, ctrl, $);
            p3.elems[i * mcol + j] = pop($);
        }
    }

    if (ndim === 0) {
        push(p3.elems[0], $); // scalar result
        return;
    }

    // dim info

    k = 0;

    let n = p1.ndim - 1;

    for (let i = 0; i < n; i++) p3.dims[k++] = p1.dims[i];

    n = p2.ndim;

    for (let i = 1; i < n; i++) p3.dims[k++] = p2.dims[i];

    push(p3, $);
}
const integral_tab_exp: string[] = [
    // x^n exp(a x + b)

    "exp(a x)",
    "exp(a x) / a",
    "1",

    "exp(a x + b)",
    "exp(a x + b) / a",
    "1",

    "x exp(a x)",
    "exp(a x) (a x - 1) / (a^2)",
    "1",

    "x exp(a x + b)",
    "exp(a x + b) (a x - 1) / (a^2)",
    "1",

    "x^2 exp(a x)",
    "exp(a x) (a^2 x^2 - 2 a x + 2) / (a^3)",
    "1",

    "x^2 exp(a x + b)",
    "exp(a x + b) (a^2 x^2 - 2 a x + 2) / (a^3)",
    "1",

    "x^3 exp(a x)",
    "(a^3 x^3 - 3 a^2 x^2 + 6 a x - 6) exp(a x) / a^4",
    "1",

    "x^3 exp(a x + b)",
    "(a^3 x^3 - 3 a^2 x^2 + 6 a x - 6) exp(a x + b) / a^4",
    "1",

    "x^4 exp(a x)",
    "((a^4*x^4-4*a^3*x^3+12*a^2*x^2-24*a*x+24)*exp(a*x))/a^5",
    "1",

    "x^4 exp(a x + b)",
    "((a^4*x^4-4*a^3*x^3+12*a^2*x^2-24*a*x+24)*exp(a*x+b))/a^5",
    "1",

    "x^5 exp(a x)",
    "((a^5*x^5-5*a^4*x^4+20*a^3*x^3-60*a^2*x^2+120*a*x-120)*exp(a*x))/a^6",
    "1",

    "x^5 exp(a x + b)",
    "((a^5*x^5-5*a^4*x^4+20*a^3*x^3-60*a^2*x^2+120*a*x-120)*exp(a*x+b))/a^6",
    "1",

    "x^6 exp(a x)",
    "((a^6*x^6-6*a^5*x^5+30*a^4*x^4-120*a^3*x^3+360*a^2*x^2-720*a*x+720)*exp(a*x))/a^7",
    "1",

    "x^6 exp(a x + b)",
    "((a^6*x^6-6*a^5*x^5+30*a^4*x^4-120*a^3*x^3+360*a^2*x^2-720*a*x+720)*exp(a*x+b))/a^7",
    "1",

    "x^7 exp(a x)",
    "((a^7*x^7-7*a^6*x^6+42*a^5*x^5-210*a^4*x^4+840*a^3*x^3-2520*a^2*x^2+5040*a*x-5040)*exp(a*x))/a^8",
    "1",

    "x^7 exp(a x + b)",
    "((a^7*x^7-7*a^6*x^6+42*a^5*x^5-210*a^4*x^4+840*a^3*x^3-2520*a^2*x^2+5040*a*x-5040)*exp(a*x+b))/a^8",
    "1",

    "x^8 exp(a x)",
    "((a^8*x^8-8*a^7*x^7+56*a^6*x^6-336*a^5*x^5+1680*a^4*x^4-6720*a^3*x^3+20160*a^2*x^2-40320*a*x+40320)*exp(a*x))/a^9",
    "1",

    "x^8 exp(a x + b)",
    "((a^8*x^8-8*a^7*x^7+56*a^6*x^6-336*a^5*x^5+1680*a^4*x^4-6720*a^3*x^3+20160*a^2*x^2-40320*a*x+40320)*exp(a*x+b))/a^9",
    "1",

    "x^9 exp(a x)",
    "x^9 exp(a x) / a - 9 x^8 exp(a x) / a^2 + 72 x^7 exp(a x) / a^3 - 504 x^6 exp(a x) / a^4 + 3024 x^5 exp(a x) / a^5 - 15120 x^4 exp(a x) / a^6 + 60480 x^3 exp(a x) / a^7 - 181440 x^2 exp(a x) / a^8 + 362880 x exp(a x) / a^9 - 362880 exp(a x) / a^10",
    "1",

    "x^9 exp(a x + b)",
    "x^9 exp(a x + b) / a - 9 x^8 exp(a x + b) / a^2 + 72 x^7 exp(a x + b) / a^3 - 504 x^6 exp(a x + b) / a^4 + 3024 x^5 exp(a x + b) / a^5 - 15120 x^4 exp(a x + b) / a^6 + 60480 x^3 exp(a x + b) / a^7 - 181440 x^2 exp(a x + b) / a^8 + 362880 x exp(a x + b) / a^9 - 362880 exp(a x + b) / a^10",
    "1",

    "x^10 exp(a x)",
    "x^10 exp(a x) / a - 10 x^9 exp(a x) / a^2 + 90 x^8 exp(a x) / a^3 - 720 x^7 exp(a x) / a^4 + 5040 x^6 exp(a x) / a^5 - 30240 x^5 exp(a x) / a^6 + 151200 x^4 exp(a x) / a^7 - 604800 x^3 exp(a x) / a^8 + 1814400 x^2 exp(a x) / a^9 - 3628800 x exp(a x) / a^10 + 3628800 exp(a x) / a^11",
    "1",

    "x^10 exp(a x + b)",
    "x^10 exp(a x + b) / a - 10 x^9 exp(a x + b) / a^2 + 90 x^8 exp(a x + b) / a^3 - 720 x^7 exp(a x + b) / a^4 + 5040 x^6 exp(a x + b) / a^5 - 30240 x^5 exp(a x + b) / a^6 + 151200 x^4 exp(a x + b) / a^7 - 604800 x^3 exp(a x + b) / a^8 + 1814400 x^2 exp(a x + b) / a^9 - 3628800 x exp(a x + b) / a^10 + 3628800 exp(a x + b) / a^11",
    "1",

    "x^11 exp(a x)",
    "x^11 exp(a x) / a - 11 x^10 exp(a x) / a^2 + 110 x^9 exp(a x) / a^3 - 990 x^8 exp(a x) / a^4 + 7920 x^7 exp(a x) / a^5 - 55440 x^6 exp(a x) / a^6 + 332640 x^5 exp(a x) / a^7 - 1663200 x^4 exp(a x) / a^8 + 6652800 x^3 exp(a x) / a^9 - 19958400 x^2 exp(a x) / a^10 + 39916800 x exp(a x) / a^11 - 39916800 exp(a x) / a^12",
    "1",

    "x^11 exp(a x + b)",
    "x^11 exp(a x + b) / a - 11 x^10 exp(a x + b) / a^2 + 110 x^9 exp(a x + b) / a^3 - 990 x^8 exp(a x + b) / a^4 + 7920 x^7 exp(a x + b) / a^5 - 55440 x^6 exp(a x + b) / a^6 + 332640 x^5 exp(a x + b) / a^7 - 1663200 x^4 exp(a x + b) / a^8 + 6652800 x^3 exp(a x + b) / a^9 - 19958400 x^2 exp(a x + b) / a^10 + 39916800 x exp(a x + b) / a^11 - 39916800 exp(a x + b) / a^12",
    "1",

    // sin exp

    "sin(x) exp(a x)",
    "a sin(x) exp(a x) / (a^2 + 1) - cos(x) exp(a x) / (a^2 + 1)",
    "a^2 + 1", // denominator not zero

    "sin(x) exp(a x + b)",
    "a sin(x) exp(a x + b) / (a^2 + 1) - cos(x) exp(a x + b) / (a^2 + 1)",
    "a^2 + 1", // denominator not zero

    "sin(x) exp(i x)",
    "-1/4 exp(2 i x) + 1/2 i x",
    "1",

    "sin(x) exp(i x + b)",
    "-1/4 exp(b + 2 i x) + 1/2 i x exp(b)",
    "1",

    "sin(x) exp(-i x)",
    "-1/4 exp(-2 i x) - 1/2 i x",
    "1",

    "sin(x) exp(-i x + b)",
    "-1/4 exp(b - 2 i x) - 1/2 i x exp(b)",
    "1",

    // cos exp

    "cos(x) exp(a x)",
    "a cos(x) exp(a x) / (a^2 + 1) + sin(x) exp(a x) / (a^2 + 1)",
    "a^2 + 1", // denominator not zero

    "cos(x) exp(a x + b)",
    "a cos(x) exp(a x + b) / (a^2 + 1) + sin(x) exp(a x + b) / (a^2 + 1)",
    "a^2 + 1", // denominator not zero

    "cos(x) exp(i x)",
    "1/2 x - 1/4 i exp(2 i x)",
    "1",

    "cos(x) exp(i x + b)",
    "1/2 x exp(b) - 1/4 i exp(b + 2 i x)",
    "1",

    "cos(x) exp(-i x)",
    "1/2 x + 1/4 i exp(-2 i x)",
    "1",

    "cos(x) exp(-i x + b)",
    "1/2 x exp(b) + 1/4 i exp(b - 2 i x)",
    "1",

    // sin cos exp

    "sin(x) cos(x) exp(a x)",
    "a sin(2 x) exp(a x) / (2 (a^2 + 4)) - cos(2 x) exp(a x) / (a^2 + 4)",
    "a^2 + 4", // denominator not zero

    // x^n exp(a x^2 + b)

    "exp(a x^2)",
    "-1/2 i sqrt(pi) erf(i sqrt(a) x) / sqrt(a)",
    "1",

    "exp(a x^2 + b)",
    "-1/2 i sqrt(pi) exp(b) erf(i sqrt(a) x) / sqrt(a)",
    "1",

    "x exp(a x^2)",
    "1/2 exp(a x^2) / a",
    "1",

    "x exp(a x^2 + b)",
    "1/2 exp(a x^2 + b) / a",
    "1",

    "x^2 exp(a x^2)",
    "1/2 x exp(a x^2) / a + 1/4 i sqrt(pi) erf(i sqrt(a) x) / a^(3/2)",
    "1",

    "x^2 exp(a x^2 + b)",
    "1/2 x exp(a x^2 + b) / a + 1/4 i sqrt(pi) exp(b) erf(i sqrt(a) x) / a^(3/2)",
    "1",

    "x^3 exp(a x^2)",
    "1/2 exp(a x^2) (x^2 / a - 1 / a^2)",
    "1",

    "x^3 exp(a x^2 + b)",
    "1/2 exp(a x^2) exp(b) (x^2 / a - 1 / a^2)",
    "1",

    "x^4 exp(a x^2)",
    "x^3 exp(a x^2) / (2 a) - 3 x exp(a x^2) / (4 a^2) - 3 i pi^(1/2) erf(i a^(1/2) x) / (8 a^(5/2))",
    "1",

    "x^4 exp(a x^2 + b)",
    "x^3 exp(a x^2 + b) / (2 a) - 3 x exp(a x^2 + b) / (4 a^2) - 3 i pi^(1/2) erf(i a^(1/2) x) exp(b) / (8 a^(5/2))",
    "1",

    "x^5 exp(a x^2)",
    "x^4 exp(a x^2) / (2 a) - x^2 exp(a x^2) / a^2 + exp(a x^2) / a^3",
    "1",

    "x^5 exp(a x^2 + b)",
    "x^4 exp(a x^2 + b) / (2 a) - x^2 exp(a x^2 + b) / a^2 + exp(a x^2 + b) / a^3",
    "1",

    "x^6 exp(a x^2)",
    "x^5 exp(a x^2) / (2 a) - 5 x^3 exp(a x^2) / (4 a^2) + 15 x exp(a x^2) / (8 a^3) + 15 i pi^(1/2) erf(i a^(1/2) x) / (16 a^(7/2))",
    "1",

    "x^6 exp(a x^2 + b)",
    "x^5 exp(a x^2 + b) / (2 a) - 5 x^3 exp(a x^2 + b) / (4 a^2) + 15 x exp(a x^2 + b) / (8 a^3) + 15 i pi^(1/2) erf(i a^(1/2) x) exp(b) / (16 a^(7/2))",
    "1",

    "x^7 exp(a x^2)",
    "x^6 exp(a x^2) / (2 a) - 3 x^4 exp(a x^2) / (2 a^2) + 3 x^2 exp(a x^2) / a^3 - 3 exp(a x^2) / a^4",
    "1",

    "x^7 exp(a x^2 + b)",
    "x^6 exp(a x^2 + b) / (2 a) - 3 x^4 exp(a x^2 + b) / (2 a^2) + 3 x^2 exp(a x^2 + b) / a^3 - 3 exp(a x^2 + b) / a^4",
    "1",

    "x^8 exp(a x^2)",
    "x^7 exp(a x^2) / (2 a) - 7 x^5 exp(a x^2) / (4 a^2) + 35 x^3 exp(a x^2) / (8 a^3) - 105 x exp(a x^2) / (16 a^4) - 105 i pi^(1/2) erf(i a^(1/2) x) / (32 a^(9/2))",
    "1",

    "x^8 exp(a x^2 + b)",
    "x^7 exp(a x^2 + b) / (2 a) - 7 x^5 exp(a x^2 + b) / (4 a^2) + 35 x^3 exp(a x^2 + b) / (8 a^3) - 105 x exp(a x^2 + b) / (16 a^4) - 105 i pi^(1/2) erf(i a^(1/2) x) exp(b) / (32 a^(9/2))",
    "1",

    "x^9 exp(a x^2)",
    "x^8 exp(a x^2) / (2 a) - 2 x^6 exp(a x^2) / a^2 + 6 x^4 exp(a x^2) / a^3 - 12 x^2 exp(a x^2) / a^4 + 12 exp(a x^2) / a^5",
    "1",

    "x^9 exp(a x^2 + b)",
    "x^8 exp(a x^2 + b) / (2 a) - 2 x^6 exp(a x^2 + b) / a^2 + 6 x^4 exp(a x^2 + b) / a^3 - 12 x^2 exp(a x^2 + b) / a^4 + 12 exp(a x^2 + b) / a^5",
    "1"
];

// log(a x) is transformed to log(a) + log(x)

const integral_tab_log: string[] = [
    "log(x)",
    "x log(x) - x",
    "1",

    "log(a x + b)",
    "x log(a x + b) + b log(a x + b) / a - x",
    "1",

    "x log(x)",
    "x^2 log(x) 1/2 - x^2 1/4",
    "1",

    "x log(a x + b)",
    "1/2 (a x - b) (a x + b) log(a x + b) / a^2 - 1/4 x (a x - 2 b) / a",
    "1",

    "x^2 log(x)",
    "x^3 log(x) 1/3 - 1/9 x^3",
    "1",

    "x^2 log(a x + b)",
    "1/3 (a x + b) (a^2 x^2 - a b x + b^2) log(a x + b) / a^3 - 1/18 x (2 a^2 x^2 - 3 a b x + 6 b^2) / a^2",
    "1",

    "log(x)^2",
    "x log(x)^2 - 2 x log(x) + 2 x",
    "1",

    "log(a x + b)^2",
    "(a x + b) (log(a x + b)^2 - 2 log(a x + b) + 2) / a",
    "1",

    "log(x) / x^2",
    "-(log(x) + 1) / x",
    "1",

    "log(a x + b) / x^2",
    "a log(x) / b - (a x + b) log(a x + b) / (b x)",
    "1",

    "1 / (x (a + log(x)))",
    "log(a + log(x))",
    "1"
];

const integral_tab_trig: string[] = [
    "sin(a x)",
    "-cos(a x) / a",
    "1",

    "cos(a x)",
    "sin(a x) / a",
    "1",

    "tan(a x)",
    "-log(cos(a x)) / a",
    "1",

    // sin(a x)^n

    "sin(a x)^2",
    "-sin(2 a x) / (4 a) + 1/2 x",
    "1",

    "sin(a x)^3",
    "-2 cos(a x) / (3 a) - cos(a x) sin(a x)^2 / (3 a)",
    "1",

    "sin(a x)^4",
    "-sin(2 a x) / (4 a) + sin(4 a x) / (32 a) + 3/8 x",
    "1",

    "sin(a x)^5",
    "-cos(a x)^5 / (5 a) + 2 cos(a x)^3 / (3 a) - cos(a x) / a",
    "1",

    "sin(a x)^6",
    "sin(2 a x)^3 / (48 a) - sin(2 a x) / (4 a) + 3 sin(4 a x) / (64 a) + 5/16 x",
    "1",

    // cos(a x)^n

    "cos(a x)^2",
    "sin(2 a x) / (4 a) + 1/2 x",
    "1",

    "cos(a x)^3",
    "cos(a x)^2 sin(a x) / (3 a) + 2 sin(a x) / (3 a)",
    "1",

    "cos(a x)^4",
    "sin(2 a x) / (4 a) + sin(4 a x) / (32 a) + 3/8 x",
    "1",

    "cos(a x)^5",
    "sin(a x)^5 / (5 a) - 2 sin(a x)^3 / (3 a) + sin(a x) / a",
    "1",

    "cos(a x)^6",
    "-sin(2 a x)^3 / (48 a) + sin(2 a x) / (4 a) + 3 sin(4 a x) / (64 a) + 5/16 x",
    "1",

    //

    "sin(a x) cos(a x)",
    "1/2 sin(a x)^2 / a",
    "1",

    "sin(a x) cos(a x)^2",
    "-1/3 cos(a x)^3 / a",
    "1",

    "sin(a x)^2 cos(a x)",
    "1/3 sin(a x)^3 / a",
    "1",

    "sin(a x)^2 cos(a x)^2",
    "1/8 x - 1/32 sin(4 a x) / a",
    "1",
    // 329
    "1 / sin(a x) / cos(a x)",
    "log(tan(a x)) / a",
    "1",
    // 330
    "1 / sin(a x) / cos(a x)^2",
    "(1 / cos(a x) + log(tan(a x 1/2))) / a",
    "1",
    // 331
    "1 / sin(a x)^2 / cos(a x)",
    "(log(tan(pi 1/4 + a x 1/2)) - 1 / sin(a x)) / a",
    "1",
    // 333
    "1 / sin(a x)^2 / cos(a x)^2",
    "-2 / (a tan(2 a x))",
    "1",
    //
    "sin(a x) / cos(a x)",
    "-log(cos(a x)) / a",
    "1",

    "sin(a x) / cos(a x)^2",
    "1 / a / cos(a x)",
    "1",

    "sin(a x)^2 / cos(a x)",
    "-(sin(a x) + log(cos(a x / 2) - sin(a x / 2)) - log(sin(a x / 2) + cos(a x / 2))) / a",
    "1",

    "sin(a x)^2 / cos(a x)^2",
    "tan(a x) / a - x",
    "1",

    "cos(a x) / sin(a x)",
    "log(sin(a x)) / a",
    "1",

    "cos(a x) / sin(a x)^2",
    "-1 / (a sin(a x))",
    "1",

    "cos(a x)^2 / sin(a x)^2",
    "-x - cos(a x) / sin(a x) / a",
    "1",

    "sin(a + b x)",
    "-cos(a + b x) / b",
    "1",

    "cos(a + b x)",
    "sin(a + b x) / b",
    "1",

    "x sin(a x)",
    "sin(a x) / (a^2) - x cos(a x) / a",
    "1",

    "x^2 sin(a x)",
    "2 x sin(a x) / (a^2) - (a^2 x^2 - 2) cos(a x) / (a^3)",
    "1",

    "x cos(a x)",
    "cos(a x) / (a^2) + x sin(a x) / a",
    "1",

    "x^2 cos(a x)",
    "2 x cos(a x) / (a^2) + (a^2 x^2 - 2) sin(a x) / (a^3)",
    "1",

    "1 / tan(a x)",
    "log(sin(a x)) / a",
    "1",

    "1 / cos(a x)",
    "log(tan(pi 1/4 + a x 1/2)) / a",
    "1",

    "1 / sin(a x)",
    "log(tan(a x 1/2)) / a",
    "1",

    "1 / sin(a x)^2",
    "-1 / (a tan(a x))",
    "1",

    "1 / cos(a x)^2",
    "tan(a x) / a",
    "1",

    "1 / (b + b sin(a x))",
    "-tan(pi 1/4 - a x 1/2) / (a b)",
    "1",

    "1 / (b - b sin(a x))",
    "tan(pi 1/4 + a x 1/2) / (a b)",
    "1",

    "1 / (b + b cos(a x))",
    "tan(a x 1/2) / (a b)",
    "1",

    "1 / (b - b cos(a x))",
    "-1 / (tan(a x 1/2) a b)",
    "1",

    "1 / (a + b sin(x))",
    "log((a tan(x 1/2) + b - sqrt(b^2 - a^2)) / (a tan(x 1/2) + b + sqrt(b^2 - a^2))) / sqrt(b^2 - a^2)",
    "b^2 - a^2",

    "1 / (a + b cos(x))",
    "log((sqrt(b^2 - a^2) tan(x 1/2) + a + b) / (sqrt(b^2 - a^2) tan(x 1/2) - a - b)) / sqrt(b^2 - a^2)",
    "b^2 - a^2",

    "x sin(a x) sin(b x)",
    "1/2 ((x sin(x (a - b)))/(a - b) - (x sin(x (a + b)))/(a + b) + cos(x (a - b))/(a - b)^2 - cos(x (a + b))/(a + b)^2)",
    "and(not(a + b == 0),not(a - b == 0))",

    "sin(a x)/(cos(a x) - 1)^2",
    "1/a * 1/(cos(a x) - 1)",
    "1",

    "sin(a x)/(1 - cos(a x))^2",
    "1/a * 1/(cos(a x) - 1)",
    "1",

    "cos(x)^3 sin(x)",
    "-1/4 cos(x)^4",
    "1",

    "cos(a x)^5",
    "sin(a x)^5 / (5 a) - 2 sin(a x)^3 / (3 a) + sin(a x) / a",
    "1",

    "cos(a x)^5 / sin(a x)^2",
    "sin(a x)^3 / (3 a) - 2 sin(a x) / a - 1 / (a sin(a x))",
    "1",

    "cos(a x)^3 / sin(a x)^2",
    "-sin(a x) / a - 1 / (a sin(a x))",
    "1",

    "cos(a x)^5 / sin(a x)",
    "log(sin(a x)) / a + sin(a x)^4 / (4 a) - sin(a x)^2 / a",
    "1",

    "cos(a x)^3 / sin(a x)",
    "log(sin(a x)) / a - sin(a x)^2 / (2 a)",
    "1",

    "cos(a x) sin(a x)^3",
    "sin(a x)^4 / (4 a)",
    "1",

    "cos(a x)^3 sin(a x)^2",
    "-sin(a x)^5 / (5 a) + sin(a x)^3 / (3 a)",
    "1",

    "cos(a x)^2 sin(a x)^3",
    "cos(a x)^5 / (5 a) - cos(a x)^3 / (3 a)",
    "1",

    "cos(a x)^4 sin(a x)",
    "-cos(a x)^5 / (5 a)",
    "1",

    "cos(a x)^7 / sin(a x)^2",
    "-sin(a x)^5 / (5 a) + sin(a x)^3 / a - 3 sin(a x) / a - 1 / (a sin(a x))",
    "1",

    // cos(a x)^n / sin(a x)

    "cos(a x)^2 / sin(a x)",
    "cos(a x) / a + log(tan(1/2 a x)) / a",
    "1",

    "cos(a x)^4 / sin(a x)",
    "4 cos(a x) / (3 a) - cos(a x) sin(a x)^2 / (3 a) + log(tan(1/2 a x)) / a",
    "1",

    "cos(a x)^6 / sin(a x)",
    "cos(a x)^5 / (5 a) - 2 cos(a x)^3 / (3 a) + 2 cos(a x) / a - cos(a x) sin(a x)^2 / a + log(tan(1/2 a x)) / a",
    "1"
];

const integral_tab_power: string[] = [
    "a", // for forms c^d where both c and d are constant expressions
    "a x",
    "1",

    "1 / x",
    "log(x)",
    "1",

    "x^a", // integrand
    "x^(a + 1) / (a + 1)", // answer
    "not(a = -1)", // condition

    "a^x",
    "a^x / log(a)",
    "or(not(number(a)),a>0)",

    "1 / (a + b x)",
    "log(a + b x) / b",
    "1",
    // 124
    "sqrt(a x + b)",
    "2/3 (a x + b)^(3/2) / a",
    "1",
    // 138
    "sqrt(a x^2 + b)",
    "1/2 x sqrt(a x^2 + b) + 1/2 b log(sqrt(a) sqrt(a x^2 + b) + a x) / sqrt(a)",
    "1",
    // 131
    "1 / sqrt(a x + b)",
    "2 sqrt(a x + b) / a",
    "1",

    "1 / ((a + b x)^2)",
    "-1 / (b (a + b x))",
    "1",

    "1 / ((a + b x)^3)",
    "-1 / ((2 b) ((a + b x)^2))",
    "1",
    // 16
    "1 / (a x^2 + b)",
    "arctan(sqrt(a) x / sqrt(b)) / sqrt(a) / sqrt(b)",
    "1",
    // 17
    "1 / sqrt(1 - x^2)",
    "arcsin(x)",
    "1",

    "sqrt(1 + x^2 / (1 - x^2))",
    "arcsin(x)",
    "1",

    "1 / sqrt(a x^2 + b)",
    "log(sqrt(a) sqrt(a x^2 + b) + a x) / sqrt(a)",
    "1",
    // 65
    "1 / (a x^2 + b)^2",
    "1/2 ((arctan((sqrt(a) x) / sqrt(b))) / (sqrt(a) b^(3/2)) + x / (a b x^2 + b^2))",
    "1",
    // 67 (m=2)
    "1 / (a + b x^2)^3",
    "x / (a + b x^2)^2 / (4 a) + 3 x / (8 a (a^2 + a b x^2)) + 3 arctan(b^(1/2) x / a^(1/2),1) / (8 a^(5/2) b^(1/2))",
    "1",
    // 67 (m=3)
    "1 / (a + b x^2)^4",
    "11 x / (16 a (a + b x^2)^3) + 5 b x^3 / (6 a^2 (a + b x^2)^3) + 5 b^2 x^5 / (16 a^3 (a + b x^2)^3) + 5 arctan(b^(1/2) x / a^(1/2),1) / (16 a^(7/2) b^(1/2))",
    "1",
    // 165
    "(a x^2 + b)^(-3/2)",
    "x / b / sqrt(a x^2 + b)",
    "1",
    // 74
    "1 / (a x^3 + b)",
    "-log(a^(2/3) x^2 - a^(1/3) b^(1/3) x + b^(2/3))/(6 a^(1/3) b^(2/3))" +
        " + log(a^(1/3) x + b^(1/3))/(3 a^(1/3) b^(2/3))" +
        " - (i log(1 - (i (1 - (2 a^(1/3) x)/b^(1/3)))/sqrt(3)))/(2 sqrt(3) a^(1/3) b^(2/3))" +
        " + (i log(1 + (i (1 - (2 a^(1/3) x)/b^(1/3)))/sqrt(3)))/(2 sqrt(3) a^(1/3) b^(2/3))", // from Wolfram Alpha
    "1",
    // 77 78
    "1 / (a x^4 + b)",
    "-log(-sqrt(2) a^(1/4) b^(1/4) x + sqrt(a) x^2 + sqrt(b))/(4 sqrt(2) a^(1/4) b^(3/4))" +
        " + log(sqrt(2) a^(1/4) b^(1/4) x + sqrt(a) x^2 + sqrt(b))/(4 sqrt(2) a^(1/4) b^(3/4))" +
        " - (i log(1 - i (1 - (sqrt(2) a^(1/4) x)/b^(1/4))))/(4 sqrt(2) a^(1/4) b^(3/4))" +
        " + (i log(1 + i (1 - (sqrt(2) a^(1/4) x)/b^(1/4))))/(4 sqrt(2) a^(1/4) b^(3/4))" +
        " + (i log(1 - i ((sqrt(2) a^(1/4) x)/b^(1/4) + 1)))/(4 sqrt(2) a^(1/4) b^(3/4))" +
        " - (i log(1 + i ((sqrt(2) a^(1/4) x)/b^(1/4) + 1)))/(4 sqrt(2) a^(1/4) b^(3/4))", // from Wolfram Alpha
    "1",
    //
    "1 / (a x^5 + b)",
    "(sqrt(5) log(2 a^(2/5) x^2 + (sqrt(5) - 1) a^(1/5) b^(1/5) x + 2 b^(2/5))" +
        " - log(2 a^(2/5) x^2 + (sqrt(5) - 1) a^(1/5) b^(1/5) x + 2 b^(2/5))" +
        " - sqrt(5) log(2 a^(2/5) x^2 - (1 + sqrt(5)) a^(1/5) b^(1/5) x + 2 b^(2/5))" +
        " - log(2 a^(2/5) x^2 - (1 + sqrt(5)) a^(1/5) b^(1/5) x + 2 b^(2/5))" +
        " + 4 log(a^(1/5) x + b^(1/5))" +
        " + 2 sqrt(2 (5 + sqrt(5))) arctan((4 a^(1/5) x + (sqrt(5) - 1) b^(1/5))/(sqrt(2 (5 + sqrt(5))) b^(1/5)))" +
        " + 2 sqrt(10 - 2 sqrt(5)) arctan((4 a^(1/5) x - (1 + sqrt(5)) b^(1/5))/(sqrt(10 - 2 sqrt(5)) b^(1/5))))/(20 a^(1/5) b^(4/5))", // from Wolfram Alpha
    "1",
    // 164
    "sqrt(a + x^6 + 3 a^(1/3) x^4 + 3 a^(2/3) x^2)",
    "1/4 (x sqrt((x^2 + a^(1/3))^3) + 3/2 a^(1/3) x sqrt(x^2 + a^(1/3)) + 3/2 a^(2/3) log(x + sqrt(x^2 + a^(1/3))))",
    "1",
    // 165
    "sqrt(-a + x^6 - 3 a^(1/3) x^4 + 3 a^(2/3) x^2)",
    "1/4 (x sqrt((x^2 - a^(1/3))^3) - 3/2 a^(1/3) x sqrt(x^2 - a^(1/3)) + 3/2 a^(2/3) log(x + sqrt(x^2 - a^(1/3))))",
    "1",

    "sinh(x)^2",
    "sinh(2 x) 1/4 - x 1/2",
    "1",

    "tanh(x)^2",
    "x - tanh(x)",
    "1",

    "cosh(x)^2",
    "sinh(2 x) 1/4 + x 1/2",
    "1"
];

const integral_tab: string[] = [
    "a",
    "a x",
    "1",

    "x",
    "1/2 x^2",
    "1",
    // 18
    "x / sqrt(a x^2 + b)",
    "sqrt(a x^2 + b) / a",
    "1",

    "x / (a + b x)",
    "x / b - a log(a + b x) / (b b)",
    "1",

    "x / ((a + b x)^2)",
    "(log(a + b x) + a / (a + b x)) / (b^2)",
    "1",
    // 33
    "x^2 / (a + b x)",
    "a^2 log(a + b x) / b^3 + x (b x - 2 a) / (2 b^2)",
    "1",
    // 34
    "x^2 / (a + b x)^2",
    "(-a^2 / (a + b x) - 2 a log(a + b x) + b x) / b^3",
    "1",

    "x^2 / (a + b x)^3",
    "(log(a + b x) + 2 a / (a + b x) - a^2 / (2 ((a + b x)^2))) / (b^3)",
    "1",

    "1 / x / (a + b x)",
    "-log((a + b x) / x) / a",
    "1",

    "1 / x / (a + b x)^2",
    "1 / (a (a + b x)) - log((a + b x) / x) / (a^2)",
    "1",

    "1 / x / (a + b x)^3",
    "(1/2 ((2 a + b x) / (a + b x))^2 + log(x / (a + b x))) / (a^3)",
    "1",

    "1 / x^2 / (a + b x)",
    "-1 / (a x) + b log((a + b x) / x) / (a^2)",
    "1",

    "1 / x^3 / (a + b x)",
    "(2 b x - a) / (2 a^2 x^2) + b^2 log(x / (a + b x)) / (a^3)",
    "1",

    "1 / x^2 / (a + b x)^2",
    "-(a + 2 b x) / (a^2 x (a + b x)) + 2 b log((a + b x) / x) / (a^3)",
    "1",

    "x / (a + b x^2)",
    "log(a + b x^2) / (2 b)",
    "1",
    // 64
    "x^2 / (a x^2 + b)",
    "1/2 i a^(-3/2) sqrt(b) (log(1 + i sqrt(a) x / sqrt(b)) - log(1 - i sqrt(a) x / sqrt(b))) + x / a",
    "1",
    // 68 (m=1)
    "x / (a + b x^2)^2",
    "-1 / (2 b (a + b x^2))",
    "1",
    // 68 (m=2)
    "x / (a + b x^2)^3",
    "-1 / (4 b (a + b x^2)^2)",
    "1",
    // 68 (m=3)
    "x / (a + b x^2)^4",
    "-1 / (6 b (a + b x^2)^3)",
    "1",
    // 69 (m=1)
    "x^2 / (a + b x^2)^2",
    "-x / (2 b (a + b x^2)) + arctan(sqrt(b/a) x) / (2 sqrt(a b^3))",
    "1",
    // 69 (m=2)
    "x^2 / (a + b x^2)^3",
    "x^3 / (8 a (a + b x^2)^2) + arctan(b^(1/2) x / a^(1/2),1) / (8 a^(3/2) b^(3/2)) - x / (8 b (a + b x^2)^2)",
    "1",
    // 69 (m=3)
    "x^2 / (a + b x^2)^4",
    "x^3 / (6 a (a + b x^2)^3) + b x^5 / (16 a^2 (a + b x^2)^3) + arctan(b^(1/2) x / a^(1/2),1) / (16 a^(5/2) b^(3/2)) - x / (16 b (a + b x^2)^3)",
    "1",
    // 70
    "1 / x * 1 / (a + b x^2)",
    "1 log(x^2 / (a + b x^2)) / (2 a)",
    "1",
    // 71
    "1 / x^2 * 1 / (a x^2 + b)",
    "1/2 i sqrt(a) b^(-3/2) (log(1 + i sqrt(a) x / sqrt(b)) - log(1 - i sqrt(a) x / sqrt(b))) - 1 / (b x)",
    "1",
    // 75
    "x / (a x^3 + b)",
    "log(a^(2/3) x^2 - a^(1/3) b^(1/3) x + b^(2/3))/(6 a^(2/3) b^(1/3))" +
        " - log(a^(1/3) x + b^(1/3))/(3 a^(2/3) b^(1/3))" +
        " - (i log(1 - (i (1 - (2 a^(1/3) x)/b^(1/3)))/sqrt(3)))/(2 sqrt(3) a^(2/3) b^(1/3))" +
        " + (i log(1 + (i (1 - (2 a^(1/3) x)/b^(1/3)))/sqrt(3)))/(2 sqrt(3) a^(2/3) b^(1/3))", // from Wolfram Alpha
    "1",
    // 76
    "x^2 / (a + b x^3)",
    "1 log(a + b x^3) / (3 b)",
    "1",
    // 79 80
    "x / (a x^4 + b)",
    "(i log(1 - (i sqrt(a) x^2)/sqrt(b)))/(4 sqrt(a) sqrt(b))" + " - (i log(1 + (i sqrt(a) x^2)/sqrt(b)))/(4 sqrt(a) sqrt(b))", // from Wolfram Alpha
    "1",
    // 81 82
    "x^2 / (a x^4 + b)",
    "log(-sqrt(2) a^(1/4) b^(1/4) x + sqrt(a) x^2 + sqrt(b))/(4 sqrt(2) a^(3/4) b^(1/4))" +
        " - log(sqrt(2) a^(1/4) b^(1/4) x + sqrt(a) x^2 + sqrt(b))/(4 sqrt(2) a^(3/4) b^(1/4))" +
        " - (i log(1 - i (1 - (sqrt(2) a^(1/4) x)/b^(1/4))))/(4 sqrt(2) a^(3/4) b^(1/4))" +
        " + (i log(1 + i (1 - (sqrt(2) a^(1/4) x)/b^(1/4))))/(4 sqrt(2) a^(3/4) b^(1/4))" +
        " + (i log(1 - i ((sqrt(2) a^(1/4) x)/b^(1/4) + 1)))/(4 sqrt(2) a^(3/4) b^(1/4))" +
        " - (i log(1 + i ((sqrt(2) a^(1/4) x)/b^(1/4) + 1)))/(4 sqrt(2) a^(3/4) b^(1/4))", // from Wolfram Alpha
    "1",
    //
    "x^3 / (a + b x^4)",
    "1 log(a + b x^4) / (4 b)",
    "1",

    "x sqrt(a + b x)",
    "-2 (2 a - 3 b x) sqrt((a + b x)^3) 1/15 / (b^2)",
    "1",

    "x^2 sqrt(a + b x)",
    "2 (8 a^2 - 12 a b x + 15 b^2 x^2) sqrt((a + b x)^3) 1/105 / (b^3)",
    "1",

    "x^2 sqrt(a + b x^2)",
    "(sqrt(b) x sqrt(a + b x^2) (a + 2 b x^2) - a^2 log(sqrt(b) sqrt(a + b x^2) + b x)) / (8 b^(3/2))",
    "1",
    // 128
    "sqrt(a x + b) / x",
    "2 sqrt(a x + b) - 2 sqrt(b) arctanh(sqrt(a x + b) / sqrt(b))",
    "1",
    // 129
    "sqrt(a x + b) / x^2",
    "-sqrt(a x + b) / x - a arctanh(sqrt(a x + b) / sqrt(b)) / sqrt(b)",
    "1",

    "x / sqrt(a + b x)",
    "-2 (2 a - b x) sqrt(a + b x) / (3 (b^2))",
    "1",

    "x^2 / sqrt(a + b x)",
    "2 (8 a^2 - 4 a b x + 3 b^2 x^2) sqrt(a + b x) / (15 (b^3))",
    "1",
    // 134
    "1 / x / sqrt(a x + b)",
    "-2 arctanh(sqrt(a x + b) / sqrt(b)) / sqrt(b)",
    "1",
    // 137
    "1 / x^2 / sqrt(a x + b)",
    "a arctanh(sqrt(a x + b) / sqrt(b)) / b^(3/2) - sqrt(a x + b) / (b x)",
    "1",
    // 158
    "1 / x / sqrt(a x^2 + b)",
    "(log(x) - log(sqrt(b) sqrt(a x^2 + b) + b)) / sqrt(b)",
    "1",
    // 160
    "sqrt(a x^2 + b) / x",
    "sqrt(a x^2 + b) - sqrt(b) log(sqrt(b) sqrt(a x^2 + b) + b) + sqrt(b) log(x)",
    "1",
    // 163
    "x sqrt(a x^2 + b)",
    "1/3 (a x^2 + b)^(3/2) / a",
    "1",
    // 166
    "x (a x^2 + b)^(-3/2)",
    "-1 / a / sqrt(a x^2 + b)",
    "1",

    "x sqrt(a + x^6 + 3 a^(1/3) x^4 + 3 a^(2/3) x^2)",
    "1/5 sqrt((x^2 + a^(1/3))^5)",
    "1",
    // 168
    "x^2 sqrt(a x^2 + b)",
    "1/8 a^(-3/2) (sqrt(a) x sqrt(a x^2 + b) (2 a x^2 + b) - b^2 log(sqrt(a) sqrt(a x^2 + b) + a x))",
    "and(number(a),a>0)",
    // 169
    "x^3 sqrt(a x^2 + b)",
    "1/15 sqrt(a x^2 + b) (3 a^2 x^4 + a b x^2 - 2 b^2) / a^2",
    "1",
    // 171
    "x^2 / sqrt(a x^2 + b)",
    "1/2 a^(-3/2) (sqrt(a) x sqrt(a x^2 + b) - b log(sqrt(a) sqrt(a x^2 + b) + a x))",
    "1",
    // 172
    "x^3 / sqrt(a x^2 + b)",
    "1/3 (a x^2 - 2 b) sqrt(a x^2 + b) / a^2",
    "1",
    // 173
    "1 / x^2 / sqrt(a x^2 + b)",
    "-sqrt(a x^2 + b) / (b x)",
    "1",
    // 174
    "1 / x^3 / sqrt(a x^2 + b)",
    "-sqrt(a x^2 + b) / (2 b x^2) + a (log(sqrt(b) sqrt(a x^2 + b) + b) - log(x)) / (2 b^(3/2))",
    "1",
    // 216
    "sqrt(a x^2 + b) / x^2",
    "sqrt(a) log(sqrt(a) sqrt(a x^2 + b) + a x) - sqrt(a x^2 + b) / x",
    "and(number(a),a>0)",
    // 217
    "sqrt(a x^2 + b) / x^3",
    "1/2 (-sqrt(a x^2 + b) / x^2 - (a log(sqrt(b) sqrt(a x^2 + b) + b)) / sqrt(b) + (a log(x)) / sqrt(b))",
    "and(number(b),b>0)",

    "arcsin(a x)",
    "x arcsin(a x) + sqrt(1 - a^2 x^2) / a",
    "1",

    "arccos(a x)",
    "x arccos(a x) + sqrt(1 - a^2 x^2) / a",
    "1",

    "arctan(a x)",
    "x arctan(a x) - log(1 + a^2 x^2) / (2 a)",
    "1",

    "sinh(x)",
    "cosh(x)",
    "1",

    "cosh(x)",
    "sinh(x)",
    "1",

    "tanh(x)",
    "log(cosh(x))",
    "1",

    "x sinh(x)",
    "x cosh(x) - sinh(x)",
    "1",

    "x cosh(x)",
    "x sinh(x) - cosh(x)",
    "1",

    "erf(a x)",
    "x erf(a x) + exp(-a^2 x^2) / (a sqrt(pi))",
    "1",

    "x^2 (1 - x^2)^(3/2)",
    "(x sqrt(1 - x^2) (-8 x^4 + 14 x^2 - 3) + 3 arcsin(x)) 1/48",
    "1",

    "x^2 (1 - x^2)^(5/2)",
    "(x sqrt(1 - x^2) (48 x^6 - 136 x^4 + 118 x^2 - 15) + 15 arcsin(x)) 1/384",
    "1",

    "x^4 (1 - x^2)^(3/2)",
    "(-x sqrt(1 - x^2) (16 x^6 - 24 x^4 + 2 x^2 + 3) + 3 arcsin(x)) 1/128",
    "1"
];

export function stack_integral(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);

    p1 = cddr(p1);

    if (!is_cons(p1)) {
        push(X_LOWER, $);
        integral(env, ctrl, $);
        return;
    }

    let flag = 0;
    let X: U;
    let Y: U = nil;

    while (is_cons(p1) || flag) {
        if (flag) {
            X = Y;
            flag = 0;
        } else {
            push(car(p1), $);
            value_of(env, ctrl, $);
            X = pop($);
            p1 = cdr(p1);
        }

        if (is_num(X)) {
            push(X, $);
            const n = pop_integer($);
            push(X_LOWER, $);
            X = pop($);
            for (let i = 0; i < n; i++) {
                push(X, $);
                integral(env, ctrl, $);
            }
            continue;
        }

        if (!(is_sym(X) && env.hasUserFunction(X))) stopf("integral");

        if (is_cons(p1)) {
            push(car(p1), $);
            value_of(env, ctrl, $);
            Y = pop($);
            p1 = cdr(p1);

            if (is_num(Y)) {
                push(Y, $);
                const n = pop_integer($);
                for (let i = 0; i < n; i++) {
                    push(X, $);
                    integral(env, ctrl, $);
                }
                continue;
            }

            flag = 1;
        }

        push(X, $);
        integral(env, ctrl, $);
    }
}

function integral(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const X = pop($);
    let F = pop($);

    if (!(is_sym(X) && env.hasUserFunction(X))) stopf("integral: symbol expected");

    if (car(F).equals(ADD)) {
        const h = $.length;
        let p1 = cdr(F);
        while (is_cons(p1)) {
            push(car(p1), $);
            push(X, $);
            integral(env, ctrl, $);
            p1 = cdr(p1);
        }
        sum_terms($.length - h, env, ctrl, $);
        return;
    }

    if (car(F).equals(MULTIPLY)) {
        push(F, $);
        push(X, $);
        partition_term($); // push const part then push var part
        F = pop($); // pop var part
        integral_nib(F, X, env, ctrl, $);
        multiply_factors(2, env, ctrl, $); // multiply by const part
        return;
    }

    integral_nib(F, X, env, ctrl, $);
}

function integral_nib(F: U, X: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    save_symbol(DOLLAR_A, env);
    save_symbol(DOLLAR_B, env);
    save_symbol(DOLLAR_X, env);

    set_symbol(DOLLAR_X, X, nil, env);

    // put constants in F(X) on the stack

    const h = $.length;

    push_integer(1, $); // 1 is a candidate for a or b

    push(F, $);
    push(X, $);
    decomp(env, ctrl, $); // push const coeffs

    integral_lookup(h, F, env, ctrl, $);

    restore_symbol(env);
    restore_symbol(env);
    restore_symbol(env);
}

function integral_lookup(h: number, F: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const t = integral_classify(F);

    if (t & 1 && integral_search(h, F, integral_tab_exp, integral_tab_exp.length, env, ctrl, $, { useCaretForExponentiation: true, useParenForTensors: true })) return;

    if (t & 2 && integral_search(h, F, integral_tab_log, integral_tab_log.length, env, ctrl, $, { useCaretForExponentiation: true, useParenForTensors: true })) return;

    if (t & 4 && integral_search(h, F, integral_tab_trig, integral_tab_trig.length, env, ctrl, $, { useCaretForExponentiation: true, useParenForTensors: true })) return;

    if (car(F).equals(POWER)) {
        if (integral_search(h, F, integral_tab_power, integral_tab_power.length, env, ctrl, $, { useCaretForExponentiation: true, useParenForTensors: true })) return;
    } else {
        if (integral_search(h, F, integral_tab, integral_tab.length, env, ctrl, $, { useCaretForExponentiation: true, useParenForTensors: true })) {
            return;
        }
    }

    stopf("integral: no solution found");
}

function integral_classify(p: U): number {
    if (is_cons(p)) {
        let t = 0;
        while (is_cons(p)) {
            t |= integral_classify(car(p));
            p = cdr(p);
        }
        return t;
    }

    if (p.equals(MATH_E)) {
        return 1;
    }

    if (p.equals(LOG)) {
        return 2;
    }

    if (p.equals(SIN) || p.equals(COS) || p.equals(TAN)) {
        return 4;
    }

    return 0;
}

/**
 *
 * @param h
 * @param F
 * @param table
 * @param n
 * @param $
 * @param config A configuration which is appropriate for the table
 * @returns
 */
function integral_search(h: number, F: U, table: string[], n: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, config: EigenmathParseConfig): 0 | 1 {
    let i: number;
    let C: U;
    let I: U;

    for (i = 0; i < n; i += 3) {
        scan_integrals(table[i + 0], env, ctrl, $, config); // integrand
        I = pop($);

        scan_integrals(table[i + 2], env, ctrl, $, config); // condition
        C = pop($);

        if (integral_search_nib(h, F, I, C, env, ctrl, $)) break;
    }

    if (i >= n) return 0;

    $.splice(h); // pop all

    scan_integrals(table[i + 1], env, ctrl, $, config); // answer
    value_of(env, ctrl, $);

    return 1;
}

function integral_search_nib(h: number, F: U, I: U, C: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): 0 | 1 {
    for (let i = h; i < $.length; i++) {
        set_symbol(DOLLAR_A, $.getAt(i), nil, env);

        for (let j = h; j < $.length; j++) {
            set_symbol(DOLLAR_B, $.getAt(j), nil, env);

            push(C, $); // condition ok?
            value_of(env, ctrl, $);
            let p1 = pop($);
            if (iszero(p1, env)) continue; // no, go to next j

            push(F, $); // F = I?
            push(I, $);
            value_of(env, ctrl, $);
            subtract(env, ctrl, $);
            p1 = pop($);
            if (iszero(p1, env)) return 1; // yes
        }
    }

    return 0; // no
}

export function stack_inv(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    inv(env, ctrl, $);
}

function inv(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (!istensor(p1)) {
        push(p1, $);
        reciprocate(env, ctrl, $);
        return;
    }

    if (!issquarematrix(p1)) stopf("inv: square matrix expected");

    push(p1, $);
    adj(env, ctrl, $);

    push(p1, $);
    det(env, ctrl, $);

    divide(env, ctrl, $);
}

/**
 * (kronecker a b ...)
 */
export function stack_kronecker(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const argList = expr.argList;
    try {
        const a = argList.head;
        push(a, $);
        value_of(env, ctrl, $);
        let bs = argList.rest;
        while (is_cons(bs)) {
            const b = bs.head;
            push(b, $);
            value_of(env, ctrl, $);
            kronecker(env, ctrl, $);
            bs = bs.rest;
        }
    } finally {
        argList.release();
    }
}

/**
 * kronecker(a,b)
 */
export function kronecker(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const b = pop($);
    const a = pop($);

    if (!istensor(a) || !istensor(b)) {
        push(a, $);
        push(b, $);
        multiply(env, ctrl, $);
        return;
    }

    if (a.ndim > 2 || b.ndim > 2) {
        stopf("kronecker");
    }

    const m = a.dims[0];
    const n = a.ndim === 1 ? 1 : a.dims[1];

    const p = b.dims[0];
    const q = b.ndim === 1 ? 1 : b.dims[1];

    const ab = alloc_tensor();

    // result matrix has (m * p) rows and (n * q) columns

    let h = 0;

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < p; j++) {
            for (let k = 0; k < n; k++) {
                for (let l = 0; l < q; l++) {
                    push(a.elems[n * i + k], $);
                    push(b.elems[q * j + l], $);
                    multiply(env, ctrl, $);
                    ab.elems[h++] = pop($);
                }
            }
        }
    }

    // dim info

    ab.dims[0] = m * p;

    if (n * q > 1) {
        ab.dims[1] = n * q;
    }

    push(ab, $);
}

export function stack_log(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const argList = expr.argList;
    try {
        const x = argList.head;
        try {
            $.push(x);
            value_of(env, ctrl, $);
            logfunc(env, ctrl, $);
        } finally {
            x.release();
        }
    } finally {
        argList.release();
    }
}

function logfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    let x = pop($);

    if (is_tensor(x)) {
        push(elementwise(x, logfunc, env, ctrl, $), $);
        return;
    }

    // log of zero is not evaluated

    if (iszero(x, env)) {
        push(LOG, $);
        push_integer(0, $);
        list(2, $);
        return;
    }

    if (is_flt(x)) {
        const d = x.toNumber();
        if (d > 0.0) {
            push_double(Math.log(d), $);
            return;
        }
    }

    // log(z) -> log(mag(z)) + i arg(z)

    if (is_flt(x) || isdoublez(x)) {
        push(x, $);
        mag(env, ctrl, $);
        logfunc(env, ctrl, $);
        push(x, $);
        arg(env, ctrl, $);
        push(imu, $);
        multiply(env, ctrl, $);
        add(env, ctrl, $);
        return;
    }

    // log(1) -> 0

    if (isplusone(x)) {
        push_integer(0, $);
        return;
    }

    // log(e) -> 1

    if (x.equals(MATH_E)) {
        push_integer(1, $);
        return;
    }

    if (is_num(x) && isnegativenumber(x)) {
        push(x, $);
        negate(env, ctrl, $);
        logfunc(env, ctrl, $);
        push(imu, $);
        push(MATH_PI, $);
        multiply(env, ctrl, $);
        add(env, ctrl, $);
        return;
    }

    // log(10) -> log(2) + log(5)

    if (is_rat(x)) {
        const h = $.length;
        push(x, $);
        factor_factor(env, ctrl, $);
        for (let i = h; i < $.length; i++) {
            const p2 = $.getAt(i);
            if (is_cons(p2) && is_sym(p2.opr) && is_native(p2.opr, Native.pow)) {
                push(p2.expo, $);
                push(LOG, $);
                push(p2.base, $);
                list(2, $);
                multiply(env, ctrl, $);
            } else {
                push(LOG, $);
                push(p2, $);
                list(2, $);
            }
            $.setAt(i, pop($));
        }
        sum_terms($.length - h, env, ctrl, $);
        return;
    }

    // log(a ^ b) -> b log(a)

    if (car(x).equals(POWER)) {
        push(caddr(x), $);
        push(cadr(x), $);
        logfunc(env, ctrl, $);
        multiply(env, ctrl, $);
        return;
    }

    // log(a * b) -> log(a) + log(b)

    if (car(x).equals(MULTIPLY)) {
        const h = $.length;
        x = cdr(x);
        while (is_cons(x)) {
            push(car(x), $);
            logfunc(env, ctrl, $);
            x = cdr(x);
        }
        sum_terms($.length - h, env, ctrl, $);
        return;
    }

    push(LOG, $);
    push(x, $);
    list(2, $);
}

/**
 * Returns a copy of the source Tensor with foo applied to each element.
 * @param source
 * @param foo A function that is expected to pop a single value from the stack and push the result.
 */
export function elementwise(source: Tensor, foo: (env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack) => void, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): Tensor {
    const T = copy_tensor(source);
    const n = T.nelem;
    for (let i = 0; i < n; i++) {
        push(T.elems[i], $);
        foo(env, ctrl, $);
        T.elems[i] = pop($);
    }
    return T;
}

export function stack_minor(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    const p2 = pop($);

    push(caddr(p1), $);
    value_of(env, ctrl, $);
    const i = pop_integer($);

    push(cadddr(p1), $);
    value_of(env, ctrl, $);
    const j = pop_integer($);

    if (!istensor(p2) || p2.ndim !== 2 || p2.dims[0] !== p2.dims[1]) stopf("minor");

    if (i < 1 || i > p2.dims[0] || j < 0 || j > p2.dims[1]) stopf("minor");

    push(p2, $);

    minormatrix(i, j, $);

    det(env, ctrl, $);
}

export function stack_minormatrix(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    const p2 = pop($);

    push(caddr(p1), $);
    value_of(env, ctrl, $);
    const i = pop_integer($);

    push(cadddr(p1), $);
    value_of(env, ctrl, $);
    const j = pop_integer($);

    if (!istensor(p2) || p2.ndim !== 2) stopf("minormatrix: matrix expected");

    if (i < 1 || i > p2.dims[0] || j < 0 || j > p2.dims[1]) stopf("minormatrix: index err");

    push(p2, $);

    minormatrix(i, j, $);
}

function minormatrix(row: number, col: number, $: ProgramStack): void {
    const p1 = pop($) as Tensor;

    const n = p1.dims[0];
    const m = p1.dims[1];

    if (n === 2 && m === 2) {
        if (row === 1) {
            if (col === 1) push(p1.elems[3], $);
            else push(p1.elems[2], $);
        } else {
            if (col === 1) push(p1.elems[1], $);
            else push(p1.elems[0], $);
        }
        return;
    }

    let p2: Tensor;

    if (n === 2) {
        p2 = alloc_vector(m - 1);
    } else if (m === 2) {
        p2 = alloc_vector(n - 1);
    } else if (n > 2 && m > 2) {
        p2 = alloc_matrix(n - 1, m - 1);
    } else {
        stopf("minormatrix is undefined.");
    }

    row--;
    col--;

    let k = 0;

    for (let i = 0; i < n; i++) {
        if (i === row) continue;

        for (let j = 0; j < m; j++) {
            if (j === col) continue;

            p2.elems[k++] = p1.elems[m * i + j];
        }
    }

    push(p2, $);
}

export function stack_mod(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    push(caddr(p1), $);
    value_of(env, ctrl, $);
    modfunc(env, ctrl, $);
}

function modfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p2 = pop($);
    const p1 = pop($);

    if (is_tensor(p1)) {
        const T = copy_tensor(p1);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(T.elems[i], $);
            push(p2, $);
            modfunc(env, ctrl, $);
            p1.elems[i] = pop($);
        }
        push(p1, $);
        return;
    }

    if (!is_num(p1) || !is_num(p2) || iszero(p2, env)) {
        push(MOD, $);
        push(p1, $);
        push(p2, $);
        list(3, $);
        return;
    }

    if (is_rat(p1) && is_rat(p2)) {
        mod_rationals(p1, p2, env, ctrl, $);
        return;
    }

    const d1 = p1.toNumber();
    const d2 = p2.toNumber();

    push_double(d1 % d2, $);
}

function mod_rationals(p1: Rat, p2: Rat, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    if (isinteger(p1) && isinteger(p2)) {
        mod_integers(p1, p2, $);
        return;
    }
    push(p1, $);
    push(p1, $);
    push(p2, $);
    divide(env, ctrl, $);
    absfunc(env, ctrl, $);
    floorfunc(env, ctrl, $);
    push(p2, $);
    multiply(env, ctrl, $);
    if (p1.sign === p2.sign) {
        negate(env, ctrl, $);
    }
    add(env, ctrl, $);
}

function mod_integers(p1: Rat, p2: Rat, $: ProgramStack): void {
    const a = bignum_mod(p1.a, p2.a);
    const b = bignum_int(1);
    push_bignum(p1.sign, a, b, $);
}

export function stack_multiply(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const h0 = $.length;
    const argList = expr.argList;
    try {
        ctrl.pushDirective(Directive.expanding, ctrl.getDirective(Directive.expanding) - 1);
        try {
            let factors = argList;
            while (is_cons(factors)) {
                $.push(factors);
                $.head();
                value_of(env, ctrl, $);
                factors = factors.rest;
            }
            const n = $.length - h0;
            multiply_factors(n, env, ctrl, $);
        } finally {
            ctrl.popDirective();
        }
    } finally {
        argList.release();
    }
}

export function stack_noexpand(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    ctrl.pushDirective(Directive.expanding, 0);
    try {
        push(cadr(p1), $);
        value_of(env, ctrl, $);
    } finally {
        ctrl.popDirective();
    }
}

/**
 * This isn't actually a function that is matched, hence the ProgramFrame
 */
export function evaluate_nonstop(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    if (ctrl.getDirective(Directive.nonstop)) {
        const expr = pop($);
        try {
            push(nil, $);
            return; // not reentrant
        } finally {
            expr.release();
        }
    }

    ctrl.pushDirective(Directive.nonstop, 1);
    try {
        evaluate_nonstop_nib(env, ctrl, $);
    } finally {
        ctrl.popDirective();
    }
}

function evaluate_nonstop_nib(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const save_tos = $.length - 1;
    const save_tof = frame.length; // TODO: Why the off-by-one?

    try {
        value_of(env, ctrl, $);
    } catch (errmsg) {
        $.splice(save_tos);
        frame.splice(save_tof);

        push(nil, $); // return value
    }
}

export function isfalsey(x: U, env: ProgramEnv): boolean {
    if (is_boo(x)) {
        return x.isFalse();
    }
    return iszero(x, env);
}

export function stack_not(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    $.push(expr);
    $.rest();
    $.head();
    evalp(env, ctrl, $);
    const x = pop($);
    try {
        if (isfalsey(x, env)) {
            push(predicate_return_value(true, ctrl), $);
        } else {
            push(predicate_return_value(false, ctrl), $);
        }
    } finally {
        x.release();
    }
}
const DELTA = 1e-6;
const EPSILON = 1e-9;

export function stack_nroots(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    $.push(expr); //  [..., expr]
    $.rest(); //  [..., argList]
    $.dupl(); //  [..., argList, argList]
    $.head(); //  [..., argList, argList.head]
    value_of(env, ctrl, $); //  [..., argList, p]

    $.swap(); //  [..., p, argList]
    $.rest(); //  [..., p, argList.argList]
    $.head(); //  [..., p, argList.argList.head];
    value_of(env, ctrl, $); //  [..., p, x] or [..., p, nil]

    if ($.isatom) {
        // We'll assume it's a symbol. We should check.
    } else if ($.iscons) {
        // TODO: diagnostic that the variable parameter must be a symbol.
        throw new ProgrammingError();
    } else {
        // It's nil
        $.pop().release(); //  [..., p]
        const p = $.pop(); //  [...]
        const x = guess(p);
        try {
            $.push(p); //  [..., p]
            $.push(x); //  [..., p , x]
        } finally {
            p.release();
            x.release();
        }
    }

    nroots(env, ctrl, $);
}

/**
 * [..., p , x]
 */
function nroots(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const X = pop($);
    const P = pop($);

    try {
        const cr: number[] = [];
        const ci: number[] = [];
        const tr: number[] = [];
        const ti: number[] = [];

        const h = $.length;

        coeffs(P, X, env, ctrl, $); // put coeffs on stack

        let n = $.length - h; // number of coeffs on stack

        // convert coeffs to floating point

        for (let i = 0; i < n; i++) {
            push($.getAt(h + i), $);
            real(env, ctrl, $);
            floatfunc(env, ctrl, $);
            const RE = pop($);

            push($.getAt(h + i), $);
            imag(env, ctrl, $);
            floatfunc(env, ctrl, $);
            const IM = pop($);

            if (!is_flt(RE) || !is_flt(IM)) stopf("nroots: coeffs");

            cr[i] = RE.d;
            ci[i] = IM.d;
        }

        $.splice(h); // pop all

        // divide p(x) by leading coeff

        const xr = cr[n - 1];
        const xi = ci[n - 1];

        const d = xr * xr + xi * xi;

        for (let i = 0; i < n - 1; i++) {
            const yr = (cr[i] * xr + ci[i] * xi) / d;
            const yi = (ci[i] * xr - cr[i] * xi) / d;
            cr[i] = yr;
            ci[i] = yi;
        }

        cr[n - 1] = 1.0;
        ci[n - 1] = 0.0;

        // find roots

        while (n > 1) {
            nfindroot(cr, ci, n, tr, ti);

            let ar = tr[0];
            let ai = ti[0];

            if (Math.abs(ar) < DELTA * Math.abs(ai)) ar = 0;

            if (Math.abs(ai) < DELTA * Math.abs(ar)) ai = 0;

            // push root

            push_double(ar, $);
            push_double(ai, $);
            push(imu, $);
            multiply(env, ctrl, $);
            add(env, ctrl, $);

            // divide p(x) by x - a

            nreduce(cr, ci, n, ar, ai);

            // note: leading coeff of p(x) is still 1

            n--;
        }

        n = $.length - h; // number of roots on stack

        if (n === 0) {
            push(nil, $); // no roots
            return;
        }

        if (n === 1) {
            return; // one root
        }

        sort(n, env, ctrl, $);

        const A = alloc_vector(n);

        for (let i = 0; i < n; i++) {
            A.elems[i] = $.getAt(h + i);
        }

        $.splice(h); // pop all

        push(A, $);
    } finally {
        X.release();
        P.release();
    }
}

function nfindroot(cr: number[], ci: number[], n: number, par: number[], pai: number[]): void {
    const tr: number[] = [];
    const ti: number[] = [];

    // if const term is zero then root is zero

    // note: use exact zero, not "close to zero"

    // term will be exactly zero from coeffs(), no need for arbitrary cutoff

    if (cr[0] === 0.0 && ci[0] === 0.0) {
        par[0] = 0.0;
        pai[0] = 0.0;
        return;
    }

    // secant method

    for (let i = 0; i < 100; i++) {
        let ar = urandom();
        let ai = urandom();

        fata(cr, ci, n, ar, ai, tr, ti);

        let far = tr[0];
        let fai = ti[0];

        let br = ar;
        let bi = ai;

        let fbr = far;
        let fbi = fai;

        ar = urandom();
        ai = urandom();

        for (let j = 0; j < 1000; j++) {
            fata(cr, ci, n, ar, ai, tr, ti);

            far = tr[0];
            fai = ti[0];

            if (zabs(far, fai) < EPSILON) {
                par[0] = ar;
                pai[0] = ai;
                return;
            }

            if (zabs(far, fai) < zabs(fbr, fbi)) {
                let xr = ar;
                let xi = ai;

                ar = br;
                ai = bi;

                br = xr;
                bi = xi;

                xr = far;
                xi = fai;

                far = fbr;
                fai = fbi;

                fbr = xr;
                fbi = xi;
            }

            // dx = b - a

            const dxr = br - ar;
            const dxi = bi - ai;

            // df = fb - fa

            const dfr = fbr - far;
            const dfi = fbi - fai;

            // y = dx / df

            const d = dfr * dfr + dfi * dfi;

            if (d === 0.0) break;

            const yr = (dxr * dfr + dxi * dfi) / d;
            const yi = (dxi * dfr - dxr * dfi) / d;

            // a = b - y * fb

            ar = br - (yr * fbr - yi * fbi);
            ai = bi - (yr * fbi + yi * fbr);
        }
    }

    stopf("nroots: convergence error");
}

// compute f at a

function fata(cr: number[], ci: number[], n: number, ar: number, ai: number, far: number[], fai: number[]): void {
    let yr = cr[n - 1];
    let yi = ci[n - 1];

    for (let k = n - 2; k >= 0; k--) {
        // x = a * y

        const xr = ar * yr - ai * yi;
        const xi = ar * yi + ai * yr;

        // y = x + c

        yr = xr + cr[k];
        yi = xi + ci[k];
    }

    far[0] = yr;
    fai[0] = yi;
}

// divide by x - a

function nreduce(cr: number[], ci: number[], n: number, ar: number, ai: number): void {
    // divide

    for (let k = n - 1; k > 0; k--) {
        cr[k - 1] += cr[k] * ar - ci[k] * ai;
        ci[k - 1] += ci[k] * ar + cr[k] * ai;
    }

    if (zabs(cr[0], ci[0]) > DELTA) stopf("nroots: residual error"); // not a root

    // shift

    for (let k = 0; k < n - 1; k++) {
        cr[k] = cr[k + 1];
        ci[k] = ci[k + 1];
    }
}

function zabs(r: number, i: number): number {
    return Math.sqrt(r * r + i * i);
}

function urandom(): number {
    return 4.0 * Math.random() - 2.0;
}

export function stack_number(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(expr), $);
    value_of(env, ctrl, $);
    const p1 = pop($);

    if (is_num(p1)) push_integer(1, $);
    else push_integer(0, $);
}

export function stack_numerator(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    numerator(env, ctrl, $);
}

export function numerator(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const x = pop($);

    if (is_rat(x)) {
        const a = x.numer();
        $.push(a);
        a.release();
        return;
    }

    let p1 = x;
    while (find_divisor(p1, env, ctrl, $)) {
        push(p1, $);
        cancel_factor(env, ctrl, $);
        p1 = pop($);
    }

    push(p1, $);
}

export function stack_or(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    p1 = cdr(p1);
    while (is_cons(p1)) {
        push(car(p1), $);
        evalp(env, ctrl, $);
        const p2 = pop($);
        if (!iszero(p2, env)) {
            push_integer(1, $);
            return;
        }
        p1 = cdr(p1);
    }
    push_integer(0, $);
}

export function stack_outer(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const context = new ExprContextFromProgram(env, ctrl);
    try {
        const retval = prolog_eval_varargs(
            expr,
            (values: Cons, env: ExprContext) => {
                $.push(one); //  [1]
                $.push(values); //  [1, (a,b,c,...)]
                while ($.iscons) {
                    $.dupl(); //  [1, (a,b,c,...), (a,b,c,...)]
                    $.rest(); //  [1, (a,b,c,...), (b,c,...)]
                    $.rotateR(3); //  [(b,c,...), 1, (a,b,c,...)]
                    $.head(); //  [(b,c,...), 1, a]
                    outer_prolog(expr, env, ctrl, $); //  [(b,c,...), (1^a)]
                    $.swap(); //  [(1^a), (b,c,...)]
                }
                $.pop().release(); //  [(1 ^ a ^ b ^ c ...)]
                return $.pop();
            },
            context
        );
        $.push(retval);
        retval.release();
    } finally {
        context.release();
    }
}

function is_combo(expr: Cons2<U, U, U>, code: Native): expr is Cons2<Sym, U, U> {
    const opr = expr.opr;
    try {
        if (is_sym(opr)) {
            return opr.id === code;
        } else {
            return false;
        }
    } finally {
        opr.release();
    }
}

/**
 * Determines whether the binary outer expression that is on the stack can be tendered to other operators or
 * handled directly
 *
 * [..., lhs, rhs] => [..., (outer lhs rhs)]
 */
function outer_prolog(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    binop_prolog(Native.outer, expr, outer, env, ctrl, $);
}

/**
 * Determines whether the binary outer expression that is on the stack can be tendered to other operators or
 * handled directly by the `next` function.
 *
 * [..., lhs, rhs] => [..., (code lhs rhs)]
 */
function binop_prolog(code: Native, expr: Cons, next: (env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack) => void, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const rhs = pop($);
    const lhs = pop($);
    try {
        if (is_binop(expr) && is_combo(expr, code)) {
            const a = expr.lhs;
            const b = expr.rhs;
            try {
                if (lhs.equals(a) && rhs.equals(b)) {
                    // We can't put the expression (outer lhs rhs) up for tender to other handlers
                    // because we would go into an infinite loop. So we proceed to handle as much as we can here.
                    $.push(lhs);
                    $.push(rhs);
                    next(env, ctrl, $);
                    return;
                }
            } finally {
                a.release();
                b.release();
            }
        }
        // If we end up here then it's OK to tender the expression to other operators.
        push_native(code, $);
        $.push(lhs);
        $.push(rhs);
        list(3, $);
        value_of(env, ctrl, $);
    } finally {
        lhs.release();
        rhs.release();
    }
}

/**
 * [..., a, b] => [..., (outer a b)]
 */
function outer(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const rhs = pop($);
    const lhs = pop($);
    try {
        if (is_atom(lhs)) {
            if (is_atom(rhs)) {
                const context = new ExprContextFromProgram(env, ctrl);
                try {
                    const retval = handle_atom_atom_binop(native_sym(Native.outer), lhs, rhs, context);
                    $.push(retval);
                    return;
                } finally {
                    context.release();
                }
            } else {
                // console.lg("outer", `${lhs}`, `${lhs.type}`, `${rhs}`);
            }
        } else {
            if (is_atom(rhs)) {
                // console.lg("outer", `${lhs}`, `${rhs}`, `${rhs.type}`);
            } else {
                // A common use case is the outer product of multiplicative expressions.
                // We are landng here and yet we have an overload fro this case.
                if (contains_single_blade(lhs) && contains_single_blade(rhs)) {
                    throw new ProgrammingError(`outer ${lhs} ${rhs}`);
                }
            }
        }

        // Convert anything not involving a Tensor into ordinary multiplication...
        if (!istensor(lhs) || !istensor(rhs)) {
            push(lhs, $);
            push(rhs, $);
            // This is incorrect for blades. For example (5*ex)^ex should be 0, not 5.
            if (contains_single_blade(lhs) && contains_single_blade(rhs)) {
                throw new ProgrammingError(`outer ${lhs} ${rhs}`);
            }
            multiply(env, ctrl, $);
            return;
        }

        // From here on down it's the outer product of tensors.
        // The multiplication is performed using a stack.

        // sync diffs

        const nrow = lhs.nelem;
        const ncol = rhs.nelem;

        const p3 = alloc_tensor();

        for (let i = 0; i < nrow; i++)
            for (let j = 0; j < ncol; j++) {
                push(lhs.elems[i], $);
                push(rhs.elems[j], $);
                multiply(env, ctrl, $);
                p3.elems[i * ncol + j] = pop($);
            }

        // dim info

        let k = 0;

        const nL = lhs.ndim;

        for (let i = 0; i < nL; i++) {
            p3.dims[k++] = lhs.dims[i];
        }

        const nR = rhs.ndim;

        for (let i = 0; i < nR; i++) {
            p3.dims[k++] = rhs.dims[i];
        }

        push(p3, $);
    } finally {
        lhs.release();
        rhs.release();
    }
}

export function stack_polar(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    polar(env, ctrl, $);
}

function polar(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        push(elementwise(p1, polar, env, ctrl, $), $);
        return;
    }

    push(p1, $);
    mag(env, ctrl, $);
    push(imu, $);
    push(p1, $);
    arg(env, ctrl, $);
    const p2 = pop($);
    if (is_flt(p2)) {
        push_double(p2.d / Math.PI, $);
        push(MATH_PI, $);
        multiply_factors(3, env, ctrl, $);
    } else {
        push(p2, $);
        multiply_factors(2, env, ctrl, $);
    }
    expfunc(env, ctrl, $);
    multiply(env, ctrl, $);
}

export function stack_power(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack) {
    ctrl.pushDirective(Directive.expanding, ctrl.getDirective(Directive.expanding) - 1);
    try {
        $.push(expr.base);
        $.push(expr.expo);
        value_of(env, ctrl, $);
        $.dupl();
        // expo has been evaluated with a decremented expanding value.
        const expo = pop($);
        try {
            // if exponent is negative then evaluate base without expanding,
            // otherwise, evaluate the base normally.
            swap($);
            try {
                if (is_num(expo) && expo.isNegative()) {
                    ctrl.pushDirective(Directive.expanding, 0);
                    try {
                        // base is evaluated with zero expanding.
                        value_of(env, ctrl, $);
                    } finally {
                        ctrl.popDirective();
                    }
                } else {
                    // base is evaluated with decremented expanding.
                    value_of(env, ctrl, $);
                }
            } finally {
                swap($);
            }

            power(env, ctrl, $);
        } finally {
            expo.release();
        }
    } finally {
        ctrl.popDirective();
    }
}

/**
 * Expects top elements of stack to be...
 *
 * --------
 * | expo |
 * --------
 * | base |
 * --------
 *
 * Both expressions have been evaluated.
 */
function power_args($: ProgramStack): [base: U, expo: U] {
    const expo = pop($);
    const base = pop($);
    if (is_sym(base) && is_flt(expo)) {
        if (base.equals(MATH_E)) {
            return [create_flt(Math.E), expo];
        } else if (base.equals(MATH_PI)) {
            return [create_flt(Math.PI), expo];
        }
    }
    return [base, expo];
}

/**
 * Expects top elements of stack to be...
 *
 * --------
 * | expo |
 * --------
 * | base |
 * --------
 *
 * Both expressions have been evaluated.
 */
export function power(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const [base, expo] = power_args($);
    // console.lg("power", "base", `${base}`, "expo", `${expo}`);
    try {
        if (is_atom(base)) {
            if (is_uom(base)) {
                if (is_rat(expo)) {
                    $.push(base.pow(QQ.valueOf(expo.numer().toNumber(), expo.denom().toNumber())));
                    return;
                }
            }
        }
        if (is_tensor(base) && istensor(expo)) {
            push(POWER, $);
            push(base, $);
            push(expo, $);
            list(3, $);
            return;
        }

        if (is_tensor(expo)) {
            const T = copy_tensor(expo);
            const n = T.nelem;
            for (let i = 0; i < n; i++) {
                push(base, $);
                push(T.elems[i], $);
                power(env, ctrl, $);
                T.elems[i] = pop($);
            }
            push(T, $);
            return;
        }

        if (is_tensor(base)) {
            const T = copy_tensor(base);
            const n = T.nelem;
            for (let i = 0; i < n; i++) {
                push(T.elems[i], $);
                push(expo, $);
                power(env, ctrl, $);
                T.elems[i] = pop($);
            }
            push(T, $);
            return;
        }

        if (is_num(base) && is_num(expo)) {
            power_numbers(base, expo, env, ctrl, $);
            return;
        }

        // expr^0

        if (iszero(expo, env)) {
            push_integer(1, $);
            return;
        }

        // 0^expr

        if (iszero(base, env)) {
            push(POWER, $);
            push(base, $);
            push(expo, $);
            list(3, $);
            return;
        }

        // 1^expr

        if (isplusone(base)) {
            push_integer(1, $);
            return;
        }

        // expr^1

        if (isplusone(expo)) {
            push(base, $);
            return;
        }

        if (is_imu(base) && is_rat(expo) && isinteger(expo)) {
            if (expo.isEven()) {
                const n = expo.mul(half);
                if (n.isEven()) {
                    $.push(one);
                    return;
                } else {
                    $.push(negOne);
                    return;
                }
            } else if (expo.isOdd()) {
                const n = expo.succ().mul(half);
                if (n.isEven()) {
                    $.push(imu);
                    negate(env, ctrl, $);
                    return;
                } else {
                    $.push(imu);
                    return;
                }
            } else {
                // We've dealt with the easy integral cases.
            }
        }

        // BASE is an integer?

        if (is_rat(base) && isinteger(base)) {
            // raise each factor in BASE to power EXPO
            // EXPO is not numerical, that case was handled by power_numbers() above
            const h = $.length;
            push(base, $);
            factor_factor(env, ctrl, $);
            const n = $.length - h;
            for (let i = 0; i < n; i++) {
                const p1 = $.getAt(h + i);
                if (car(p1).equals(POWER)) {
                    push(POWER, $);
                    push(cadr(p1), $); // base
                    push(caddr(p1), $); // expo
                    push(expo, $);
                    multiply(env, ctrl, $);
                    list(3, $);
                } else {
                    push(POWER, $);
                    push(p1, $);
                    push(expo, $);
                    list(3, $);
                }
                $.setAt(h + i, pop($));
            }
            if (n > 1) {
                sort_factors(h, ctrl, $);
                list(n, $);
                push(MULTIPLY, $);
                swap($);
                cons($); // prepend MULTIPLY to list
            }
            return;
        }

        // BASE is a numerical fraction?

        if (is_rat(base) && isfraction(base)) {
            // power numerator, power denominator
            // EXPO is not numerical, that case was handled by power_numbers() above
            push(base, $);
            numerator(env, ctrl, $);
            push(expo, $);
            power(env, ctrl, $);
            push(base, $);
            denominator(env, ctrl, $);
            push(expo, $);
            negate(env, ctrl, $);
            power(env, ctrl, $);
            multiply(env, ctrl, $);
            return;
        }

        // BASE = e ?

        if (base.equals(MATH_E)) {
            power_e_expo(expo, env, ctrl, $);
            return;
        }

        // (a + b) ^ c

        if (car(base).equals(ADD)) {
            power_sum(base, expo, env, ctrl, $);
            return;
        }

        // (a1 * a2 * a3) ^ c  -->  (a1 ^ c) * (a2 ^ c) * (a3 ^ c)

        if (car(base).equals(MULTIPLY)) {
            const h = $.length;
            let argList = cdr(base);
            while (is_cons(argList)) {
                push(car(argList), $);
                push(expo, $);
                power(env, ctrl, $);
                argList = cdr(argList);
            }
            multiply_factors($.length - h, env, ctrl, $);
            return;
        }

        // (x ^ a) ^ b  -->  x ^ (a * c)

        if (is_power(base)) {
            const x = base.base;
            const a = base.expo;
            const b = expo;
            push(x, $);
            push(a, $);
            push(b, $);
            multiply_expand(env, ctrl, $); // always expand products of exponents
            power(env, ctrl, $);
            return;
        }

        // none of the above

        $.push(native_sym(Native.pow));
        $.push(base);
        $.push(expo);
        list(3, $);
    } finally {
        expo.release();
        base.release();
    }
}

export function stack_prefixform(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(expr), $);
    value_of(env, ctrl, $);
    const p1 = pop($);
    const outbuf: string[] = [];
    prefixform(p1, outbuf);
    const s = outbuf.join("");
    push_string(s, $);
}

export function stack_product(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    if (lengthf(expr) === 2) {
        push(cadr(expr), $);
        value_of(env, ctrl, $);
        const p1 = pop($);
        if (!istensor(p1)) {
            push(p1, $);
            return;
        }
        const n = p1.nelem;
        for (let i = 0; i < n; i++) {
            push(p1.elems[i], $);
        }
        multiply_factors(n, env, ctrl, $);
        return;
    }

    const p2 = cadr(expr);
    if (!(is_sym(p2) && env.hasUserFunction(p2))) stopf("product: symbol error");

    push(caddr(expr), $);
    value_of(env, ctrl, $);
    let j = pop_integer($);

    push(cadddr(expr), $);
    value_of(env, ctrl, $);
    const k = pop_integer($);

    const p1 = caddddr(expr);

    save_symbol(p2, env);

    const h = $.length;

    for (;;) {
        push_integer(j, $);
        const p3 = pop($);
        set_symbol(p2, p3, nil, env);
        push(p1, $);
        value_of(env, ctrl, $);
        if (j === k) break;
        if (j < k) j++;
        else j--;
    }

    multiply_factors($.length - h, env, ctrl, $);

    restore_symbol(env);
}

export function stack_quote(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $); // not evaluated
}

/**
 * (rank a)
 */
export function stack_rank(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const argList = expr.argList;
    try {
        const a = argList.item0;
        try {
            $.push(a);
            value_of(env, ctrl, $);
            const A = pop($);
            try {
                if (is_tensor(A)) {
                    push_integer(A.rank, $);
                } else {
                    push_integer(0, $);
                }
            } finally {
                A.release();
            }
        } finally {
            a.release();
        }
    } finally {
        argList.release();
    }
}

export function stack_rationalize(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    rationalize(env, ctrl, $);
}

function rationalize(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    let p1 = pop($);

    if (is_tensor(p1)) {
        push(elementwise(p1, rationalize, env, ctrl, $), $);
        return;
    }

    let p2: U = one;

    while (find_divisor(p1, env, ctrl, $)) {
        const p0 = pop($);
        push(p0, $);
        push(p1, $);
        cancel_factor(env, ctrl, $);
        p1 = pop($);
        push(p0, $);
        push(p2, $);
        multiply_noexpand(env, ctrl, $);
        p2 = pop($);
    }

    push(p1, $);
    push(p2, $);
    reciprocate(env, ctrl, $);
    multiply_noexpand(env, ctrl, $);
}

export function stack_real(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    real(env, ctrl, $);
}

/**
 * [x+i*y] => [x]
 */
export function real(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const z = pop($); //  []
    try {
        if (is_atom(z)) {
            // I'd like to apply the Native.real operation to this atom through an extension
            if (is_tensor(z)) {
                push(elementwise(z, real, env, ctrl, $), $);
                return;
            }
        }
        // In all other cases we would be handling cons or nil
        $.push(z); //  [z]
        rect(env, ctrl, $); //  [x+i*y]
        $.dupl(); //  [x+i*y,x+i*y]
        conjfunc(env, ctrl, $); //  [x+i*y,x-i*y]
        add(env, ctrl, $); //  [2*x]
        push_rational(1, 2, $); //  [2*x, 1/2]
        multiply(env, ctrl, $); //  [x]
    } finally {
        z.release();
    }
}

/**
 * (rect z)
 */
export function stack_rect(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    $.push(expr); //  [..., expr]
    $.rest(); //  [..., expr.rest]
    $.head(); //  [..., expr.rest.head]
    value_of(env, ctrl, $); //  [..., z]
    rect(env, ctrl, $); //  [..., rect(z)]
}

/**
 * Returns complex z in rectangular form.
 *
 * rect(exp(i x)) => cos(x) + i sin(x)
 *
 * [..., z] => [..., rect(z)]
 *
 *
 */
export function rect(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const z = pop($);
    try {
        if (is_tensor(z)) {
            push(elementwise(z, rect, env, ctrl, $), $);
            return;
        }

        if (car(z).equals(ADD)) {
            let p1 = cdr(z);
            const h = $.length;
            while (is_cons(p1)) {
                push(car(p1), $);
                rect(env, ctrl, $);
                p1 = cdr(p1);
            }
            sum_terms($.length - h, env, ctrl, $);
            return;
        }

        if (car(z).equals(MULTIPLY)) {
            let p1 = cdr(z);
            const h = $.length;
            while (is_cons(p1)) {
                push(car(p1), $);
                rect(env, ctrl, $);
                p1 = cdr(p1);
            }
            multiply_factors($.length - h, env, ctrl, $);
            return;
        }

        if (is_cons(z) && car(z).equals(POWER)) {
            const base = z.base;
            const expo = z.expo;

            // handle sum in exponent

            if (car(expo).equals(ADD)) {
                let p1 = cdr(expo);
                const h = $.length;
                while (is_cons(p1)) {
                    push(POWER, $);
                    push(base, $);
                    push(car(p1), $);
                    list(3, $);
                    rect(env, ctrl, $);
                    p1 = cdr(p1);
                }
                multiply_factors($.length - h, env, ctrl, $);
                return;
            }

            // return mag(z) * cos(arg(z)) + i sin(arg(z)))

            push(z, $);
            mag(env, ctrl, $);

            push(z, $);
            arg(env, ctrl, $);
            const p2 = pop($);

            push(p2, $);
            cosfunc(env, ctrl, $);

            push(imu, $);
            push(p2, $);
            sinfunc(env, ctrl, $);
            multiply(env, ctrl, $);

            add(env, ctrl, $);

            multiply(env, ctrl, $);
        } else {
            // For all other combinations and atoms we strip off the (rect ...).
            // This is OK because we are only converting the complex number to an alternative representation.
            push(z, $);
            return;
        }
    } finally {
        z.release();
    }
}

export function stack_roots(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);

    p1 = cddr(p1);

    if (is_cons(p1)) {
        push(car(p1), $);
        value_of(env, ctrl, $);
    } else push(X_LOWER, $);

    roots(env, ctrl, $);
}

function roots(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const X = pop($);
    const P = pop($);

    const h = $.length;

    coeffs(P, X, env, ctrl, $); // put coeffs on stack

    const k = $.length;

    let n = k - h; // number of coeffs on stack

    // check coeffs

    for (let i = 0; i < n; i++) {
        if (!is_rat($.getAt(h + i))) {
            stopf("roots: coeffs");
        }
    }

    // find roots

    while (n > 1) {
        if (findroot(h, n, env, ctrl, $) === 0) {
            break; // no root found
        }

        // A is the root

        const A = $.getAt($.length - 1);

        // divide p(x) by X - A

        reduce(h, n, A, env, ctrl, $);

        n--;
    }

    n = $.length - k; // number of roots on stack

    if (n === 0) {
        $.length = h; // pop all
        push(nil, $); // no roots
        return;
    }

    sort(n, env, ctrl, $); // sort roots

    // eliminate repeated roots

    for (let i = 0; i < n - 1; i++)
        if (equal($.getAt(k + i), $.getAt(k + i + 1))) {
            for (let j = i + 1; j < n - 1; j++) {
                $.setAt(k + j, $.getAt(k + j + 1));
            }
            i--;
            n--;
        }

    if (n === 1) {
        const A = $.getAt(k);
        $.length = h; // pop all
        push(A, $); // one root
        return;
    }

    const A = alloc_vector(n);

    for (let i = 0; i < n; i++) A.elems[i] = $.getAt(k + i);

    $.length = h; // pop all

    push(A, $);
}

function findroot(h: number, n: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): 1 | 0 {
    // check constant term

    if (iszero($.getAt(h), env)) {
        push_integer(0, $); // root is zero
        return 1;
    }

    // eliminate denominators

    for (let i = 0; i < n; i++) {
        let C = $.getAt(h + i);
        if (is_rat(C) && isinteger(C)) continue;
        push(C, $);
        denominator(env, ctrl, $);
        C = pop($);
        for (let j = 0; j < n; j++) {
            push($.getAt(h + j), $);
            push(C, $);
            multiply(env, ctrl, $);
            $.setAt(h + j, pop($));
        }
    }

    const p = $.length;

    push($.getAt(h), $);
    let m = pop_integer($);
    divisors(m, env, ctrl, $); // divisors of constant term

    const q = $.length;

    push($.getAt(h + n - 1), $);
    m = pop_integer($);
    divisors(m, env, ctrl, $); // divisors of leading coeff

    const r = $.length;

    for (let i = p; i < q; i++) {
        for (let j = q; j < r; j++) {
            // try positive A

            push($.getAt(i), $);
            push($.getAt(j), $);
            divide(env, ctrl, $);
            let A = pop($);

            horner(h, n, A, env, ctrl, $);

            let PA = pop($); // polynomial evaluated at A

            if (iszero(PA, env)) {
                $.length = p; // pop all
                push(A, $);
                return 1; // root on stack
            }

            // try negative A

            push(A, $);
            negate(env, ctrl, $);
            A = pop($);

            horner(h, n, A, env, ctrl, $);

            PA = pop($); // polynomial evaluated at A

            if (iszero(PA, env)) {
                $.length = p; // pop all
                push(A, $);
                return 1; // root on stack
            }
        }
    }

    $.length = p; // pop all

    return 0; // no root
}

// evaluate p(x) at x = A using horner's rule

function horner(h: number, n: number, A: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push($.getAt(h + n - 1), $);

    for (let i = n - 2; i >= 0; i--) {
        push(A, $);
        multiply(env, ctrl, $);
        push($.getAt(h + i), $);
        add(env, ctrl, $);
    }
}

// push all divisors of n

function divisors(n: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const h = $.length;

    factor_int(n, $);

    const k = $.length;

    // contruct divisors by recursive descent

    push_integer(1, $);

    divisors_nib(h, k, env, ctrl, $);

    // move

    n = $.length - k;

    for (let i = 0; i < n; i++) $.setAt(h + i, $.getAt(k + i));

    $.length = h + n; // pop all
}

//	Generate all divisors for a factored number
//
//	Input:		Factor pairs on stack (base, expo)
//
//			h	first pair
//
//			k	just past last pair
//
//	Output:		Divisors on stack
//
//	For example, the number 12 (= 2^2 3^1) has 6 divisors:
//
//	1, 2, 3, 4, 6, 12

function divisors_nib(h: number, k: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    if (h === k) return;

    const ACCUM = pop($);

    const BASE = $.getAt(h + 0);
    const EXPO = $.getAt(h + 1);

    push(EXPO, $);
    const n = pop_integer($);

    for (let i = 0; i <= n; i++) {
        push(ACCUM, $);
        push(BASE, $);
        push_integer(i, $);
        power(env, ctrl, $);
        multiply(env, ctrl, $);
        divisors_nib(h + 2, k, env, ctrl, $);
    }
}

// divide by X - A

function reduce(h: number, n: number, A: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    for (let i = n - 1; i > 0; i--) {
        push(A, $); //  [..., A]
        push($.getAt(h + i), $);
        multiply(env, ctrl, $);
        push($.getAt(h + i - 1), $);
        add(env, ctrl, $);
        $.setAt(h + i - 1, pop($));
    }

    if (!iszero($.getAt(h), env)) stopf("roots: residual error"); // not a root

    // move

    for (let i = 0; i < n - 1; i++) {
        $.setAt(h + i, $.getAt(h + i + 1));
    }
}

export function stack_assign(x: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(nil, $); // return value

    if (caadr(x).equals(INDEX)) {
        setq_indexed(x, env, ctrl, $);
        return;
    }

    if (is_cons(cadr(x))) {
        setq_usrfunc(x, env, ctrl, $);
        return;
    }

    const sym = x.lhs;
    if (is_sym(sym) && env.hasUserFunction(sym)) {
        push(x.rhs, $);
        value_of(env, ctrl, $);
        const rhs = pop($);

        set_symbol(sym, rhs, nil, env);
    } else {
        stopf(`user symbol expected sym = ${sym}`);
    }
}

// Example: a[1] = b
//
// p1----->cons--->cons------------------->cons
//         |       |                       |
//         setq    cons--->cons--->cons    b
//                 |       |       |
//                 index   a       1
//
// caadr(p1) = index
// cadadr(p1) = a
// caddr(p1) = b

function setq_indexed(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const S = cadadr(p1);

    if (!(is_sym(S) && env.hasUserFunction(S))) {
        stopf(`user symbol expected S = ${S}`);
    }

    push(S, $);
    value_of(env, ctrl, $);

    push(caddr(p1), $);
    value_of(env, ctrl, $);

    const RVAL = pop($);
    const LVAL = pop($);

    const h = $.length;

    p1 = cddadr(p1);

    while (is_cons(p1)) {
        push(car(p1), $);
        value_of(env, ctrl, $);
        p1 = cdr(p1);
    }

    set_component(LVAL, RVAL, h, $);

    set_symbol(S, LVAL, nil, env);
}

function set_component(LVAL: U, RVAL: U, h: number, $: ProgramStack): void {
    if (!istensor(LVAL)) stopf("index error");

    // n is number of indices

    const n = $.length - h;

    if (n < 1 || n > LVAL.ndim) stopf("index error");

    // k is combined index

    let k = 0;

    for (let i = 0; i < n; i++) {
        push($.getAt(h + i), $);
        const t = pop_integer($);
        if (t < 1 || t > LVAL.dims[i]) stopf("index error");
        k = k * LVAL.dims[i] + t - 1;
    }

    $.splice(h); // pop all indices

    if (is_tensor(RVAL)) {
        let m = RVAL.ndim;
        if (n + m !== LVAL.ndim) stopf("index error");
        for (let i = 0; i < m; i++) if (LVAL.dims[n + i] !== RVAL.dims[i]) stopf("index error");
        m = RVAL.nelem;
        for (let i = 0; i < m; i++) LVAL.elems[m * k + i] = RVAL.elems[i];
    } else {
        if (n !== LVAL.ndim) stopf("index error");
        LVAL.elems[k] = RVAL;
    }
}

// Example:
//
//      f(x,y)=x^y
//
// For this definition, p1 points to the following structure.
//
//     p1
//      |
//   ___v__    ______                        ______
//  |CONS  |->|CONS  |--------------------->|CONS  |
//  |______|  |______|                      |______|
//      |         |                             |
//   ___v__    ___v__    ______    ______    ___v__    ______    ______
//  |SETQ  |  |CONS  |->|CONS  |->|CONS  |  |CONS  |->|CONS  |->|CONS  |
//  |______|  |______|  |______|  |______|  |______|  |______|  |______|
//                |         |         |         |         |         |
//             ___v__    ___v__    ___v__    ___v__    ___v__    ___v__
//            |SYM f |  |SYM x |  |SYM y |  |POWER |  |SYM x |  |SYM y |
//            |______|  |______|  |______|  |______|  |______|  |______|
//
// We have
//
//	caadr(p1) points to f
//	cdadr(p1) points to the list (x y)
//	caddr(p1) points to (power x y)

function setq_usrfunc(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const F = caadr(p1); // function name
    const A = cdadr(p1); // function args
    const B = caddr(p1); // function body

    if (is_sym(F) && env.hasUserFunction(F)) {
        if (lengthf(A) > 9) {
            stopf("more than 9 arguments");
        }

        push(B, $);
        convert_body(A, $);
        const C = pop($);

        set_symbol(F, B, C, env);
    } else {
        if (is_sym(F)) {
            stopf(`user symbol expected F = ${F}`);
        } else {
            stopf(`symbol expected F = ${F}`);
        }
    }
}

function convert_body(A: U, $: ProgramStack): void {
    if (!is_cons(A)) return;

    push(car(A), $);
    push(ARG1, $);
    subst($);

    A = cdr(A);
    if (!is_cons(A)) return;

    push(car(A), $);
    push(ARG2, $);
    subst($);

    A = cdr(A);
    if (!is_cons(A)) return;

    push(car(A), $);
    push(ARG3, $);
    subst($);

    A = cdr(A);
    if (!is_cons(A)) return;

    push(car(A), $);
    push(ARG4, $);
    subst($);

    A = cdr(A);
    if (!is_cons(A)) return;

    push(car(A), $);
    push(ARG5, $);
    subst($);

    A = cdr(A);

    if (!is_cons(A)) return;

    push(car(A), $);
    push(ARG6, $);
    subst($);

    A = cdr(A);
    if (!is_cons(A)) return;

    push(car(A), $);
    push(ARG7, $);
    subst($);

    A = cdr(A);
    if (!is_cons(A)) return;

    push(car(A), $);
    push(ARG8, $);
    subst($);

    A = cdr(A);
    if (!is_cons(A)) return;

    push(car(A), $);
    push(ARG9, $);
    subst($);
}

export function stack_sgn(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    sgn(env, ctrl, $);
}

function sgn(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        push(elementwise(p1, sgn, env, ctrl, $), $);
        return;
    }

    if (!is_num(p1)) {
        push(SGN, $);
        push(p1, $);
        list(2, $);
        return;
    }

    if (iszero(p1, env)) {
        push_integer(0, $);
        return;
    }

    if (isnegativenumber(p1)) push_integer(-1, $);
    else push_integer(1, $);
}

export function stack_simplify(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(expr.arg, $);
    value_of(env, ctrl, $);
    simplify(env, ctrl, $);
}

export function simplify(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const expr = pop($);
    if (is_tensor(expr)) {
        simplify_tensor(expr, env, ctrl, $);
    } else {
        simplify_scalar(expr, env, ctrl, $);
    }
}

function simplify_tensor(M: Tensor, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    M = copy_tensor(M);
    push(M, $);
    const n = M.nelem;
    for (let i = 0; i < n; i++) {
        push(M.elems[i], $);
        simplify(env, ctrl, $);
        M.elems[i] = pop($);
    }
}

function simplify_scalar(p1: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    // already simple?

    if (!is_cons(p1)) {
        push(p1, $);
        return;
    }

    const h = $.length;
    push(car(p1), $);
    p1 = cdr(p1);

    while (is_cons(p1)) {
        push(car(p1), $);
        simplify(env, ctrl, $);
        p1 = cdr(p1);
    }

    list($.length - h, $);
    value_of(env, ctrl, $);

    simplify_pass1(env, ctrl, $);
    simplify_pass2(env, ctrl, $); // try exponential form
    simplify_pass3(env, ctrl, $); // try polar form
}

function simplify_pass1(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    let p1 = pop($);

    // already simple?

    if (!is_cons(p1)) {
        push(p1, $);
        return;
    }

    let T: U;

    if (car(p1).equals(ADD)) {
        push(p1, $);
        rationalize(env, ctrl, $);
        T = pop($);
        if (car(T).equals(ADD)) {
            push(p1, $); // no change
            return;
        }
    } else T = p1;

    push(T, $);
    numerator(env, ctrl, $);
    let numer = pop($);

    push(T, $);
    denominator(env, ctrl, $);
    value_of(env, ctrl, $); // to expand denominator
    let denom = pop($);

    // if DEN is a sum then rationalize it

    if (car(denom).equals(ADD)) {
        push(denom, $);
        rationalize(env, ctrl, $);
        T = pop($);
        if (!car(T).equals(ADD)) {
            // update NUM
            push(T, $);
            denominator(env, ctrl, $);
            value_of(env, ctrl, $); // to expand denominator
            push(numer, $);
            multiply(env, ctrl, $);
            numer = pop($);
            // update DEN
            push(T, $);
            numerator(env, ctrl, $);
            denom = pop($);
        }
    }

    // are NUM and DEN congruent sums?

    if (!car(numer).equals(ADD) || !car(denom).equals(ADD) || lengthf(numer) !== lengthf(denom)) {
        // no, but NUM over DEN might be simpler than p1
        push(numer, $);
        push(denom, $);
        divide(env, ctrl, $);
        T = pop($);
        if (complexity(T) < complexity(p1)) {
            p1 = T;
        }
        push(p1, $);
        return;
    }

    push(cadr(numer), $); // push first term of numerator
    push(cadr(denom), $); // push first term of denominator
    divide(env, ctrl, $);

    const R = pop($); // provisional ratio

    push(R, $);
    push(denom, $);
    multiply(env, ctrl, $);

    push(numer, $);
    subtract(env, ctrl, $);

    T = pop($);

    if (iszero(T, env)) p1 = R;

    push(p1, $);
}

// try exponential form

function simplify_pass2(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    // already simple?

    if (!is_cons(p1)) {
        push(p1, $);
        return;
    }

    push(p1, $);
    circexp(env, ctrl, $);
    rationalize(env, ctrl, $);
    value_of(env, ctrl, $); // to normalize
    const p2 = pop($);

    if (complexity(p2) < complexity(p1)) {
        push(p2, $);
        return;
    }

    push(p1, $);
}

// try polar form

function simplify_pass3(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (!car(p1).equals(ADD) || isusersymbolsomewhere(p1, env) || !findf(p1, imu)) {
        push(p1, $);
        return;
    }

    push(p1, $);
    polar(env, ctrl, $);
    const p2 = pop($);

    if (!is_cons(p2)) {
        push(p2, $);
        return;
    }

    push(p1, $);
}

export function stack_sin(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(expr), $);
    value_of(env, ctrl, $);
    sinfunc(env, ctrl, $);
}

function sinfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        push(elementwise(p1, sinfunc, env, ctrl, $), $);
        return;
    }

    if (is_flt(p1)) {
        let d = p1.toNumber();
        d = Math.sin(d);
        push_double(d, $);
        return;
    }

    // sin(z) = -i/2 exp(i z) + i/2 exp(-i z)

    if (isdoublez(p1)) {
        push_double(-0.5, $);
        push(imu, $);
        multiply(env, ctrl, $);
        push(imu, $);
        push(p1, $);
        multiply(env, ctrl, $);
        expfunc(env, ctrl, $);
        push(imu, $);
        negate(env, ctrl, $);
        push(p1, $);
        multiply(env, ctrl, $);
        expfunc(env, ctrl, $);
        subtract(env, ctrl, $);
        multiply(env, ctrl, $);
        return;
    }

    // sin(-x) = -sin(x)

    if (isnegativeterm(p1)) {
        push(p1, $);
        negate(env, ctrl, $);
        sinfunc(env, ctrl, $);
        negate(env, ctrl, $);
        return;
    }

    if (car(p1).equals(ADD)) {
        sinfunc_sum(p1, env, ctrl, $);
        return;
    }

    // sin(arctan(y,x)) = y (x^2 + y^2)^(-1/2)

    if (car(p1).equals(ARCTAN)) {
        const X = caddr(p1);
        const Y = cadr(p1);
        push(Y, $);
        push(X, $);
        push(X, $);
        multiply(env, ctrl, $);
        push(Y, $);
        push(Y, $);
        multiply(env, ctrl, $);
        add(env, ctrl, $);
        push_rational(-1, 2, $);
        power(env, ctrl, $);
        multiply(env, ctrl, $);
        return;
    }

    // sin(arccos(x)) = sqrt(1 - x^2)

    if (car(p1).equals(ARCCOS)) {
        push_integer(1, $);
        push(cadr(p1), $);
        push_integer(2, $);
        power(env, ctrl, $);
        subtract(env, ctrl, $);
        push_rational(1, 2, $);
        power(env, ctrl, $);
        return;
    }

    // n pi ?

    push(p1, $);
    push(MATH_PI, $);
    divide(env, ctrl, $);
    let p2 = pop($);

    if (!is_num(p2)) {
        push(SIN, $);
        push(p1, $);
        list(2, $);
        return;
    }

    if (is_flt(p2)) {
        let d = p2.toNumber();
        d = Math.sin(d * Math.PI);
        push_double(d, $);
        return;
    }

    push(p2, $); // nonnegative by sin(-x) = -sin(x) above
    push_integer(180, $);
    multiply(env, ctrl, $);
    p2 = pop($);

    if (!(is_rat(p2) && isinteger(p2))) {
        push(SIN, $);
        push(p1, $);
        list(2, $);
        return;
    }

    push(p2, $);
    push_integer(360, $);
    modfunc(env, ctrl, $);
    const n = pop_integer($);

    switch (n) {
        case 0:
        case 180:
            push_integer(0, $);
            break;
        case 30:
        case 150:
            push_rational(1, 2, $);
            break;
        case 210:
        case 330:
            push_rational(-1, 2, $);
            break;
        case 45:
        case 135:
            push_rational(1, 2, $);
            push_integer(2, $);
            push_rational(1, 2, $);
            power(env, ctrl, $);
            multiply(env, ctrl, $);
            break;
        case 225:
        case 315:
            push_rational(-1, 2, $);
            push_integer(2, $);
            push_rational(1, 2, $);
            power(env, ctrl, $);
            multiply(env, ctrl, $);
            break;
        case 60:
        case 120:
            push_rational(1, 2, $);
            push_integer(3, $);
            push_rational(1, 2, $);
            power(env, ctrl, $);
            multiply(env, ctrl, $);
            break;
        case 240:
        case 300:
            push_rational(-1, 2, $);
            push_integer(3, $);
            push_rational(1, 2, $);
            power(env, ctrl, $);
            multiply(env, ctrl, $);
            break;
        case 90:
            push_integer(1, $);
            break;
        case 270:
            push_integer(-1, $);
            break;
        default:
            push(SIN, $);
            push(p1, $);
            list(2, $);
            break;
    }
}

// sin(x + n/2 pi) = sin(x) cos(n/2 pi) + cos(x) sin(n/2 pi)

function sinfunc_sum(p1: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    let p2 = cdr(p1);
    while (is_cons(p2)) {
        push_integer(2, $);
        push(car(p2), $);
        multiply(env, ctrl, $);
        push(MATH_PI, $);
        divide(env, ctrl, $);
        let p3 = pop($);
        if (is_rat(p3) && isinteger(p3)) {
            push(p1, $);
            push(car(p2), $);
            subtract(env, ctrl, $);
            p3 = pop($);
            push(p3, $);
            sinfunc(env, ctrl, $);
            push(car(p2), $);
            cosfunc(env, ctrl, $);
            multiply(env, ctrl, $);
            push(p3, $);
            cosfunc(env, ctrl, $);
            push(car(p2), $);
            sinfunc(env, ctrl, $);
            multiply(env, ctrl, $);
            add(env, ctrl, $);
            return;
        }
        p2 = cdr(p2);
    }
    push(SIN, $);
    push(p1, $);
    list(2, $);
}

export function stack_sinh(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    $.push(expr);
    $.rest();
    $.head();
    value_of(env, ctrl, $);
    sinhfunc(env, ctrl, $);
}

function sinhfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const x = pop($);

    if (is_tensor(x)) {
        push(elementwise(x, sinhfunc, env, ctrl, $), $);
        return;
    }

    if (is_flt(x)) {
        push_double(Math.sinh(x.toNumber()), $);
        return;
    }

    // sinh(z) = 1/2 exp(z) - 1/2 exp(-z)

    if (isdoublez(x)) {
        push_rational(1, 2, $);
        push(x, $);
        expfunc(env, ctrl, $);
        push(x, $);
        negate(env, ctrl, $);
        expfunc(env, ctrl, $);
        subtract(env, ctrl, $);
        multiply(env, ctrl, $);
        return;
    }

    if (iszero(x, env)) {
        push_integer(0, $);
        return;
    }

    // sinh(-x) -> -sinh(x)

    if (isnegativeterm(x)) {
        push(x, $);
        negate(env, ctrl, $);
        sinhfunc(env, ctrl, $);
        negate(env, ctrl, $);
        return;
    }

    if (car(x).equals(ARCSINH)) {
        push(cadr(x), $);
        return;
    }

    push(SINH, $);
    push(x, $);
    list(2, $);
}

export function stack_sqrt(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    $.push(expr);
    $.rest();
    $.head();
    value_of(env, ctrl, $);
    sqrtfunc(env, ctrl, $);
}

export function sqrtfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push_rational(1, 2, $);
    power(env, ctrl, $);
}

export function stack_status(expr: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(nil, $);
}

export function stack_stop(): never {
    stopf("stop");
}

export function stack_subst(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadddr(p1), $);
    value_of(env, ctrl, $);
    push(caddr(p1), $);
    value_of(env, ctrl, $);
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    subst($);
    value_of(env, ctrl, $); // normalize
}

/**
 * [..., F(x), x, a] => [..., F(a)]
 */
function subst(_: Pick<ProgramStack, "length" | "pop" | "push">): void {
    const a = pop(_); // new expr           [..., F, x]
    const x = pop(_); // old expr           [..., F]

    if (x.isnil || a.isnil) {
        return; //  [..., F]
    }

    let F = pop(_); // expr             //  [...]

    if (is_tensor(F)) {
        const T = copy_tensor(F);
        const n = T.nelem;
        for (let i = 0; i < n; i++) {
            push(T.elems[i], _);
            push(x, _);
            push(a, _);
            subst(_);
            T.elems[i] = pop(_);
        }
        push(T, _);
        return;
    }

    if (equal(F, x)) {
        push(a, _); //  [..., a]        because F is the same as X
        return;
    }

    if (is_cons(F)) {
        const h = _.length;
        while (is_cons(F)) {
            push(car(F), _);
            push(x, _);
            push(a, _);
            subst(_);
            F = cdr(F);
        }
        list(_.length - h, _);
        return;
    }

    push(F, _);
}

/**
 * (sum i j k f)
 *      0 1 2 3
 *
 * e.g. sum(i,1,5,x^i) => x^5 + x^4 + x^3 + x^2 + x
 */
export function stack_sum(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const argList = expr.argList;
    try {
        if (lengthf(expr) === 2) {
            push(car(argList), $);
            value_of(env, ctrl, $);
            const p1 = pop($);
            if (!istensor(p1)) {
                push(p1, $);
                return;
            } else {
                const n = p1.nelem;
                for (let i = 0; i < n; i++) {
                    push(p1.elems[i], $);
                }
                sum_terms(n, env, ctrl, $);
                return;
            }
        }

        const i = argList.item0;
        if (!(is_sym(i) && env.hasUserFunction(i))) {
            stopf("sum: symbol error");
        }

        push(argList.item1, $);
        value_of(env, ctrl, $);
        let j = pop_integer($);

        push(argList.item2, $);
        value_of(env, ctrl, $);
        const k = pop_integer($);

        const F = argList.item3;

        save_symbol(i, env);
        try {
            const h = $.length;

            for (;;) {
                push_integer(j, $);
                const J = pop($);
                set_symbol(i, J, nil, env);
                push(F, $);
                value_of(env, ctrl, $);
                if (j === k) {
                    break;
                }
                if (j < k) {
                    j++;
                } else {
                    j--;
                }
            }

            sum_terms($.length - h, env, ctrl, $);
        } finally {
            restore_symbol(env);
        }
    } finally {
        argList.release();
    }
}

export function stack_tan(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    tanfunc(env, ctrl, $);
}

function tanfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        push(elementwise(p1, tanfunc, env, ctrl, $), $);
        return;
    }

    if (is_flt(p1)) {
        let d = p1.toNumber();
        d = Math.tan(d);
        push_double(d, $);
        return;
    }

    if (isdoublez(p1)) {
        push(p1, $);
        sinfunc(env, ctrl, $);
        push(p1, $);
        cosfunc(env, ctrl, $);
        divide(env, ctrl, $);
        return;
    }

    // tan(-x) = -tan(x)

    if (isnegativeterm(p1)) {
        push(p1, $);
        negate(env, ctrl, $);
        tanfunc(env, ctrl, $);
        negate(env, ctrl, $);
        return;
    }

    if (car(p1).equals(ADD)) {
        tanfunc_sum(p1, env, ctrl, $);
        return;
    }

    if (car(p1).equals(ARCTAN)) {
        push(cadr(p1), $);
        push(caddr(p1), $);
        divide(env, ctrl, $);
        return;
    }

    // n pi ?

    push(p1, $);
    push(MATH_PI, $);
    divide(env, ctrl, $);
    let p2 = pop($);

    if (!is_num(p2)) {
        push(TAN, $);
        push(p1, $);
        list(2, $);
        return;
    }

    if (is_flt(p2)) {
        let d = p2.toNumber();
        d = Math.tan(d * Math.PI);
        push_double(d, $);
        return;
    }

    push(p2, $); // nonnegative by tan(-x) = -tan(x) above
    push_integer(180, $);
    multiply(env, ctrl, $);
    p2 = pop($);

    if (!(is_rat(p2) && isinteger(p2))) {
        push(TAN, $);
        push(p1, $);
        list(2, $);
        return;
    }

    push(p2, $);
    push_integer(360, $);
    modfunc(env, ctrl, $);
    const n = pop_integer($);

    switch (n) {
        case 0:
        case 180:
            push_integer(0, $);
            break;
        case 30:
        case 210:
            push_rational(1, 3, $);
            push_integer(3, $);
            push_rational(1, 2, $);
            power(env, ctrl, $);
            multiply(env, ctrl, $);
            break;
        case 150:
        case 330:
            push_rational(-1, 3, $);
            push_integer(3, $);
            push_rational(1, 2, $);
            power(env, ctrl, $);
            multiply(env, ctrl, $);
            break;
        case 45:
        case 225:
            push_integer(1, $);
            break;
        case 135:
        case 315:
            push_integer(-1, $);
            break;
        case 60:
        case 240:
            push_integer(3, $);
            push_rational(1, 2, $);
            power(env, ctrl, $);
            break;
        case 120:
        case 300:
            push_integer(3, $);
            push_rational(1, 2, $);
            power(env, ctrl, $);
            negate(env, ctrl, $);
            break;
        default:
            push(TAN, $);
            push(p1, $);
            list(2, $);
            break;
    }
}

// tan(x + n pi) = tan(x)

function tanfunc_sum(p1: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    let p2 = cdr(p1);
    while (is_cons(p2)) {
        push(car(p2), $);
        push(MATH_PI, $);
        divide(env, ctrl, $);
        const p3 = pop($);
        if (is_rat(p3) && isinteger(p3)) {
            push(p1, $);
            push(car(p2), $);
            subtract(env, ctrl, $);
            tanfunc(env, ctrl, $);
            return;
        }
        p2 = cdr(p2);
    }
    push(TAN, $);
    push(p1, $);
    list(2, $);
}

export function stack_tanh(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    tanhfunc(env, ctrl, $);
}

function tanhfunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_tensor(p1)) {
        push(elementwise(p1, tanhfunc, env, ctrl, $), $);
        return;
    }

    if (is_flt(p1)) {
        let d = p1.toNumber();
        d = Math.tanh(d);
        push_double(d, $);
        return;
    }

    if (isdoublez(p1)) {
        push(p1, $);
        sinhfunc(env, ctrl, $);
        push(p1, $);
        coshfunc(env, ctrl, $);
        divide(env, ctrl, $);
        return;
    }

    if (iszero(p1, env)) {
        push_integer(0, $);
        return;
    }

    // tanh(-x) = -tanh(x)

    if (isnegativeterm(p1)) {
        push(p1, $);
        negate(env, ctrl, $);
        tanhfunc(env, ctrl, $);
        negate(env, ctrl, $);
        return;
    }

    if (car(p1).equals(ARCTANH)) {
        push(cadr(p1), $);
        return;
    }

    push(TANH, $);
    push(p1, $);
    list(2, $);
}

function expect_n_arguments(x: Cons, n: number): void | never {
    const opr = assert_sym(x.opr);
    const argList = x.argList;
    if (argList.length !== n) {
        if (n > 1) {
            stopf(`Expecting ${n} argument(s) for ${opr.key()} but got ${argList.length}.`);
        } else if (n === 1) {
            stopf(`Expecting 1 argument for ${opr.key()} but got ${argList.length}.`);
        } else if (n === 0) {
            stopf(`Expecting 0 arguments for ${opr.key()} but got ${argList.length}.`);
        } else {
            throw new Error();
        }
    }
}

export function stack_tau(x: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    expect_n_arguments(x, 1);
    const argList = x.argList;
    const arg = argList.item(0);
    push(arg, $);
    value_of(env, ctrl, $);
    taufunc(env, ctrl, $);
}

function taufunc(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const n = pop($);
    push(two, $);
    push(MATH_PI, $);
    push(n, $);
    multiply_factors(3, env, ctrl, $);
}

export function stack_taylor(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    let F = pop($);

    push(caddr(p1), $);
    value_of(env, ctrl, $);
    const X = pop($);

    push(cadddr(p1), $);
    value_of(env, ctrl, $);
    const n = pop_integer($);

    p1 = cddddr(p1);

    if (is_cons(p1)) {
        push(car(p1), $);
        value_of(env, ctrl, $);
    } else push_integer(0, $); // default expansion point

    const A = pop($);

    const h = $.length;

    push(F, $); // f(a)
    push(X, $);
    push(A, $);
    subst($);
    value_of(env, ctrl, $);

    push_integer(1, $);
    let C = pop($);

    for (let i = 1; i <= n; i++) {
        push(F, $); // f = f'
        push(X, $);
        derivative(env, ctrl, $);
        F = pop($);

        if (iszero(F, env)) break;

        push(C, $); // c = c * (x - a)
        push(X, $);
        push(A, $);
        subtract(env, ctrl, $);
        multiply(env, ctrl, $);
        C = pop($);

        push(F, $); // f(a)
        push(X, $);
        push(A, $);
        subst($);
        value_of(env, ctrl, $);

        push(C, $);
        multiply(env, ctrl, $);
        push_integer(i, $);
        factorial(env, ctrl, $);
        divide(env, ctrl, $);
    }

    sum_terms($.length - h, env, ctrl, $);
}

function evaluate_tensor(p1: Tensor, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    p1 = copy_tensor(p1);

    const n = p1.nelem;

    for (let i = 0; i < n; i++) {
        push(p1.elems[i], $);
        value_of(env, ctrl, $);
        p1.elems[i] = pop($);
    }

    push(p1, $);

    promote_tensor($);
}

export function stack_test(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    p1 = cdr(p1);
    while (is_cons(p1)) {
        if (!is_cons(cdr(p1))) {
            push(car(p1), $); // default case
            value_of(env, ctrl, $);
            return;
        }
        push(car(p1), $);
        evalp(env, ctrl, $);
        const p2 = pop($);
        if (!iszero(p2, env)) {
            push(cadr(p1), $);
            value_of(env, ctrl, $);
            return;
        }
        p1 = cddr(p1);
    }
    push(nil, $);
}

export function stack_testeq(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(expr.rest.head, $); //  [expr.rest.head]
    value_of(env, ctrl, $); //  [lhs]
    push(expr.rest.rest.head, $); //  [lhs, expr.rest.rest.head]
    value_of(env, ctrl, $); //  [lhs, rhs]
    subtract(env, ctrl, $); //  [lhs-rhs]
    simplify(env, ctrl, $); //  [lhs-rhs]
    const diff = pop($);
    try {
        if (iszero(diff, env)) {
            push(predicate_return_value(true, ctrl), $);
        } else {
            push(predicate_return_value(false, ctrl), $);
        }
    } finally {
        diff.release();
    }
}

export function stack_testge(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    if (cmp_args(expr, env, ctrl, $) >= 0) {
        push(predicate_return_value(true, ctrl), $);
    } else {
        push(predicate_return_value(false, ctrl), $);
    }
}

export function stack_testgt(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    if (cmp_args(expr, env, ctrl, $) > 0) {
        push(predicate_return_value(true, ctrl), $);
    } else {
        push(predicate_return_value(false, ctrl), $);
    }
}

export function stack_testle(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    if (cmp_args(expr, env, ctrl, $) <= 0) {
        push(predicate_return_value(true, ctrl), $);
    } else push(predicate_return_value(false, ctrl), $);
}

export function stack_testlt(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    if (cmp_args(expr, env, ctrl, $) < 0) {
        push(predicate_return_value(true, ctrl), $);
    } else {
        push(predicate_return_value(false, ctrl), $);
    }
}

/**
 * No net change in stack.
 */
function cmp_args(expr: U, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): Sign {
    //                              [...]
    _.push(expr); //  [..., expr]
    _.rest(); //  [..., expr.rest]
    _.dupl(); //  [..., expr.rest, expr.rest]
    _.head(); //  [..., expr.rest, expr.rest.head]
    value_of(env, ctrl, _); //  [..., expr.rest, lhs]
    _.swap(); //  [..., lhs, expr.rest]
    _.rest(); //  [..., lhs, expr.rest.rest]
    _.head(); //  [..., lhs, expr.rest.rest.head]
    value_of(env, ctrl, _); //  [..., lhs, rhs]
    // We now get into dubious territory....
    // For example ex-ex is zero => SIGN_EQ.
    // ex-ey => ex - ey
    subtract(env, ctrl, _); //  [..., lhs-rhs]
    simplify(env, ctrl, _);
    floatfunc(env, ctrl, _);
    const diff = pop(_); //  [...]
    try {
        if (iszero(diff, env)) {
            return SIGN_EQ;
        }
        if (!is_num(diff)) {
            stopf("compare err");
        }
        if (isnegativenumber(diff)) {
            return SIGN_LT;
        } else {
            return SIGN_GT;
        }
    } finally {
        diff.release();
    }
}

export function stack_transpose(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);
    const p2 = pop($);
    push(p2, $);

    if (!istensor(p2) || p2.ndim < 2) return;

    p1 = cddr(p1);

    if (!is_cons(p1)) {
        transpose(1, 2, $);
        return;
    }

    while (is_cons(p1)) {
        push(car(p1), $);
        value_of(env, ctrl, $);
        const n = pop_integer($);

        push(cadr(p1), $);
        value_of(env, ctrl, $);
        const m = pop_integer($);

        transpose(n, m, $);

        p1 = cddr(p1);
    }
}

function transpose(n: number, m: number, $: ProgramStack): void {
    const index: number[] = [];

    const p1 = pop($) as Tensor;

    const ndim = p1.ndim;
    const nelem = p1.nelem;

    if (n < 1 || n > ndim || m < 1 || m > ndim) stopf("transpose: index error");

    n--; // make zero based
    m--;

    const p2 = copy_tensor(p1);

    // interchange indices n and m

    p2.dims[n] = p1.dims[m];
    p2.dims[m] = p1.dims[n];

    for (let i = 0; i < ndim; i++) index[i] = 0;

    for (let i = 0; i < nelem; i++) {
        let k = 0;

        for (let j = 0; j < ndim; j++) {
            if (j === n) k = k * p1.dims[m] + index[m];
            else if (j === m) k = k * p1.dims[n] + index[n];
            else k = k * p1.dims[j] + index[j];
        }

        p2.elems[k] = p1.elems[i];

        // increment index

        for (let j = ndim - 1; j >= 0; j--) {
            if (++index[j] < p1.dims[j]) break;
            index[j] = 0;
        }
    }

    push(p2, $);
}

export function stack_unit(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(p1), $);
    value_of(env, ctrl, $);

    const n = pop_integer($);

    if (n < 1) stopf("unit: index err");

    if (n === 1) {
        push_integer(1, $);
        return;
    }

    const M = alloc_matrix(n, n);

    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
            if (i === j) M.elems[n * i + j] = one;
            else M.elems[n * i + j] = zero;

    push(M, $);
}

export function stack_user_function(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const name = assert_sym(expr.head);
    const userfunc = get_userfunc(name, env);
    try {
        // undefined function?

        if (userfunc.isnil) {
            if (name.equals(D_LOWER)) {
                ctrl.pushDirective(Directive.expanding, ctrl.getDirective(Directive.expanding) + 1);
                try {
                    stack_derivative(expr, env, ctrl, $);
                } finally {
                    ctrl.popDirective();
                }
                return;
            }
            const h = $.length;
            push(name, $);
            let args = expr.rest;
            while (is_cons(args)) {
                push(args.head, $);
                value_of(env, ctrl, $);
                args = args.rest;
            }
            list($.length - h, $);
            return;
        }

        push(userfunc, $);

        // eval all args before changing bindings

        let args = expr.rest;
        try {
            for (let i = 0; i < 9; i++) {
                const head = args.head;
                try {
                    $.push(head);
                    value_of(env, ctrl, $);
                    const rest = args.rest;
                    args.release();
                    args = rest;
                } finally {
                    head.release();
                }
            }
        } finally {
            args.release();
        }

        save_symbol(ARG1, env);
        save_symbol(ARG2, env);
        save_symbol(ARG3, env);
        save_symbol(ARG4, env);
        save_symbol(ARG5, env);
        save_symbol(ARG6, env);
        save_symbol(ARG7, env);
        save_symbol(ARG8, env);
        save_symbol(ARG9, env);
        try {
            // TODO: We should be calling release on all the popped.
            set_symbol(ARG9, pop($), nil, env);
            set_symbol(ARG8, pop($), nil, env);
            set_symbol(ARG7, pop($), nil, env);
            set_symbol(ARG6, pop($), nil, env);
            set_symbol(ARG5, pop($), nil, env);
            set_symbol(ARG4, pop($), nil, env);
            set_symbol(ARG3, pop($), nil, env);
            set_symbol(ARG2, pop($), nil, env);
            set_symbol(ARG1, pop($), nil, env);

            value_of(env, ctrl, $);
        } finally {
            restore_symbol(env);
            restore_symbol(env);
            restore_symbol(env);
            restore_symbol(env);
            restore_symbol(env);
            restore_symbol(env);
            restore_symbol(env);
            restore_symbol(env);
            restore_symbol(env);
        }
    } finally {
        name.release();
        userfunc.release();
    }
}

// TODO: It should be possible to type p1: Sym (changes to math-expression-atoms needed)
function evaluate_user_symbol(name: Sym, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const binding = get_binding(assert_sym(name), nil, env);
    if (name.equals(binding)) {
        push(name, $); // symbol evaluates to itself
    } else {
        push(binding, $); // evaluate symbol binding
        value_of(env, ctrl, $);
    }
}

export function stack_zero(p1: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    p1 = cdr(p1);
    const h = $.length;
    let m = 1;

    while (is_cons(p1)) {
        push(car(p1), $);
        value_of(env, ctrl, $);
        dupl($);
        const n = pop_integer($);
        if (n < 2) stopf("zero: dim err");
        m *= n;
        p1 = cdr(p1);
    }

    const n = $.length - h;

    if (n === 0) {
        push_integer(0, $); // scalar zero
        return;
    }

    const T = alloc_tensor();

    for (let i = 0; i < m; i++) T.elems[i] = zero;

    // dim info

    for (let i = 0; i < n; i++) {
        T.dims[n - i - 1] = pop_integer($);
    }

    push(T, $);
}

export function value_of(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    ctrl.pushDirective(Directive.depth, ctrl.getDirective(Directive.depth) + 1);
    try {
        if (ctrl.getDirective(Directive.depth) === 200) {
            stopf("circular definition?");
        }

        const expr = pop($);
        try {
            if (is_cons(expr)) {
                const opr = expr.opr;
                try {
                    if (is_sym(opr)) {
                        if (env.hasBinding(opr, expr)) {
                            ctrl.pushDirective(Directive.expanding, ctrl.getDirective(Directive.expanding) + 1);
                            try {
                                // console.lg("getBinding", `${opr}`, `${expr}`);
                                const binding = env.getBinding(opr, expr);
                                // console.lg("binding", `${ binding } `);
                                try {
                                    if (is_atom(binding)) {
                                        // console.lg("binding.type", `${binding.type} `);
                                    } else if (is_cons(binding)) {
                                        // console.lg("binding.type", "cons");
                                    } else if (is_nil(binding)) {
                                        // console.lg("binding.type", "nil");
                                    }
                                    if (is_lambda(binding)) {
                                        const ctxt = new ExprContextFromProgram(env, ctrl);
                                        const body: LambdaExpr = binding.body;
                                        // console.lg(JSON.stringify(body), typeof body);
                                        const value = body(expr.rest, ctxt);
                                        // console.lg("value", `${value} `);
                                        try {
                                            $.push(value);
                                        } finally {
                                            value.release();
                                        }
                                    } else {
                                        $.push(binding);
                                    }
                                } finally {
                                    binding.release();
                                }
                            } finally {
                                ctrl.popDirective();
                            }
                            return;
                        }
                        if (env.hasUserFunction(opr)) {
                            stack_user_function(expr, env, ctrl, $);
                            return;
                        }
                    }
                } finally {
                    opr.release();
                }
                push(expr, $);
                return;
            }

            if (is_sym(expr)) {
                if (env.hasBinding(expr, nil)) {
                    // bare keyword
                    push(expr, $);
                    push(LAST, $); // default arg
                    list(2, $);
                    value_of(env, ctrl, $);
                    return;
                }
                if (env.hasUserFunction(expr)) {
                    evaluate_user_symbol(expr, env, ctrl, $);
                    return;
                }
                push(expr, $);
                return;
            }

            // The generalization here is to evaluate all other atoms through an appropriate extension.
            if (is_tensor(expr)) {
                evaluate_tensor(expr, env, ctrl, $);
                return;
            }

            push(expr, $); // rational, double, or string
        } finally {
            expr.release();
        }
    } finally {
        ctrl.popDirective();
    }
}

/**
 * By the context of usage, I think the name here means evaluate predicate.
 * @param env
 * @param ctrl
 * @param $
 */
function evalp(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const expr = pop($);
    try {
        if (is_cons(expr) && expr.opr.equals(ASSIGN)) {
            stack_testeq(expr, env, ctrl, $);
        } else {
            push(expr, $);
            value_of(env, ctrl, $);
        }
    } finally {
        expr.release();
    }
}

function expand_sum_factors(start: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    let n = $.length;

    if (n - start < 2) return;

    // search for a sum factor
    let i: number;
    let p2: U = nil;

    for (i = start; i < n; i++) {
        p2 = $.getAt(i);
        if (car(p2).equals(ADD)) break;
    }

    if (i === n) return; // no sum factors

    // remove the sum factor

    $.splice(i, 1);

    n = $.length - start;

    if (n > 1) {
        sort_factors(start, ctrl, $);
        list(n, $);
        push(MULTIPLY, $);
        swap($);
        cons($);
    }

    const p1 = pop($); // p1 is the multiplier

    p2 = cdr(p2); // p2 is the sum

    while (is_cons(p2)) {
        push(p1, $);
        push(car(p2), $);
        multiply(env, ctrl, $);
        p2 = cdr(p2);
    }

    sum_terms($.length - start, env, ctrl, $);
}
// N is bignum, M is rational

function factor_bignum(N: BigInteger, M: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    // greater than 31 bits?

    if (!bignum_issmallnum(N)) {
        push_bignum(1, N, bignum_int(1), $);
        if (isplusone(M)) return;
        push(POWER, $);
        swap($);
        push(M, $);
        list(3, $);
        return;
    }

    const h = $.length;

    let n = bignum_smallnum(N);

    factor_int(n, $);

    n = ($.length - h) / 2; // number of factors on stack

    for (let i = 0; i < n; i++) {
        const BASE = $.getAt(h + 2 * i + 0);
        let EXPO = $.getAt(h + 2 * i + 1);

        push(EXPO, $);
        push(M, $);
        multiply(env, ctrl, $);
        EXPO = pop($);

        if (isplusone(EXPO)) {
            $.setAt(h + i, BASE);
            continue;
        }

        push(POWER, $);
        push(BASE, $);
        push(EXPO, $);
        list(3, $);
        $.setAt(h + i, pop($));
    }

    $.splice(h + n); // pop all
}
// factors N or N^M where N and M are rational numbers, returns factors on stack

function factor_factor(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const INPUT = pop($);

    if (car(INPUT).equals(POWER)) {
        const BASE = cadr(INPUT);
        const EXPO = caddr(INPUT);

        if (!is_rat(BASE) || !is_rat(EXPO)) {
            push(INPUT, $); // cannot factor
            return;
        }

        if (isminusone(BASE)) {
            push(INPUT, $); // -1 to the M
            return;
        }

        if (isnegativenumber(BASE)) {
            push(POWER, $);
            push_integer(-1, $);
            push(EXPO, $);
            list(3, $); // leave on stack
        }

        const numer = BASE.a;
        const denom = BASE.b;

        if (!bignum_equal(numer, 1)) factor_bignum(numer, EXPO, env, ctrl, $);

        if (!bignum_equal(denom, 1)) {
            // flip sign of exponent
            push(EXPO, $);
            negate(env, ctrl, $);
            const expo = pop($);
            factor_bignum(denom, expo, env, ctrl, $);
        }

        return;
    }

    if (!is_rat(INPUT) || iszero(INPUT, env) || isplusone(INPUT) || isminusone(INPUT)) {
        push(INPUT, $);
        return;
    }

    if (isnegativenumber(INPUT)) push_integer(-1, $);

    const numer = INPUT.a;
    const denom = INPUT.b;

    if (!bignum_equal(numer, 1)) factor_bignum(numer, one, env, ctrl, $);

    if (!bignum_equal(denom, 1)) factor_bignum(denom, minusone, env, ctrl, $);
}
const primetab = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263,
    269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577,
    587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911,
    919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171, 1181, 1187, 1193, 1201, 1213, 1217, 1223,
    1229, 1231, 1237, 1249, 1259, 1277, 1279, 1283, 1289, 1291, 1297, 1301, 1303, 1307, 1319, 1321, 1327, 1361, 1367, 1373, 1381, 1399, 1409, 1423, 1427, 1429, 1433, 1439, 1447, 1451, 1453, 1459, 1471, 1481, 1483, 1487, 1489, 1493, 1499, 1511, 1523, 1531,
    1543, 1549, 1553, 1559, 1567, 1571, 1579, 1583, 1597, 1601, 1607, 1609, 1613, 1619, 1621, 1627, 1637, 1657, 1663, 1667, 1669, 1693, 1697, 1699, 1709, 1721, 1723, 1733, 1741, 1747, 1753, 1759, 1777, 1783, 1787, 1789, 1801, 1811, 1823, 1831, 1847, 1861,
    1867, 1871, 1873, 1877, 1879, 1889, 1901, 1907, 1913, 1931, 1933, 1949, 1951, 1973, 1979, 1987, 1993, 1997, 1999, 2003, 2011, 2017, 2027, 2029, 2039, 2053, 2063, 2069, 2081, 2083, 2087, 2089, 2099, 2111, 2113, 2129, 2131, 2137, 2141, 2143, 2153, 2161,
    2179, 2203, 2207, 2213, 2221, 2237, 2239, 2243, 2251, 2267, 2269, 2273, 2281, 2287, 2293, 2297, 2309, 2311, 2333, 2339, 2341, 2347, 2351, 2357, 2371, 2377, 2381, 2383, 2389, 2393, 2399, 2411, 2417, 2423, 2437, 2441, 2447, 2459, 2467, 2473, 2477, 2503,
    2521, 2531, 2539, 2543, 2549, 2551, 2557, 2579, 2591, 2593, 2609, 2617, 2621, 2633, 2647, 2657, 2659, 2663, 2671, 2677, 2683, 2687, 2689, 2693, 2699, 2707, 2711, 2713, 2719, 2729, 2731, 2741, 2749, 2753, 2767, 2777, 2789, 2791, 2797, 2801, 2803, 2819,
    2833, 2837, 2843, 2851, 2857, 2861, 2879, 2887, 2897, 2903, 2909, 2917, 2927, 2939, 2953, 2957, 2963, 2969, 2971, 2999, 3001, 3011, 3019, 3023, 3037, 3041, 3049, 3061, 3067, 3079, 3083, 3089, 3109, 3119, 3121, 3137, 3163, 3167, 3169, 3181, 3187, 3191,
    3203, 3209, 3217, 3221, 3229, 3251, 3253, 3257, 3259, 3271, 3299, 3301, 3307, 3313, 3319, 3323, 3329, 3331, 3343, 3347, 3359, 3361, 3371, 3373, 3389, 3391, 3407, 3413, 3433, 3449, 3457, 3461, 3463, 3467, 3469, 3491, 3499, 3511, 3517, 3527, 3529, 3533,
    3539, 3541, 3547, 3557, 3559, 3571, 3581, 3583, 3593, 3607, 3613, 3617, 3623, 3631, 3637, 3643, 3659, 3671, 3673, 3677, 3691, 3697, 3701, 3709, 3719, 3727, 3733, 3739, 3761, 3767, 3769, 3779, 3793, 3797, 3803, 3821, 3823, 3833, 3847, 3851, 3853, 3863,
    3877, 3881, 3889, 3907, 3911, 3917, 3919, 3923, 3929, 3931, 3943, 3947, 3967, 3989, 4001, 4003, 4007, 4013, 4019, 4021, 4027, 4049, 4051, 4057, 4073, 4079, 4091, 4093, 4099, 4111, 4127, 4129, 4133, 4139, 4153, 4157, 4159, 4177, 4201, 4211, 4217, 4219,
    4229, 4231, 4241, 4243, 4253, 4259, 4261, 4271, 4273, 4283, 4289, 4297, 4327, 4337, 4339, 4349, 4357, 4363, 4373, 4391, 4397, 4409, 4421, 4423, 4441, 4447, 4451, 4457, 4463, 4481, 4483, 4493, 4507, 4513, 4517, 4519, 4523, 4547, 4549, 4561, 4567, 4583,
    4591, 4597, 4603, 4621, 4637, 4639, 4643, 4649, 4651, 4657, 4663, 4673, 4679, 4691, 4703, 4721, 4723, 4729, 4733, 4751, 4759, 4783, 4787, 4789, 4793, 4799, 4801, 4813, 4817, 4831, 4861, 4871, 4877, 4889, 4903, 4909, 4919, 4931, 4933, 4937, 4943, 4951,
    4957, 4967, 4969, 4973, 4987, 4993, 4999, 5003, 5009, 5011, 5021, 5023, 5039, 5051, 5059, 5077, 5081, 5087, 5099, 5101, 5107, 5113, 5119, 5147, 5153, 5167, 5171, 5179, 5189, 5197, 5209, 5227, 5231, 5233, 5237, 5261, 5273, 5279, 5281, 5297, 5303, 5309,
    5323, 5333, 5347, 5351, 5381, 5387, 5393, 5399, 5407, 5413, 5417, 5419, 5431, 5437, 5441, 5443, 5449, 5471, 5477, 5479, 5483, 5501, 5503, 5507, 5519, 5521, 5527, 5531, 5557, 5563, 5569, 5573, 5581, 5591, 5623, 5639, 5641, 5647, 5651, 5653, 5657, 5659,
    5669, 5683, 5689, 5693, 5701, 5711, 5717, 5737, 5741, 5743, 5749, 5779, 5783, 5791, 5801, 5807, 5813, 5821, 5827, 5839, 5843, 5849, 5851, 5857, 5861, 5867, 5869, 5879, 5881, 5897, 5903, 5923, 5927, 5939, 5953, 5981, 5987, 6007, 6011, 6029, 6037, 6043,
    6047, 6053, 6067, 6073, 6079, 6089, 6091, 6101, 6113, 6121, 6131, 6133, 6143, 6151, 6163, 6173, 6197, 6199, 6203, 6211, 6217, 6221, 6229, 6247, 6257, 6263, 6269, 6271, 6277, 6287, 6299, 6301, 6311, 6317, 6323, 6329, 6337, 6343, 6353, 6359, 6361, 6367,
    6373, 6379, 6389, 6397, 6421, 6427, 6449, 6451, 6469, 6473, 6481, 6491, 6521, 6529, 6547, 6551, 6553, 6563, 6569, 6571, 6577, 6581, 6599, 6607, 6619, 6637, 6653, 6659, 6661, 6673, 6679, 6689, 6691, 6701, 6703, 6709, 6719, 6733, 6737, 6761, 6763, 6779,
    6781, 6791, 6793, 6803, 6823, 6827, 6829, 6833, 6841, 6857, 6863, 6869, 6871, 6883, 6899, 6907, 6911, 6917, 6947, 6949, 6959, 6961, 6967, 6971, 6977, 6983, 6991, 6997, 7001, 7013, 7019, 7027, 7039, 7043, 7057, 7069, 7079, 7103, 7109, 7121, 7127, 7129,
    7151, 7159, 7177, 7187, 7193, 7207, 7211, 7213, 7219, 7229, 7237, 7243, 7247, 7253, 7283, 7297, 7307, 7309, 7321, 7331, 7333, 7349, 7351, 7369, 7393, 7411, 7417, 7433, 7451, 7457, 7459, 7477, 7481, 7487, 7489, 7499, 7507, 7517, 7523, 7529, 7537, 7541,
    7547, 7549, 7559, 7561, 7573, 7577, 7583, 7589, 7591, 7603, 7607, 7621, 7639, 7643, 7649, 7669, 7673, 7681, 7687, 7691, 7699, 7703, 7717, 7723, 7727, 7741, 7753, 7757, 7759, 7789, 7793, 7817, 7823, 7829, 7841, 7853, 7867, 7873, 7877, 7879, 7883, 7901,
    7907, 7919, 7927, 7933, 7937, 7949, 7951, 7963, 7993, 8009, 8011, 8017, 8039, 8053, 8059, 8069, 8081, 8087, 8089, 8093, 8101, 8111, 8117, 8123, 8147, 8161, 8167, 8171, 8179, 8191, 8209, 8219, 8221, 8231, 8233, 8237, 8243, 8263, 8269, 8273, 8287, 8291,
    8293, 8297, 8311, 8317, 8329, 8353, 8363, 8369, 8377, 8387, 8389, 8419, 8423, 8429, 8431, 8443, 8447, 8461, 8467, 8501, 8513, 8521, 8527, 8537, 8539, 8543, 8563, 8573, 8581, 8597, 8599, 8609, 8623, 8627, 8629, 8641, 8647, 8663, 8669, 8677, 8681, 8689,
    8693, 8699, 8707, 8713, 8719, 8731, 8737, 8741, 8747, 8753, 8761, 8779, 8783, 8803, 8807, 8819, 8821, 8831, 8837, 8839, 8849, 8861, 8863, 8867, 8887, 8893, 8923, 8929, 8933, 8941, 8951, 8963, 8969, 8971, 8999, 9001, 9007, 9011, 9013, 9029, 9041, 9043,
    9049, 9059, 9067, 9091, 9103, 9109, 9127, 9133, 9137, 9151, 9157, 9161, 9173, 9181, 9187, 9199, 9203, 9209, 9221, 9227, 9239, 9241, 9257, 9277, 9281, 9283, 9293, 9311, 9319, 9323, 9337, 9341, 9343, 9349, 9371, 9377, 9391, 9397, 9403, 9413, 9419, 9421,
    9431, 9433, 9437, 9439, 9461, 9463, 9467, 9473, 9479, 9491, 9497, 9511, 9521, 9533, 9539, 9547, 9551, 9587, 9601, 9613, 9619, 9623, 9629, 9631, 9643, 9649, 9661, 9677, 9679, 9689, 9697, 9719, 9721, 9733, 9739, 9743, 9749, 9767, 9769, 9781, 9787, 9791,
    9803, 9811, 9817, 9829, 9833, 9839, 9851, 9857, 9859, 9871, 9883, 9887, 9901, 9907, 9923, 9929, 9931, 9941, 9949, 9967, 9973, 10007, 10009, 10037, 10039, 10061, 10067, 10069, 10079, 10091, 10093, 10099, 10103, 10111, 10133, 10139, 10141, 10151, 10159,
    10163, 10169, 10177, 10181, 10193, 10211, 10223, 10243, 10247, 10253, 10259, 10267, 10271, 10273, 10289, 10301, 10303, 10313, 10321, 10331, 10333, 10337, 10343, 10357, 10369, 10391, 10399, 10427, 10429, 10433, 10453, 10457, 10459, 10463, 10477, 10487,
    10499, 10501, 10513, 10529, 10531, 10559, 10567, 10589, 10597, 10601, 10607, 10613, 10627, 10631, 10639, 10651, 10657, 10663, 10667, 10687, 10691, 10709, 10711, 10723, 10729, 10733, 10739, 10753, 10771, 10781, 10789, 10799, 10831, 10837, 10847, 10853,
    10859, 10861, 10867, 10883, 10889, 10891, 10903, 10909, 10937, 10939, 10949, 10957, 10973, 10979, 10987, 10993, 11003, 11027, 11047, 11057, 11059, 11069, 11071, 11083, 11087, 11093, 11113, 11117, 11119, 11131, 11149, 11159, 11161, 11171, 11173, 11177,
    11197, 11213, 11239, 11243, 11251, 11257, 11261, 11273, 11279, 11287, 11299, 11311, 11317, 11321, 11329, 11351, 11353, 11369, 11383, 11393, 11399, 11411, 11423, 11437, 11443, 11447, 11467, 11471, 11483, 11489, 11491, 11497, 11503, 11519, 11527, 11549,
    11551, 11579, 11587, 11593, 11597, 11617, 11621, 11633, 11657, 11677, 11681, 11689, 11699, 11701, 11717, 11719, 11731, 11743, 11777, 11779, 11783, 11789, 11801, 11807, 11813, 11821, 11827, 11831, 11833, 11839, 11863, 11867, 11887, 11897, 11903, 11909,
    11923, 11927, 11933, 11939, 11941, 11953, 11959, 11969, 11971, 11981, 11987, 12007, 12011, 12037, 12041, 12043, 12049, 12071, 12073, 12097, 12101, 12107, 12109, 12113, 12119, 12143, 12149, 12157, 12161, 12163, 12197, 12203, 12211, 12227, 12239, 12241,
    12251, 12253, 12263, 12269, 12277, 12281, 12289, 12301, 12323, 12329, 12343, 12347, 12373, 12377, 12379, 12391, 12401, 12409, 12413, 12421, 12433, 12437, 12451, 12457, 12473, 12479, 12487, 12491, 12497, 12503, 12511, 12517, 12527, 12539, 12541, 12547,
    12553, 12569, 12577, 12583, 12589, 12601, 12611, 12613, 12619, 12637, 12641, 12647, 12653, 12659, 12671, 12689, 12697, 12703, 12713, 12721, 12739, 12743, 12757, 12763, 12781, 12791, 12799, 12809, 12821, 12823, 12829, 12841, 12853, 12889, 12893, 12899,
    12907, 12911, 12917, 12919, 12923, 12941, 12953, 12959, 12967, 12973, 12979, 12983, 13001, 13003, 13007, 13009, 13033, 13037, 13043, 13049, 13063, 13093, 13099, 13103, 13109, 13121, 13127, 13147, 13151, 13159, 13163, 13171, 13177, 13183, 13187, 13217,
    13219, 13229, 13241, 13249, 13259, 13267, 13291, 13297, 13309, 13313, 13327, 13331, 13337, 13339, 13367, 13381, 13397, 13399, 13411, 13417, 13421, 13441, 13451, 13457, 13463, 13469, 13477, 13487, 13499, 13513, 13523, 13537, 13553, 13567, 13577, 13591,
    13597, 13613, 13619, 13627, 13633, 13649, 13669, 13679, 13681, 13687, 13691, 13693, 13697, 13709, 13711, 13721, 13723, 13729, 13751, 13757, 13759, 13763, 13781, 13789, 13799, 13807, 13829, 13831, 13841, 13859, 13873, 13877, 13879, 13883, 13901, 13903,
    13907, 13913, 13921, 13931, 13933, 13963, 13967, 13997, 13999, 14009, 14011, 14029, 14033, 14051, 14057, 14071, 14081, 14083, 14087, 14107, 14143, 14149, 14153, 14159, 14173, 14177, 14197, 14207, 14221, 14243, 14249, 14251, 14281, 14293, 14303, 14321,
    14323, 14327, 14341, 14347, 14369, 14387, 14389, 14401, 14407, 14411, 14419, 14423, 14431, 14437, 14447, 14449, 14461, 14479, 14489, 14503, 14519, 14533, 14537, 14543, 14549, 14551, 14557, 14561, 14563, 14591, 14593, 14621, 14627, 14629, 14633, 14639,
    14653, 14657, 14669, 14683, 14699, 14713, 14717, 14723, 14731, 14737, 14741, 14747, 14753, 14759, 14767, 14771, 14779, 14783, 14797, 14813, 14821, 14827, 14831, 14843, 14851, 14867, 14869, 14879, 14887, 14891, 14897, 14923, 14929, 14939, 14947, 14951,
    14957, 14969, 14983, 15013, 15017, 15031, 15053, 15061, 15073, 15077, 15083, 15091, 15101, 15107, 15121, 15131, 15137, 15139, 15149, 15161, 15173, 15187, 15193, 15199, 15217, 15227, 15233, 15241, 15259, 15263, 15269, 15271, 15277, 15287, 15289, 15299,
    15307, 15313, 15319, 15329, 15331, 15349, 15359, 15361, 15373, 15377, 15383, 15391, 15401, 15413, 15427, 15439, 15443, 15451, 15461, 15467, 15473, 15493, 15497, 15511, 15527, 15541, 15551, 15559, 15569, 15581, 15583, 15601, 15607, 15619, 15629, 15641,
    15643, 15647, 15649, 15661, 15667, 15671, 15679, 15683, 15727, 15731, 15733, 15737, 15739, 15749, 15761, 15767, 15773, 15787, 15791, 15797, 15803, 15809, 15817, 15823, 15859, 15877, 15881, 15887, 15889, 15901, 15907, 15913, 15919, 15923, 15937, 15959,
    15971, 15973, 15991, 16001, 16007, 16033, 16057, 16061, 16063, 16067, 16069, 16073, 16087, 16091, 16097, 16103, 16111, 16127, 16139, 16141, 16183, 16187, 16189, 16193, 16217, 16223, 16229, 16231, 16249, 16253, 16267, 16273, 16301, 16319, 16333, 16339,
    16349, 16361, 16363, 16369, 16381, 16411, 16417, 16421, 16427, 16433, 16447, 16451, 16453, 16477, 16481, 16487, 16493, 16519, 16529, 16547, 16553, 16561, 16567, 16573, 16603, 16607, 16619, 16631, 16633, 16649, 16651, 16657, 16661, 16673, 16691, 16693,
    16699, 16703, 16729, 16741, 16747, 16759, 16763, 16787, 16811, 16823, 16829, 16831, 16843, 16871, 16879, 16883, 16889, 16901, 16903, 16921, 16927, 16931, 16937, 16943, 16963, 16979, 16981, 16987, 16993, 17011, 17021, 17027, 17029, 17033, 17041, 17047,
    17053, 17077, 17093, 17099, 17107, 17117, 17123, 17137, 17159, 17167, 17183, 17189, 17191, 17203, 17207, 17209, 17231, 17239, 17257, 17291, 17293, 17299, 17317, 17321, 17327, 17333, 17341, 17351, 17359, 17377, 17383, 17387, 17389, 17393, 17401, 17417,
    17419, 17431, 17443, 17449, 17467, 17471, 17477, 17483, 17489, 17491, 17497, 17509, 17519, 17539, 17551, 17569, 17573, 17579, 17581, 17597, 17599, 17609, 17623, 17627, 17657, 17659, 17669, 17681, 17683, 17707, 17713, 17729, 17737, 17747, 17749, 17761,
    17783, 17789, 17791, 17807, 17827, 17837, 17839, 17851, 17863, 17881, 17891, 17903, 17909, 17911, 17921, 17923, 17929, 17939, 17957, 17959, 17971, 17977, 17981, 17987, 17989, 18013, 18041, 18043, 18047, 18049, 18059, 18061, 18077, 18089, 18097, 18119,
    18121, 18127, 18131, 18133, 18143, 18149, 18169, 18181, 18191, 18199, 18211, 18217, 18223, 18229, 18233, 18251, 18253, 18257, 18269, 18287, 18289, 18301, 18307, 18311, 18313, 18329, 18341, 18353, 18367, 18371, 18379, 18397, 18401, 18413, 18427, 18433,
    18439, 18443, 18451, 18457, 18461, 18481, 18493, 18503, 18517, 18521, 18523, 18539, 18541, 18553, 18583, 18587, 18593, 18617, 18637, 18661, 18671, 18679, 18691, 18701, 18713, 18719, 18731, 18743, 18749, 18757, 18773, 18787, 18793, 18797, 18803, 18839,
    18859, 18869, 18899, 18911, 18913, 18917, 18919, 18947, 18959, 18973, 18979, 19001, 19009, 19013, 19031, 19037, 19051, 19069, 19073, 19079, 19081, 19087, 19121, 19139, 19141, 19157, 19163, 19181, 19183, 19207, 19211, 19213, 19219, 19231, 19237, 19249,
    19259, 19267, 19273, 19289, 19301, 19309, 19319, 19333, 19373, 19379, 19381, 19387, 19391, 19403, 19417, 19421, 19423, 19427, 19429, 19433, 19441, 19447, 19457, 19463, 19469, 19471, 19477, 19483, 19489, 19501, 19507, 19531, 19541, 19543, 19553, 19559,
    19571, 19577, 19583, 19597, 19603, 19609, 19661, 19681, 19687, 19697, 19699, 19709, 19717, 19727, 19739, 19751, 19753, 19759, 19763, 19777, 19793, 19801, 19813, 19819, 19841, 19843, 19853, 19861, 19867, 19889, 19891, 19913, 19919, 19927, 19937, 19949,
    19961, 19963, 19973, 19979, 19991, 19993, 19997, 20011, 20021, 20023, 20029, 20047, 20051, 20063, 20071, 20089, 20101, 20107, 20113, 20117, 20123, 20129, 20143, 20147, 20149, 20161, 20173, 20177, 20183, 20201, 20219, 20231, 20233, 20249, 20261, 20269,
    20287, 20297, 20323, 20327, 20333, 20341, 20347, 20353, 20357, 20359, 20369, 20389, 20393, 20399, 20407, 20411, 20431, 20441, 20443, 20477, 20479, 20483, 20507, 20509, 20521, 20533, 20543, 20549, 20551, 20563, 20593, 20599, 20611, 20627, 20639, 20641,
    20663, 20681, 20693, 20707, 20717, 20719, 20731, 20743, 20747, 20749, 20753, 20759, 20771, 20773, 20789, 20807, 20809, 20849, 20857, 20873, 20879, 20887, 20897, 20899, 20903, 20921, 20929, 20939, 20947, 20959, 20963, 20981, 20983, 21001, 21011, 21013,
    21017, 21019, 21023, 21031, 21059, 21061, 21067, 21089, 21101, 21107, 21121, 21139, 21143, 21149, 21157, 21163, 21169, 21179, 21187, 21191, 21193, 21211, 21221, 21227, 21247, 21269, 21277, 21283, 21313, 21317, 21319, 21323, 21341, 21347, 21377, 21379,
    21383, 21391, 21397, 21401, 21407, 21419, 21433, 21467, 21481, 21487, 21491, 21493, 21499, 21503, 21517, 21521, 21523, 21529, 21557, 21559, 21563, 21569, 21577, 21587, 21589, 21599, 21601, 21611, 21613, 21617, 21647, 21649, 21661, 21673, 21683, 21701,
    21713, 21727, 21737, 21739, 21751, 21757, 21767, 21773, 21787, 21799, 21803, 21817, 21821, 21839, 21841, 21851, 21859, 21863, 21871, 21881, 21893, 21911, 21929, 21937, 21943, 21961, 21977, 21991, 21997, 22003, 22013, 22027, 22031, 22037, 22039, 22051,
    22063, 22067, 22073, 22079, 22091, 22093, 22109, 22111, 22123, 22129, 22133, 22147, 22153, 22157, 22159, 22171, 22189, 22193, 22229, 22247, 22259, 22271, 22273, 22277, 22279, 22283, 22291, 22303, 22307, 22343, 22349, 22367, 22369, 22381, 22391, 22397,
    22409, 22433, 22441, 22447, 22453, 22469, 22481, 22483, 22501, 22511, 22531, 22541, 22543, 22549, 22567, 22571, 22573, 22613, 22619, 22621, 22637, 22639, 22643, 22651, 22669, 22679, 22691, 22697, 22699, 22709, 22717, 22721, 22727, 22739, 22741, 22751,
    22769, 22777, 22783, 22787, 22807, 22811, 22817, 22853, 22859, 22861, 22871, 22877, 22901, 22907, 22921, 22937, 22943, 22961, 22963, 22973, 22993, 23003, 23011, 23017, 23021, 23027, 23029, 23039, 23041, 23053, 23057, 23059, 23063, 23071, 23081, 23087,
    23099, 23117, 23131, 23143, 23159, 23167, 23173, 23189, 23197, 23201, 23203, 23209, 23227, 23251, 23269, 23279, 23291, 23293, 23297, 23311, 23321, 23327, 23333, 23339, 23357, 23369, 23371, 23399, 23417, 23431, 23447, 23459, 23473, 23497, 23509, 23531,
    23537, 23539, 23549, 23557, 23561, 23563, 23567, 23581, 23593, 23599, 23603, 23609, 23623, 23627, 23629, 23633, 23663, 23669, 23671, 23677, 23687, 23689, 23719, 23741, 23743, 23747, 23753, 23761, 23767, 23773, 23789, 23801, 23813, 23819, 23827, 23831,
    23833, 23857, 23869, 23873, 23879, 23887, 23893, 23899, 23909, 23911, 23917, 23929, 23957, 23971, 23977, 23981, 23993, 24001, 24007, 24019, 24023, 24029, 24043, 24049, 24061, 24071, 24077, 24083, 24091, 24097, 24103, 24107, 24109, 24113, 24121, 24133,
    24137, 24151, 24169, 24179, 24181, 24197, 24203, 24223, 24229, 24239, 24247, 24251, 24281, 24317, 24329, 24337, 24359, 24371, 24373, 24379, 24391, 24407, 24413, 24419, 24421, 24439, 24443, 24469, 24473, 24481, 24499, 24509, 24517, 24527, 24533, 24547,
    24551, 24571, 24593, 24611, 24623, 24631, 24659, 24671, 24677, 24683, 24691, 24697, 24709, 24733, 24749, 24763, 24767, 24781, 24793, 24799, 24809, 24821, 24841, 24847, 24851, 24859, 24877, 24889, 24907, 24917, 24919, 24923, 24943, 24953, 24967, 24971,
    24977, 24979, 24989, 25013, 25031, 25033, 25037, 25057, 25073, 25087, 25097, 25111, 25117, 25121, 25127, 25147, 25153, 25163, 25169, 25171, 25183, 25189, 25219, 25229, 25237, 25243, 25247, 25253, 25261, 25301, 25303, 25307, 25309, 25321, 25339, 25343,
    25349, 25357, 25367, 25373, 25391, 25409, 25411, 25423, 25439, 25447, 25453, 25457, 25463, 25469, 25471, 25523, 25537, 25541, 25561, 25577, 25579, 25583, 25589, 25601, 25603, 25609, 25621, 25633, 25639, 25643, 25657, 25667, 25673, 25679, 25693, 25703,
    25717, 25733, 25741, 25747, 25759, 25763, 25771, 25793, 25799, 25801, 25819, 25841, 25847, 25849, 25867, 25873, 25889, 25903, 25913, 25919, 25931, 25933, 25939, 25943, 25951, 25969, 25981, 25997, 25999, 26003, 26017, 26021, 26029, 26041, 26053, 26083,
    26099, 26107, 26111, 26113, 26119, 26141, 26153, 26161, 26171, 26177, 26183, 26189, 26203, 26209, 26227, 26237, 26249, 26251, 26261, 26263, 26267, 26293, 26297, 26309, 26317, 26321, 26339, 26347, 26357, 26371, 26387, 26393, 26399, 26407, 26417, 26423,
    26431, 26437, 26449, 26459, 26479, 26489, 26497, 26501, 26513, 26539, 26557, 26561, 26573, 26591, 26597, 26627, 26633, 26641, 26647, 26669, 26681, 26683, 26687, 26693, 26699, 26701, 26711, 26713, 26717, 26723, 26729, 26731, 26737, 26759, 26777, 26783,
    26801, 26813, 26821, 26833, 26839, 26849, 26861, 26863, 26879, 26881, 26891, 26893, 26903, 26921, 26927, 26947, 26951, 26953, 26959, 26981, 26987, 26993, 27011, 27017, 27031, 27043, 27059, 27061, 27067, 27073, 27077, 27091, 27103, 27107, 27109, 27127,
    27143, 27179, 27191, 27197, 27211, 27239, 27241, 27253, 27259, 27271, 27277, 27281, 27283, 27299, 27329, 27337, 27361, 27367, 27397, 27407, 27409, 27427, 27431, 27437, 27449, 27457, 27479, 27481, 27487, 27509, 27527, 27529, 27539, 27541, 27551, 27581,
    27583, 27611, 27617, 27631, 27647, 27653, 27673, 27689, 27691, 27697, 27701, 27733, 27737, 27739, 27743, 27749, 27751, 27763, 27767, 27773, 27779, 27791, 27793, 27799, 27803, 27809, 27817, 27823, 27827, 27847, 27851, 27883, 27893, 27901, 27917, 27919,
    27941, 27943, 27947, 27953, 27961, 27967, 27983, 27997, 28001, 28019, 28027, 28031, 28051, 28057, 28069, 28081, 28087, 28097, 28099, 28109, 28111, 28123, 28151, 28163, 28181, 28183, 28201, 28211, 28219, 28229, 28277, 28279, 28283, 28289, 28297, 28307,
    28309, 28319, 28349, 28351, 28387, 28393, 28403, 28409, 28411, 28429, 28433, 28439, 28447, 28463, 28477, 28493, 28499, 28513, 28517, 28537, 28541, 28547, 28549, 28559, 28571, 28573, 28579, 28591, 28597, 28603, 28607, 28619, 28621, 28627, 28631, 28643,
    28649, 28657, 28661, 28663, 28669, 28687, 28697, 28703, 28711, 28723, 28729, 28751, 28753, 28759, 28771, 28789, 28793, 28807, 28813, 28817, 28837, 28843, 28859, 28867, 28871, 28879, 28901, 28909, 28921, 28927, 28933, 28949, 28961, 28979, 29009, 29017,
    29021, 29023, 29027, 29033, 29059, 29063, 29077, 29101, 29123, 29129, 29131, 29137, 29147, 29153, 29167, 29173, 29179, 29191, 29201, 29207, 29209, 29221, 29231, 29243, 29251, 29269, 29287, 29297, 29303, 29311, 29327, 29333, 29339, 29347, 29363, 29383,
    29387, 29389, 29399, 29401, 29411, 29423, 29429, 29437, 29443, 29453, 29473, 29483, 29501, 29527, 29531, 29537, 29567, 29569, 29573, 29581, 29587, 29599, 29611, 29629, 29633, 29641, 29663, 29669, 29671, 29683, 29717, 29723, 29741, 29753, 29759, 29761,
    29789, 29803, 29819, 29833, 29837, 29851, 29863, 29867, 29873, 29879, 29881, 29917, 29921, 29927, 29947, 29959, 29983, 29989, 30011, 30013, 30029, 30047, 30059, 30071, 30089, 30091, 30097, 30103, 30109, 30113, 30119, 30133, 30137, 30139, 30161, 30169,
    30181, 30187, 30197, 30203, 30211, 30223, 30241, 30253, 30259, 30269, 30271, 30293, 30307, 30313, 30319, 30323, 30341, 30347, 30367, 30389, 30391, 30403, 30427, 30431, 30449, 30467, 30469, 30491, 30493, 30497, 30509, 30517, 30529, 30539, 30553, 30557,
    30559, 30577, 30593, 30631, 30637, 30643, 30649, 30661, 30671, 30677, 30689, 30697, 30703, 30707, 30713, 30727, 30757, 30763, 30773, 30781, 30803, 30809, 30817, 30829, 30839, 30841, 30851, 30853, 30859, 30869, 30871, 30881, 30893, 30911, 30931, 30937,
    30941, 30949, 30971, 30977, 30983, 31013, 31019, 31033, 31039, 31051, 31063, 31069, 31079, 31081, 31091, 31121, 31123, 31139, 31147, 31151, 31153, 31159, 31177, 31181, 31183, 31189, 31193, 31219, 31223, 31231, 31237, 31247, 31249, 31253, 31259, 31267,
    31271, 31277, 31307, 31319, 31321, 31327, 31333, 31337, 31357, 31379, 31387, 31391, 31393, 31397, 31469, 31477, 31481, 31489, 31511, 31513, 31517, 31531, 31541, 31543, 31547, 31567, 31573, 31583, 31601, 31607, 31627, 31643, 31649, 31657, 31663, 31667,
    31687, 31699, 31721, 31723, 31727, 31729, 31741, 31751, 31769, 31771, 31793, 31799, 31817, 31847, 31849, 31859, 31873, 31883, 31891, 31907, 31957, 31963, 31973, 31981, 31991, 32003, 32009, 32027, 32029, 32051, 32057, 32059, 32063, 32069, 32077, 32083,
    32089, 32099, 32117, 32119, 32141, 32143, 32159, 32173, 32183, 32189, 32191, 32203, 32213, 32233, 32237, 32251, 32257, 32261, 32297, 32299, 32303, 32309, 32321, 32323, 32327, 32341, 32353, 32359, 32363, 32369, 32371, 32377, 32381, 32401, 32411, 32413,
    32423, 32429, 32441, 32443, 32467, 32479, 32491, 32497, 32503, 32507, 32531, 32533, 32537, 32561, 32563, 32569, 32573, 32579, 32587, 32603, 32609, 32611, 32621, 32633, 32647, 32653, 32687, 32693, 32707, 32713, 32717, 32719, 32749, 32771, 32779, 32783,
    32789, 32797, 32801, 32803, 32831, 32833, 32839, 32843, 32869, 32887, 32909, 32911, 32917, 32933, 32939, 32941, 32957, 32969, 32971, 32983, 32987, 32993, 32999, 33013, 33023, 33029, 33037, 33049, 33053, 33071, 33073, 33083, 33091, 33107, 33113, 33119,
    33149, 33151, 33161, 33179, 33181, 33191, 33199, 33203, 33211, 33223, 33247, 33287, 33289, 33301, 33311, 33317, 33329, 33331, 33343, 33347, 33349, 33353, 33359, 33377, 33391, 33403, 33409, 33413, 33427, 33457, 33461, 33469, 33479, 33487, 33493, 33503,
    33521, 33529, 33533, 33547, 33563, 33569, 33577, 33581, 33587, 33589, 33599, 33601, 33613, 33617, 33619, 33623, 33629, 33637, 33641, 33647, 33679, 33703, 33713, 33721, 33739, 33749, 33751, 33757, 33767, 33769, 33773, 33791, 33797, 33809, 33811, 33827,
    33829, 33851, 33857, 33863, 33871, 33889, 33893, 33911, 33923, 33931, 33937, 33941, 33961, 33967, 33997, 34019, 34031, 34033, 34039, 34057, 34061, 34123, 34127, 34129, 34141, 34147, 34157, 34159, 34171, 34183, 34211, 34213, 34217, 34231, 34253, 34259,
    34261, 34267, 34273, 34283, 34297, 34301, 34303, 34313, 34319, 34327, 34337, 34351, 34361, 34367, 34369, 34381, 34403, 34421, 34429, 34439, 34457, 34469, 34471, 34483, 34487, 34499, 34501, 34511, 34513, 34519, 34537, 34543, 34549, 34583, 34589, 34591,
    34603, 34607, 34613, 34631, 34649, 34651, 34667, 34673, 34679, 34687, 34693, 34703, 34721, 34729, 34739, 34747, 34757, 34759, 34763, 34781, 34807, 34819, 34841, 34843, 34847, 34849, 34871, 34877, 34883, 34897, 34913, 34919, 34939, 34949, 34961, 34963,
    34981, 35023, 35027, 35051, 35053, 35059, 35069, 35081, 35083, 35089, 35099, 35107, 35111, 35117, 35129, 35141, 35149, 35153, 35159, 35171, 35201, 35221, 35227, 35251, 35257, 35267, 35279, 35281, 35291, 35311, 35317, 35323, 35327, 35339, 35353, 35363,
    35381, 35393, 35401, 35407, 35419, 35423, 35437, 35447, 35449, 35461, 35491, 35507, 35509, 35521, 35527, 35531, 35533, 35537, 35543, 35569, 35573, 35591, 35593, 35597, 35603, 35617, 35671, 35677, 35729, 35731, 35747, 35753, 35759, 35771, 35797, 35801,
    35803, 35809, 35831, 35837, 35839, 35851, 35863, 35869, 35879, 35897, 35899, 35911, 35923, 35933, 35951, 35963, 35969, 35977, 35983, 35993, 35999, 36007, 36011, 36013, 36017, 36037, 36061, 36067, 36073, 36083, 36097, 36107, 36109, 36131, 36137, 36151,
    36161, 36187, 36191, 36209, 36217, 36229, 36241, 36251, 36263, 36269, 36277, 36293, 36299, 36307, 36313, 36319, 36341, 36343, 36353, 36373, 36383, 36389, 36433, 36451, 36457, 36467, 36469, 36473, 36479, 36493, 36497, 36523, 36527, 36529, 36541, 36551,
    36559, 36563, 36571, 36583, 36587, 36599, 36607, 36629, 36637, 36643, 36653, 36671, 36677, 36683, 36691, 36697, 36709, 36713, 36721, 36739, 36749, 36761, 36767, 36779, 36781, 36787, 36791, 36793, 36809, 36821, 36833, 36847, 36857, 36871, 36877, 36887,
    36899, 36901, 36913, 36919, 36923, 36929, 36931, 36943, 36947, 36973, 36979, 36997, 37003, 37013, 37019, 37021, 37039, 37049, 37057, 37061, 37087, 37097, 37117, 37123, 37139, 37159, 37171, 37181, 37189, 37199, 37201, 37217, 37223, 37243, 37253, 37273,
    37277, 37307, 37309, 37313, 37321, 37337, 37339, 37357, 37361, 37363, 37369, 37379, 37397, 37409, 37423, 37441, 37447, 37463, 37483, 37489, 37493, 37501, 37507, 37511, 37517, 37529, 37537, 37547, 37549, 37561, 37567, 37571, 37573, 37579, 37589, 37591,
    37607, 37619, 37633, 37643, 37649, 37657, 37663, 37691, 37693, 37699, 37717, 37747, 37781, 37783, 37799, 37811, 37813, 37831, 37847, 37853, 37861, 37871, 37879, 37889, 37897, 37907, 37951, 37957, 37963, 37967, 37987, 37991, 37993, 37997, 38011, 38039,
    38047, 38053, 38069, 38083, 38113, 38119, 38149, 38153, 38167, 38177, 38183, 38189, 38197, 38201, 38219, 38231, 38237, 38239, 38261, 38273, 38281, 38287, 38299, 38303, 38317, 38321, 38327, 38329, 38333, 38351, 38371, 38377, 38393, 38431, 38447, 38449,
    38453, 38459, 38461, 38501, 38543, 38557, 38561, 38567, 38569, 38593, 38603, 38609, 38611, 38629, 38639, 38651, 38653, 38669, 38671, 38677, 38693, 38699, 38707, 38711, 38713, 38723, 38729, 38737, 38747, 38749, 38767, 38783, 38791, 38803, 38821, 38833,
    38839, 38851, 38861, 38867, 38873, 38891, 38903, 38917, 38921, 38923, 38933, 38953, 38959, 38971, 38977, 38993, 39019, 39023, 39041, 39043, 39047, 39079, 39089, 39097, 39103, 39107, 39113, 39119, 39133, 39139, 39157, 39161, 39163, 39181, 39191, 39199,
    39209, 39217, 39227, 39229, 39233, 39239, 39241, 39251, 39293, 39301, 39313, 39317, 39323, 39341, 39343, 39359, 39367, 39371, 39373, 39383, 39397, 39409, 39419, 39439, 39443, 39451, 39461, 39499, 39503, 39509, 39511, 39521, 39541, 39551, 39563, 39569,
    39581, 39607, 39619, 39623, 39631, 39659, 39667, 39671, 39679, 39703, 39709, 39719, 39727, 39733, 39749, 39761, 39769, 39779, 39791, 39799, 39821, 39827, 39829, 39839, 39841, 39847, 39857, 39863, 39869, 39877, 39883, 39887, 39901, 39929, 39937, 39953,
    39971, 39979, 39983, 39989, 40009, 40013, 40031, 40037, 40039, 40063, 40087, 40093, 40099, 40111, 40123, 40127, 40129, 40151, 40153, 40163, 40169, 40177, 40189, 40193, 40213, 40231, 40237, 40241, 40253, 40277, 40283, 40289, 40343, 40351, 40357, 40361,
    40387, 40423, 40427, 40429, 40433, 40459, 40471, 40483, 40487, 40493, 40499, 40507, 40519, 40529, 40531, 40543, 40559, 40577, 40583, 40591, 40597, 40609, 40627, 40637, 40639, 40693, 40697, 40699, 40709, 40739, 40751, 40759, 40763, 40771, 40787, 40801,
    40813, 40819, 40823, 40829, 40841, 40847, 40849, 40853, 40867, 40879, 40883, 40897, 40903, 40927, 40933, 40939, 40949, 40961, 40973, 40993, 41011, 41017, 41023, 41039, 41047, 41051, 41057, 41077, 41081, 41113, 41117, 41131, 41141, 41143, 41149, 41161,
    41177, 41179, 41183, 41189, 41201, 41203, 41213, 41221, 41227, 41231, 41233, 41243, 41257, 41263, 41269, 41281, 41299, 41333, 41341, 41351, 41357, 41381, 41387, 41389, 41399, 41411, 41413, 41443, 41453, 41467, 41479, 41491, 41507, 41513, 41519, 41521,
    41539, 41543, 41549, 41579, 41593, 41597, 41603, 41609, 41611, 41617, 41621, 41627, 41641, 41647, 41651, 41659, 41669, 41681, 41687, 41719, 41729, 41737, 41759, 41761, 41771, 41777, 41801, 41809, 41813, 41843, 41849, 41851, 41863, 41879, 41887, 41893,
    41897, 41903, 41911, 41927, 41941, 41947, 41953, 41957, 41959, 41969, 41981, 41983, 41999, 42013, 42017, 42019, 42023, 42043, 42061, 42071, 42073, 42083, 42089, 42101, 42131, 42139, 42157, 42169, 42179, 42181, 42187, 42193, 42197, 42209, 42221, 42223,
    42227, 42239, 42257, 42281, 42283, 42293, 42299, 42307, 42323, 42331, 42337, 42349, 42359, 42373, 42379, 42391, 42397, 42403, 42407, 42409, 42433, 42437, 42443, 42451, 42457, 42461, 42463, 42467, 42473, 42487, 42491, 42499, 42509, 42533, 42557, 42569,
    42571, 42577, 42589, 42611, 42641, 42643, 42649, 42667, 42677, 42683, 42689, 42697, 42701, 42703, 42709, 42719, 42727, 42737, 42743, 42751, 42767, 42773, 42787, 42793, 42797, 42821, 42829, 42839, 42841, 42853, 42859, 42863, 42899, 42901, 42923, 42929,
    42937, 42943, 42953, 42961, 42967, 42979, 42989, 43003, 43013, 43019, 43037, 43049, 43051, 43063, 43067, 43093, 43103, 43117, 43133, 43151, 43159, 43177, 43189, 43201, 43207, 43223, 43237, 43261, 43271, 43283, 43291, 43313, 43319, 43321, 43331, 43391,
    43397, 43399, 43403, 43411, 43427, 43441, 43451, 43457, 43481, 43487, 43499, 43517, 43541, 43543, 43573, 43577, 43579, 43591, 43597, 43607, 43609, 43613, 43627, 43633, 43649, 43651, 43661, 43669, 43691, 43711, 43717, 43721, 43753, 43759, 43777, 43781,
    43783, 43787, 43789, 43793, 43801, 43853, 43867, 43889, 43891, 43913, 43933, 43943, 43951, 43961, 43963, 43969, 43973, 43987, 43991, 43997, 44017, 44021, 44027, 44029, 44041, 44053, 44059, 44071, 44087, 44089, 44101, 44111, 44119, 44123, 44129, 44131,
    44159, 44171, 44179, 44189, 44201, 44203, 44207, 44221, 44249, 44257, 44263, 44267, 44269, 44273, 44279, 44281, 44293, 44351, 44357, 44371, 44381, 44383, 44389, 44417, 44449, 44453, 44483, 44491, 44497, 44501, 44507, 44519, 44531, 44533, 44537, 44543,
    44549, 44563, 44579, 44587, 44617, 44621, 44623, 44633, 44641, 44647, 44651, 44657, 44683, 44687, 44699, 44701, 44711, 44729, 44741, 44753, 44771, 44773, 44777, 44789, 44797, 44809, 44819, 44839, 44843, 44851, 44867, 44879, 44887, 44893, 44909, 44917,
    44927, 44939, 44953, 44959, 44963, 44971, 44983, 44987, 45007, 45013, 45053, 45061, 45077, 45083, 45119, 45121, 45127, 45131, 45137, 45139, 45161, 45179, 45181, 45191, 45197, 45233, 45247, 45259, 45263, 45281, 45289, 45293, 45307, 45317, 45319, 45329,
    45337, 45341, 45343, 45361, 45377, 45389, 45403, 45413, 45427, 45433, 45439, 45481, 45491, 45497, 45503, 45523, 45533, 45541, 45553, 45557, 45569, 45587, 45589, 45599, 45613, 45631, 45641, 45659, 45667, 45673, 45677, 45691, 45697, 45707, 45737, 45751,
    45757, 45763, 45767, 45779, 45817, 45821, 45823, 45827, 45833, 45841, 45853, 45863, 45869, 45887, 45893, 45943, 45949, 45953, 45959, 45971, 45979, 45989, 46021, 46027, 46049, 46051, 46061, 46073, 46091, 46093, 46099, 46103, 46133, 46141, 46147, 46153,
    46171, 46181, 46183, 46187, 46199, 46219, 46229, 46237, 46261, 46271, 46273, 46279, 46301, 46307, 46309, 46327, 46337
];

function factor_int(n: number, $: ProgramStack): void {
    n = Math.abs(n);

    if (n < 2) return;

    for (let k = 0; k < primetab.length; k++) {
        const d = primetab[k];

        let m = 0;

        while (n % d === 0) {
            n /= d;
            m++;
        }

        if (m === 0) continue;

        push_integer(d, $);
        push_integer(m, $);

        if (n === 1) return;
    }

    push_integer(n, $);
    push_integer(1, $);
}
// returns 1 with divisor on stack, otherwise returns 0

function find_divisor(p: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): 0 | 1 {
    if (car(p).equals(ADD)) {
        p = cdr(p);
        while (is_cons(p)) {
            if (find_divisor_term(car(p), env, ctrl, $)) return 1;
            p = cdr(p);
        }
        return 0;
    }

    return find_divisor_term(p, env, ctrl, $);
}

function find_divisor_term(p: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): 0 | 1 {
    if (car(p).equals(MULTIPLY)) {
        p = cdr(p);
        while (is_cons(p)) {
            if (find_divisor_factor(car(p), env, ctrl, $)) return 1;
            p = cdr(p);
        }
        return 0;
    }

    return find_divisor_factor(p, env, ctrl, $);
}

function find_divisor_factor(x: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): 0 | 1 {
    if (is_rat(x) && x.isInteger()) {
        return 0;
    }

    if (is_rat(x)) {
        push(x, $);
        denominator(env, ctrl, $);
        return 1;
    }

    if (is_cons(x) && is_power(x)) {
        const base = x.base;
        const expo = x.expo;
        if (isminusone(expo)) {
            if (!isminusone(base)) {
                push(base, $);
                return 1;
            }
        } else {
            if (!isminusone(base) && isnegativeterm(expo)) {
                push(POWER, $);
                push(base, $);
                push(expo, $);
                negate(env, ctrl, $);
                list(3, $);
                return 1;
            }
        }
    }

    return 0;
}

/**
 * Determines whether q is in p.
 * @param p
 * @param q
 * @returns
 */
function findf(p: U, q: U): 0 | 1 {
    if (equal(p, q)) return 1;

    if (is_tensor(p)) {
        const n = p.nelem;
        for (let i = 0; i < n; i++) {
            if (findf(p.elems[i], q)) return 1;
        }
        return 0;
    }

    while (is_cons(p)) {
        if (findf(car(p), q)) return 1;
        p = cdr(p);
    }

    return 0;
}

export function get_binding(opr: Sym, target: Cons, env: ProgramEnv): U {
    if (!is_sym(opr)) {
        stopf(`get_binding(${opr}) argument must be a Sym.`);
    }
    /*
    if (!env.hasUserFunction(name)) {
        stopf(`get_binding(${ name }) symbol error`);
    }
    */
    const binding = env.getBinding(opr, target);
    // TODO: We shouldn't need these first two checks.
    if (typeof binding === "undefined") {
        return opr;
    } else if (binding === null) {
        return opr;
    } else if (binding.isnil) {
        return opr; // symbol binds to itself
    } else {
        return binding;
    }
}

function get_userfunc(name: Sym, env: ProgramEnv): U {
    if (env.hasUserFunction(name)) {
        const f: U = env.getUserFunction(name);
        if (typeof f === "undefined") {
            return nil;
        } else if (f === null) {
            return nil;
        } else {
            return f;
        }
    } else {
        // stopf(`symbol error ${ name.key() } `);
        return nil;
    }
}

export const eigenmath_prolog: string[] = [
    "i = sqrt(-1)",
    "grad(f) = d(f,(x,y,z))",
    "cross(a,b) = (dot(a[2],b[3])-dot(a[3],b[2]),dot(a[3],b[1])-dot(a[1],b[3]),dot(a[1],b[2])-dot(a[2],b[1]))",
    "curl(u) = (d(u[3],y) - d(u[2],z),d(u[1],z) - d(u[3],x),d(u[2],x) - d(u[1],y))",
    "div(u) = d(u[1],x) + d(u[2],y) + d(u[3],z)",
    "laguerre(x,n,m) = (n + m)! sum(k,0,n,(-x)^k / ((n - k)! (m + k)! k!))",
    "legendre(f,n,m,x) = eval(1 / (2^n n!) (1 - x^2)^(m/2) d((x^2 - 1)^n,x,n + m),x,f)",
    "hermite(x,n) = (-1)^n exp(x^2) d(exp(-x^2),x,n)",
    "binomial(n,k) = n! / k! / (n - k)!",
    "choose(n,k) = n! / k! / (n - k)!"
];

function isalnum(s: string): boolean {
    return isalpha(s) || isdigit(s);
}

function isalpha(s: string): boolean {
    const c = s.charCodeAt(0);
    return (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
}

function iscomplexnumber(p: U): boolean {
    return isimaginarynumber(p) || (lengthf(p) === 3 && car(p).equals(ADD) && is_num(cadr(p)) && isimaginarynumber(caddr(p)));
}

function isdenormalpolar(expr: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack) {
    if (car(expr).equals(ADD)) {
        expr = cdr(expr);
        while (is_cons(expr)) {
            if (isdenormalpolarterm(car(expr), env, ctrl, $)) {
                return 1;
            }
            expr = cdr(expr);
        }
        return 0;
    }

    return isdenormalpolarterm(expr, env, ctrl, $);
}

function isdenormalpolarterm(expr: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack) {
    if (is_cons(expr) && expr.opr.equals(MULTIPLY)) {
        if (expr.length === 3) {
            const lhs = expr.lhs;
            const rhs = expr.rhs;
            try {
                if (lhs.equals(MATH_PI) && rhs.equals(imu)) {
                    return 1;
                }
                if (lhs.equals(imu) && rhs.equals(MATH_PI)) {
                    return 1;
                }
            } finally {
                lhs.release();
                rhs.release();
            }
        }

        if (lengthf(expr) !== 4 || !is_num(cadr(expr)) || !is_imu(caddr(expr)) || !cadddr(expr).equals(MATH_PI)) {
            return 0;
        }

        expr = cadr(expr); // p = coeff of term

        if (is_num(expr) && isnegativenumber(expr)) {
            return 1; // p < 0
        }

        push(expr, $);
        push_rational(-1, 2, $);
        add(env, ctrl, $);
        expr = pop($);

        if (!(is_num(expr) && isnegativenumber(expr))) {
            return 1; // p >= 1/2
        }

        return 0;
    } else {
        return 0;
    }
}

function isdoublesomewhere(p: U): 1 | 0 {
    if (is_flt(p)) return 1;

    if (is_cons(p)) {
        p = cdr(p);
        while (is_cons(p)) {
            if (isdoublesomewhere(car(p))) return 1;
            p = cdr(p);
        }
    }

    return 0;
}

function isimaginarynumber(p: U): boolean {
    return is_imu(p) || (lengthf(p) === 3 && car(p).equals(MULTIPLY) && is_num(cadr(p)) && is_imu(caddr(p)));
}

function isinteger1(p: Rat): boolean {
    return isinteger(p) && isplusone(p);
}

function isminusoneoversqrttwo(p: U): boolean {
    return lengthf(p) === 3 && car(p).equals(MULTIPLY) && isminusone(cadr(p)) && isoneoversqrttwo(caddr(p));
}

function isoneoversqrttwo(p: U): boolean {
    return car(p).equals(POWER) && isequaln(cadr(p), 2) && isequalq(caddr(p), -1, 2);
}

function isradical(p: U): boolean {
    if (car(p).equals(POWER)) {
        const base = cadr(p);
        const expo = caddr(p);
        return is_rat(base) && isposint(base) && is_rat(expo) && isfraction(expo);
    } else {
        return false;
    }
}

function issmallinteger(p: U): boolean {
    if (is_rat(p) && isinteger(p)) {
        return bignum_issmallnum(p.a);
    }

    if (is_flt(p)) return p.d === Math.floor(p.d) && Math.abs(p.d) <= 0x7fffffff;

    return false;
}

function issquarematrix(p: Tensor): boolean {
    return istensor(p) && p.ndim === 2 && p.dims[0] === p.dims[1];
}

function isstring(p: U): p is Str {
    return is_str(p);
}

export function istensor(p: U): p is Tensor {
    return is_tensor(p);
}

function isusersymbolsomewhere(p: U, env: ProgramEnv): 0 | 1 {
    if (is_sym(p) && env.hasUserFunction(p) && !p.equalsSym(MATH_PI) && !p.equalsSym(MATH_E)) return 1;

    if (is_cons(p)) {
        p = cdr(p);
        while (is_cons(p)) {
            if (isusersymbolsomewhere(car(p), env)) return 1;
            p = cdr(p);
        }
    }

    return 0;
}

function lessp(p1: U, p2: U): boolean {
    return cmp(p1, p2) < 0;
}

/**
 * [..., x1, x2, ..., xn] => [..., (x1, x2, ..., xn)]
 */
export function list(n: number, _: Pick<ProgramStack, "pop" | "push">): void {
    push(nil, _);
    for (let i = 0; i < n; i++) {
        cons(_);
    }
}

/**
 *
 */
export function lookup(sym: Sym, env: ProgramEnv): Sym {
    if (!env.hasBinding(sym, nil)) {
        env.defineUserSymbol(sym);
    }
    return sym;
}

/**
 * A convenience function for multiply_factors(2, $) factors on the stack.
 */
export function multiply(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    multiply_factors(2, env, ctrl, $);
}

/**
 * A convenience function for multiplying 2 factors on the stack with the expanding flag set.
 */
function multiply_expand(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    ctrl.pushDirective(Directive.expanding, 1);
    try {
        multiply(env, ctrl, $);
    } finally {
        ctrl.popDirective();
    }
}
/**
 *
 * @param n number of factors on stack to be multiplied.
 */
export function multiply_factors(n: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    if (n < 2) {
        return;
    }

    /**
     * The start of the factors on the stack.
     */
    const start = $.length - n;

    flatten_items(start, MULTIPLY, $);

    // console.lg(`after flatten factors: ${ $.stack } `);
    const uom = multiply_uom_factors(start, $);
    if (is_uom(uom)) {
        push(uom, $);
    }

    const B = multiply_blade_factors(start, env, ctrl, $);
    if (is_rat(B) && B.isOne()) {
        // Ignore
    } else if (is_nil(B)) {
        // Ignore
    } else {
        push(B, $);
    }

    const T = multiply_tensor_factors(start, env, ctrl, $);

    // console.lg(`after multiply tensor factors: ${ $.stack } `);

    multiply_scalar_factors(start, env, ctrl, $);

    // console.lg(`after multiply scalar factors: ${ $.stack } `);

    if (is_tensor(T)) {
        push(T, $);
        inner(env, ctrl, $);
    }
}

function multiply_noexpand(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    ctrl.pushDirective(Directive.expanding, 0);
    try {
        multiply(env, ctrl, $);
    } finally {
        ctrl.popDirective();
    }
}

/**
 * [...] => [..., lhs * rhs]
 */
function multiply_numbers(lhs: Num, rhs: Num, $: ProgramStack): void {
    if (is_rat(lhs) && is_rat(rhs)) {
        multiply_rationals(lhs, rhs, $);
        return;
    }

    const a = lhs.toNumber();
    const b = rhs.toNumber();

    push_double(a * b, $);
}

/**
 * [...] => [..., lhs * rhs]
 */
function multiply_rationals(lhs: Rat, rhs: Rat, $: ProgramStack): void {
    const x: Rat = lhs.mul(rhs);
    push(x, $);
}

/**
 *
 * @param start the start of the factors on the stack.
 * @param env
 * @param ctrl
 * @param $
 * @returns
 */
function multiply_scalar_factors(start: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const k0 = combine_numerical_factors(start, one, $);

    if (is_err(k0)) {
        $.splice(start); // pop all
        push(k0, $);
        return;
    }

    if (iszero(k0, env) || start === $.length) {
        $.splice(start); // pop all
        push(k0, $);
        return;
    }

    combine_factors(start, env, ctrl, $);
    normalize_power_factors(start, env, ctrl, $);

    // do again in case exp(1/2 i pi) changed to i

    combine_factors(start, env, ctrl, $);
    // console.lg(`after combine factors: ${ $.stack } `);
    normalize_power_factors(start, env, ctrl, $);

    const k1 = combine_numerical_factors(start, k0, $);

    if (is_err(k1)) {
        $.splice(start); // pop all
        push(k1, $);
        return;
    }

    if (iszero(k1, env) || start === $.length) {
        $.splice(start); // pop all
        push(k1, $);
        return;
    }

    const k2 = reduce_radical_factors(start, k1, env, ctrl, $);

    if (!isplusone(k2) || is_flt(k2)) push(k2, $);

    if (ctrl.getDirective(Directive.expanding)) {
        expand_sum_factors(start, env, ctrl, $); // success leaves one expr on stack
    }

    const n = $.length - start;

    switch (n) {
        case 0:
            push_integer(1, $);
            break;
        case 1:
            break;
        default:
            sort_factors(start, ctrl, $); // previously sorted provisionally
            list(n, $);
            push(MULTIPLY, $);
            swap($);
            cons($);
            break;
    }
}

/**
 * The return value is either nil (because there are no tensors) or is a tensor.
 * @param start The start index on the stack.
 */
function multiply_tensor_factors(start: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): U {
    let T: U = nil;
    let end = $.length;
    for (let i = start; i < end; i++) {
        const p1 = $.getAt(i);
        if (!istensor(p1)) {
            continue;
        }
        if (is_tensor(T)) {
            push(T, $);
            push(p1, $);
            hadamard(env, ctrl, $);
            T = pop($);
        } else {
            // The first time through, T is nil.
            T = p1;
        }
        $.splice(i, 1); // remove factor
        i--; // use same index again
        end--;
    }
    return T;
}

function multiply_blade_factors(start: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): U {
    let B: U = nil;
    let end = $.length;
    for (let i = start; i < end; i++) {
        const x = $.getAt(i);
        try {
            if (is_blade(x)) {
                if (is_nil(B)) {
                    // The first time through, B is nil.
                    B = x;
                } else {
                    push(native_sym(Native.multiply), $);
                    push(B, $);
                    push(x, $);
                    list(3, $);
                    value_of(env, ctrl, $);
                    B = $.pop();
                }
                $.splice(i, 1); // remove factor
                i--; // use same index again
                end--;
            } else {
                continue;
            }
        } finally {
            x.release();
        }
    }
    return B;
}

function multiply_uom_factors(start: number, $: ProgramStack): U {
    let product: U = nil;
    let end = $.length;
    for (let i = start; i < end; i++) {
        const p1 = $.getAt(i);
        if (!is_uom(p1)) {
            continue;
        }
        if (is_uom(product)) {
            product = product.mul(p1);
        } else {
            // The first time through, T is nil.
            product = p1;
        }
        $.splice(i, 1); // remove factor
        i--; // use same index again
        end--;
    }
    return product;
}

/**
 * [..., x] => [..., (* -1 x)]
 */
export function negate(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    //                                      [..., x]
    push_integer(-1, $); //  [..., x, -1];
    multiply_factors(2, env, ctrl, $); //  [..., (* -1 x)]
}

function normalize_polar(EXPO: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    // console.lg("normalize_polar", `${ EXPO } `);
    if (car(EXPO).equals(ADD)) {
        const h = $.length;
        let p1 = cdr(EXPO);
        while (is_cons(p1)) {
            EXPO = car(p1);
            if (isdenormalpolarterm(EXPO, env, ctrl, $)) normalize_polar_term(EXPO, env, ctrl, $);
            else {
                push(POWER, $);
                push(MATH_E, $);
                push(EXPO, $);
                list(3, $);
            }
            p1 = cdr(p1);
        }
        multiply_factors($.length - h, env, ctrl, $);
    } else normalize_polar_term(EXPO, env, ctrl, $);
}

function normalize_polar_term(EXPO: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    // exp(i pi) = -1

    if (lengthf(EXPO) === 3) {
        push_integer(-1, $);
        return;
    }

    const R = cadr(EXPO); // R = coeff of term

    if (is_rat(R)) normalize_polar_term_rational(R, env, ctrl, $);
    else normalize_polar_term_double(R as Flt, $);
}

function normalize_polar_term_rational(R: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    // R = R mod 2

    push(R, $);
    push_integer(2, $);
    modfunc(env, ctrl, $);
    R = pop($);

    // convert negative rotation to positive

    if (is_num(R) && isnegativenumber(R)) {
        push(R, $);
        push_integer(2, $);
        add(env, ctrl, $);
        R = pop($);
    }

    push(R, $);
    push_integer(2, $);
    multiply(env, ctrl, $);
    floorfunc(env, ctrl, $);
    const n = pop_integer($); // number of 90 degree turns

    push(R, $);
    push_integer(n, $);
    push_rational(-1, 2, $);
    multiply(env, ctrl, $);
    add(env, ctrl, $);
    R = pop($); // remainder

    switch (n) {
        case 0:
            if (iszero(R, env)) push_integer(1, $);
            else {
                push(POWER, $);
                push(MATH_E, $);
                push(MULTIPLY, $);
                push(R, $);
                push(imu, $);
                push(MATH_PI, $);
                list(4, $);
                list(3, $);
            }
            break;

        case 1:
            if (iszero(R, env)) push(imu, $);
            else {
                push(MULTIPLY, $);
                push(imu, $);
                push(POWER, $);
                push(MATH_E, $);
                push(MULTIPLY, $);
                push(R, $);
                push(imu, $);
                push(MATH_PI, $);
                list(4, $);
                list(3, $);
                list(3, $);
            }
            break;

        case 2:
            if (iszero(R, env)) push_integer(-1, $);
            else {
                push(MULTIPLY, $);
                push_integer(-1, $);
                push(POWER, $);
                push(MATH_E, $);
                push(MULTIPLY, $);
                push(R, $);
                push(imu, $);
                push(MATH_PI, $);
                list(4, $);
                list(3, $);
                list(3, $);
            }
            break;

        case 3:
            if (iszero(R, env)) {
                push(MULTIPLY, $);
                push_integer(-1, $);
                push(imu, $);
                list(3, $);
            } else {
                push(MULTIPLY, $);
                push_integer(-1, $);
                push(imu, $);
                push(POWER, $);
                push(MATH_E, $);
                push(MULTIPLY, $);
                push(R, $);
                push(imu, $);
                push(MATH_PI, $);
                list(4, $);
                list(3, $);
                list(4, $);
            }
            break;
    }
}

function normalize_polar_term_double(R: Flt, $: ProgramStack): void {
    let coeff = R.d;

    // coeff = coeff mod 2

    coeff = coeff % 2;

    // convert negative rotation to positive

    if (coeff < 0) coeff += 2;

    const n = Math.floor(2 * coeff); // number of 1/4 turns

    const r = coeff - n / 2; // remainder

    switch (n) {
        case 0:
            if (r === 0) push_integer(1, $);
            else {
                push(POWER, $);
                push(MATH_E, $);
                push(MULTIPLY, $);
                push_double(r, $);
                push(imu, $);
                push(MATH_PI, $);
                list(4, $);
                list(3, $);
            }
            break;

        case 1:
            if (r === 0) push(imu, $);
            else {
                push(MULTIPLY, $);
                push(imu, $);
                push(POWER, $);
                push(MATH_E, $);
                push(MULTIPLY, $);
                push_double(r, $);
                push(imu, $);
                push(MATH_PI, $);
                list(4, $);
                list(3, $);
                list(3, $);
            }
            break;

        case 2:
            if (r === 0) push_integer(-1, $);
            else {
                push(MULTIPLY, $);
                push_integer(-1, $);
                push(POWER, $);
                push(MATH_E, $);
                push(MULTIPLY, $);
                push_double(r, $);
                push(imu, $);
                push(MATH_PI, $);
                list(4, $);
                list(3, $);
                list(3, $);
            }
            break;

        case 3:
            if (r === 0) {
                push(MULTIPLY, $);
                push_integer(-1, $);
                push(imu, $);
                list(3, $);
            } else {
                push(MULTIPLY, $);
                push_integer(-1, $);
                push(imu, $);
                push(POWER, $);
                push(MATH_E, $);
                push(MULTIPLY, $);
                push_double(r, $);
                push(imu, $);
                push(MATH_PI, $);
                list(4, $);
                list(3, $);
                list(4, $);
            }
            break;
    }
}

function normalize_power_factors(h: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const k = $.length;
    for (let i = h; i < k; i++) {
        let p1 = $.getAt(i);
        if (car(p1).equals(POWER)) {
            push(cadr(p1), $);
            push(caddr(p1), $);
            power(env, ctrl, $);
            p1 = pop($);
            if (car(p1).equals(MULTIPLY)) {
                p1 = cdr(p1);
                $.setAt(i, car(p1));
                p1 = cdr(p1);
                while (is_cons(p1)) {
                    push(car(p1), $);
                    p1 = cdr(p1);
                }
            } else $.setAt(i, p1);
        }
    }
}

const ORDER_1 = 1;
const ORDER_2 = 2;
const ORDER_3 = 3;
const ORDER_4 = 4;
const ORDER_5 = 5;
const ORDER_6 = 6;
const ORDER_7 = 7;
const ORDER_8 = 8;

/**
 *  1   number
 *  2   number to power (root)
 *  3   -1 to power (imaginary)
 *  4   other factor (symbol, power, func, etc)
 *  5   exponential
 *  6   derivative
 *
 * @param expr
 * @returns
 */
function order_factor(expr: U): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 {
    // console.lg("order_factor", `${ expr } `);
    if (is_atom(expr)) {
        if (is_num(expr)) {
            return ORDER_1;
        }
        if (is_blade(expr)) {
            return ORDER_4;
        }
        if (is_str(expr)) {
            return ORDER_5;
        }
        if (is_uom(expr)) {
            return ORDER_6;
        }
        if (expr.equals(MATH_E)) {
            return ORDER_7;
        }
    } else if (is_cons(expr)) {
        if (car(expr).equals(DERIVATIVE) || car(expr).equals(D_LOWER)) {
            return ORDER_8;
        }

        if (car(expr).equals(POWER)) {
            expr = cadr(expr); // p = base

            if (isminusone(expr)) {
                return ORDER_3;
            }

            if (is_num(expr)) {
                return ORDER_2;
            }

            if (expr.equals(MATH_E)) {
                return ORDER_7;
            }

            if (car(expr).equals(DERIVATIVE) || car(expr).equals(D_LOWER)) {
                return ORDER_8;
            }
        }
    }

    return ORDER_6;
}

function partition_term($: ProgramStack): void {
    const X = pop($);
    const F = pop($);

    // push const factors

    let h = $.length;
    let p1 = cdr(F);
    while (is_cons(p1)) {
        if (!findf(car(p1), X)) push(car(p1), $);
        p1 = cdr(p1);
    }

    let n = $.length - h;

    if (n === 0) push_integer(1, $);
    else if (n > 1) {
        list(n, $);
        push(MULTIPLY, $);
        swap($);
        cons($); // makes MULTIPLY head of list
    }

    // push var factors

    h = $.length;
    p1 = cdr(F);
    while (is_cons(p1)) {
        if (findf(car(p1), X)) push(car(p1), $);
        p1 = cdr(p1);
    }

    n = $.length - h;

    if (n === 0) push_integer(1, $);
    else if (n > 1) {
        list(n, $);
        push(MULTIPLY, $);
        swap($);
        cons($); // makes MULTIPLY head of list
    }
}
// https://github.com/ghewgill/picomath

function erf(x: number): number {
    if (x === 0) return 0;

    // constants
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    // Save the sign of x
    let sign = 1;
    if (x < 0) sign = -1;
    x = Math.abs(x);

    // A&S formula 7.1.26
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
}

function erfc(x: number): number {
    return 1.0 - erf(x);
}

export function pop(_: Pick<ProgramStack, "pop">): U {
    return _.pop();
}

function assert_num_to_number(x: Num): number | never {
    if (is_num(x)) {
        return x.toNumber();
    } else {
        throw new ProgrammingError(`assert_num_to_number() number expected ${x} `);
    }
}

function pop_double($: ProgramStack): number {
    const expr = pop($);
    try {
        if (is_num(expr)) {
            return expr.toNumber();
        } else {
            stopf("pop_double() number expected");
        }
    } finally {
        expr.release();
    }
}

export function pop_integer($: Pick<ProgramStack, "pop">): number {
    const expr = pop($);
    try {
        if (!issmallinteger(expr)) {
            stopf("small integer expected");
        }

        if (is_rat(expr)) {
            const n = bignum_smallnum(expr.a);
            if (isnegativenumber(expr)) {
                return -n;
            } else {
                return n;
            }
        } else if (is_flt(expr)) {
            return (expr as Flt).d;
        } else {
            throw new ProgrammingError();
        }
    } finally {
        expr.release();
    }
}

function power_complex_double(_BASE: U, EXPO: U, X: U, Y: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(X, $);
    let x = pop_double($);

    push(Y, $);
    let y = pop_double($);

    push(EXPO, $);
    const expo = pop_double($);

    let r = Math.sqrt(x * x + y * y);
    let theta = Math.atan2(y, x);

    r = Math.pow(r, expo);
    theta = expo * theta;

    x = r * Math.cos(theta);
    y = r * Math.sin(theta);

    push_double(x, $);
    push_double(y, $);
    push(imu, $);
    multiply(env, ctrl, $);
    add(env, ctrl, $);
}

function power_complex_minus(X: U, Y: U, n: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    // R = X^2 + Y^2

    push(X, $);
    push(X, $);
    multiply(env, ctrl, $);
    push(Y, $);
    push(Y, $);
    multiply(env, ctrl, $);
    add(env, ctrl, $);
    const R = pop($);

    // X = X / R

    push(X, $);
    push(R, $);
    divide(env, ctrl, $);
    X = pop($);

    // Y = -Y / R

    push(Y, $);
    negate(env, ctrl, $);
    push(R, $);
    divide(env, ctrl, $);
    Y = pop($);

    let PX = X;
    let PY = Y;

    for (let i = 1; i < n; i++) {
        push(PX, $);
        push(X, $);
        multiply(env, ctrl, $);
        push(PY, $);
        push(Y, $);
        multiply(env, ctrl, $);
        subtract(env, ctrl, $);

        push(PX, $);
        push(Y, $);
        multiply(env, ctrl, $);
        push(PY, $);
        push(X, $);
        multiply(env, ctrl, $);
        add(env, ctrl, $);

        PY = pop($);
        PX = pop($);
    }

    // X + i*Y

    push(PX, $);
    push(imu, $);
    push(PY, $);
    multiply(env, ctrl, $);
    add(env, ctrl, $);
}

function power_complex_number(base: U, expo: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    let X: U;
    let Y: U;

    // prefixform(2 + 3 i) = (add 2 (multiply 3 (power -1 1/2)))

    // prefixform(1 + i) = (add 1 (power -1 1/2))

    // prefixform(3 i) = (multiply 3 (power -1 1/2))

    // prefixform(i) = (power -1 1/2)

    if (car(base).equals(ADD)) {
        X = cadr(base);
        if (caaddr(base).equals(MULTIPLY)) Y = cadaddr(base);
        else Y = one;
    } else if (car(base).equals(MULTIPLY)) {
        X = zero;
        Y = cadr(base);
    } else {
        X = zero;
        Y = one;
    }

    if (is_flt(X) || is_flt(Y) || is_flt(expo)) {
        power_complex_double(base, expo, X, Y, env, ctrl, $);
        return;
    }

    if (!(is_rat(expo) && isinteger(expo))) {
        power_complex_rational(base, expo, X, Y, env, ctrl, $);
        return;
    }

    if (!issmallinteger(expo)) {
        push(POWER, $);
        push(base, $);
        push(expo, $);
        list(3, $);
        return;
    }

    push(expo, $);
    const n = pop_integer($);

    if (n > 0) power_complex_plus(X, Y, n, env, ctrl, $);
    else if (n < 0) power_complex_minus(X, Y, -n, env, ctrl, $);
    else push_integer(1, $);
}

function power_complex_plus(X: U, Y: U, n: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    let PX = X;
    let PY = Y;

    for (let i = 1; i < n; i++) {
        push(PX, $);
        push(X, $);
        multiply(env, ctrl, $);
        push(PY, $);
        push(Y, $);
        multiply(env, ctrl, $);
        subtract(env, ctrl, $);

        push(PX, $);
        push(Y, $);
        multiply(env, ctrl, $);
        push(PY, $);
        push(X, $);
        multiply(env, ctrl, $);
        add(env, ctrl, $);

        PY = pop($);
        PX = pop($);
    }

    // X + i Y

    push(PX, $);
    push(imu, $);
    push(PY, $);
    multiply(env, ctrl, $);
    add(env, ctrl, $);
}

function power_complex_rational(_BASE: U, EXPO: U, X: U, Y: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    // calculate sqrt(X^2 + Y^2) ^ (1/2 * EXPO)

    push(X, $);
    push(X, $);
    multiply(env, ctrl, $);
    push(Y, $);
    push(Y, $);
    multiply(env, ctrl, $);
    add(env, ctrl, $);
    push_rational(1, 2, $);
    push(EXPO, $);
    multiply(env, ctrl, $);
    power(env, ctrl, $);

    // calculate (-1) ^ (EXPO * arctan(Y, X) / pi)

    push(Y, $);
    push(X, $);
    arctan(env, ctrl, $);
    push(MATH_PI, $);
    divide(env, ctrl, $);
    push(EXPO, $);
    multiply(env, ctrl, $);
    EXPO = pop($);
    power_minusone(EXPO, env, ctrl, $);

    // result = sqrt(X^2 + Y^2) ^ (1/2 * EXPO) * (-1) ^ (EXPO * arctan(Y, X) / pi)

    multiply(env, ctrl, $);
}

function power_minusone(expo: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    // optimization for i

    if (isequalq(expo, 1, 2)) {
        push(imu, $);
        return;
    }

    // root is an odd number?

    if (is_rat(expo) && bignum_odd(expo.b)) {
        if (bignum_odd(expo.a)) push_integer(-1, $);
        else push_integer(1, $);
        return;
    }

    if (is_rat(expo)) {
        normalize_clock_rational(expo, env, ctrl, $);
        return;
    }

    if (is_flt(expo)) {
        normalize_clock_double(expo, $);
        rect(env, ctrl, $);
        return;
    }

    push(POWER, $);
    push_integer(-1, $);
    push(expo, $);
    list(3, $);
}

function normalize_clock_rational(expo: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    // R = EXPO mod 2

    push(expo, $);
    push_integer(2, $);
    modfunc(env, ctrl, $);
    let R = pop($);

    // convert negative rotation to positive

    if (is_num(R) && isnegativenumber(R)) {
        push(R, $);
        push_integer(2, $);
        add(env, ctrl, $);
        R = pop($);
    }

    push(R, $);
    push_integer(2, $);
    multiply(env, ctrl, $);
    floorfunc(env, ctrl, $);
    const n = pop_integer($); // number of 90 degree turns

    push(R, $);
    push_integer(n, $);
    push_rational(-1, 2, $);
    multiply(env, ctrl, $);
    add(env, ctrl, $);
    R = pop($); // remainder

    switch (n) {
        case 0:
            if (iszero(R, env)) push_integer(1, $);
            else {
                push(POWER, $);
                push_integer(-1, $);
                push(R, $);
                list(3, $);
            }
            break;

        case 1:
            if (iszero(R, env)) push(imu, $);
            else {
                push(MULTIPLY, $);
                push_integer(-1, $);
                push(POWER, $);
                push_integer(-1, $);
                push(R, $);
                push_rational(-1, 2, $);
                add(env, ctrl, $);
                list(3, $);
                list(3, $);
            }
            break;

        case 2:
            if (iszero(R, env)) push_integer(-1, $);
            else {
                push(MULTIPLY, $);
                push_integer(-1, $);
                push(POWER, $);
                push_integer(-1, $);
                push(R, $);
                list(3, $);
                list(3, $);
            }
            break;

        case 3:
            if (iszero(R, env)) {
                push(MULTIPLY, $);
                push_integer(-1, $);
                push(imu, $);
                list(3, $);
            } else {
                push(POWER, $);
                push_integer(-1, $);
                push(R, $);
                push_rational(-1, 2, $);
                add(env, ctrl, $);
                list(3, $);
            }
            break;
    }
}

function normalize_clock_double(EXPO: Flt, $: ProgramStack): void {
    let expo = EXPO.d;

    // expo = expo mod 2

    expo = expo % 2;

    // convert negative rotation to positive

    if (expo < 0) expo += 2;

    const n = Math.floor(2 * expo); // number of 90 degree turns

    const r = expo - n / 2; // remainder

    switch (n) {
        case 0:
            if (r === 0) push_integer(1, $);
            else {
                push(POWER, $);
                push_integer(-1, $);
                push_double(r, $);
                list(3, $);
            }
            break;

        case 1:
            if (r === 0) push(imu, $);
            else {
                push(MULTIPLY, $);
                push_integer(-1, $);
                push(POWER, $);
                push_integer(-1, $);
                push_double(r - 0.5, $);
                list(3, $);
                list(3, $);
            }
            break;

        case 2:
            if (r === 0) push_integer(-1, $);
            else {
                push(MULTIPLY, $);
                push_integer(-1, $);
                push(POWER, $);
                push_integer(-1, $);
                push_double(r, $);
                list(3, $);
                list(3, $);
            }
            break;

        case 3:
            if (r === 0) {
                push(MULTIPLY, $);
                push_integer(-1, $);
                push(imu, $);
                list(3, $);
            } else {
                push(POWER, $);
                push_integer(-1, $);
                push_double(r - 0.5, $);
                list(3, $);
            }
            break;
    }
}

/**
 * (pow e expo)
 *
 * [...] => (pow e expo)
 */
export function power_e_expo(expo: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    // console.lg("power_e_expo", "expo", `${ expo } `);

    // exp(x + i y) = exp(x) (cos(y) + i sin(y))
    let x: number;
    let y: number;

    if (isdoublez(expo)) {
        if (car(expo).equals(ADD)) {
            x = (cadr(expo) as Flt).d;
            y = (cadaddr(expo) as Flt).d;
        } else {
            x = 0.0;
            y = (cadr(expo) as Flt).d;
        }
        push_double(Math.exp(x), $);
        push_double(y, $);
        cosfunc(env, ctrl, $);
        push(imu, $);
        push_double(y, $);
        sinfunc(env, ctrl, $);
        multiply(env, ctrl, $);
        add(env, ctrl, $);
        multiply(env, ctrl, $);
        return;
    }

    // e^log(expr) = expr

    if (is_cons(expo) && expo.opr.equals(LOG)) {
        push(expo, $); // [(log (expr))]   or [log(expr)]
        $.rest(); // [(expr)]
        $.head(); // [expr]
        push(cadr(expo), $);
        return;
    }

    if (isdenormalpolar(expo, env, ctrl, $)) {
        normalize_polar(expo, env, ctrl, $);
        return;
    }

    push(POWER, $);
    push(MATH_E, $);
    push(expo, $);
    list(3, $);
}

function power_numbers(base: Num, expo: Num, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    // n^0

    if (iszero(expo, env)) {
        push_integer(1, $);
        return;
    }

    // 0^n

    if (iszero(base, env)) {
        if (isnegativenumber(expo)) {
            const err = diagnostic(Diagnostics.Division_by_zero);
            try {
                $.push(err);
                return;
            } finally {
                err.release();
            }
        } else {
            push_integer(0, $);
            return;
        }
    }

    // 1^n

    if (isplusone(base)) {
        push_integer(1, $);
        return;
    }

    // n^1

    if (isplusone(expo)) {
        push(base, $);
        return;
    }

    if (is_flt(base) || is_flt(expo)) {
        power_double(base, expo, env, ctrl, $);
        return;
    }

    // integer exponent?

    if (isinteger(expo)) {
        // TODO: Move this into Rat.pow(Rat)
        // We can forget about EXPO.b because EXPO is an integer.
        // It's crucial that we handle negative exponents carefully.
        if (expo.isNegative()) {
            // (a/b)^(-n) = (b/a)^n = (b^n)/(a^n)
            const n = expo.a.negate();
            const a = bignum_pow(base.a, n);
            const b = bignum_pow(base.b, n);
            const X = new Rat(b, a);
            push(X, $);
        } else {
            const n = expo.a;
            const a = bignum_pow(base.a, n);
            const b = bignum_pow(base.b, n);
            const X = new Rat(a, b);
            push(X, $);
        }
        return;
    }

    // exponent is a root

    const h = $.length;

    // put factors on stack

    push(POWER, $);
    push(base, $);
    push(expo, $);
    list(3, $);

    factor_factor(env, ctrl, $);

    // normalize factors

    let n = $.length - h; // fix n now, stack can grow

    for (let i = 0; i < n; i++) {
        const p1 = $.getAt(h + i);
        if (car(p1).equals(POWER)) {
            base = cadr(p1) as Num;
            expo = caddr(p1) as Num;
            power_numbers_factor(base as Rat, expo as Rat, env, ctrl, $);
            $.setAt(h + i, pop($)); // fill hole
        }
    }

    // combine numbers (leaves radicals on stack)

    let p1: U = one;

    for (let i = h; i < $.length; i++) {
        const p2 = $.getAt(i);
        if (is_num(p2)) {
            push(p1, $);
            push(p2, $);
            multiply(env, ctrl, $);
            p1 = pop($);
            $.splice(i, 1);
            i--;
        }
    }

    // finalize

    n = $.length - h;

    if (n === 0 || !isplusone(p1)) {
        push(p1, $);
        n++;
    }

    if (n === 1) return;

    sort_factors(h, ctrl, $);
    list(n, $);
    push(MULTIPLY, $);
    swap($);
    cons($);
}

// BASE is an integer

function power_numbers_factor(BASE: Rat, EXPO: Rat, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    if (isminusone(BASE)) {
        power_minusone(EXPO, env, ctrl, $);
        let p0 = pop($);
        if (car(p0).equals(MULTIPLY)) {
            p0 = cdr(p0);
            while (is_cons(p0)) {
                push(car(p0), $);
                p0 = cdr(p0);
            }
        } else push(p0, $);
        return;
    }

    if (isinteger(EXPO)) {
        const a = bignum_pow(BASE.a, EXPO.a);
        const b = bignum_int(1);

        if (isnegativenumber(EXPO))
            push_bignum(1, b, a, $); // reciprocate
        else push_bignum(1, a, b, $);

        return;
    }

    // EXPO.a          r
    // ------ => q + ------
    // EXPO.b        EXPO.b

    const q = bignum_div(EXPO.a, EXPO.b);
    const r = bignum_mod(EXPO.a, EXPO.b);

    // process q

    if (!bignum_iszero(q)) {
        const a = bignum_pow(BASE.a, q);
        const b = bignum_int(1);

        if (isnegativenumber(EXPO))
            push_bignum(1, b, a, $); // reciprocate
        else push_bignum(1, a, b, $);
    }

    // process r

    const n0 = bignum_smallnum(BASE.a);

    if (typeof n0 === "number") {
        // BASE is 32 bits or less, hence BASE is a prime number, no root
        push(POWER, $);
        push(BASE, $);
        push_bignum(EXPO.sign, r, EXPO.b, $);
        list(3, $);
        return;
    }

    // BASE was too big to factor, try finding root

    const n1 = bignum_root(BASE.a, EXPO.b);

    if (n1 === null) {
        // no root
        push(POWER, $);
        push(BASE, $);
        push_bignum(EXPO.sign, r, EXPO.b, $);
        list(3, $);
        return;
    }

    // raise n to rth power

    const n = bignum_pow(n1, r);

    if (isnegativenumber(EXPO))
        push_bignum(1, bignum_int(1), n, $); // reciprocate
    else push_bignum(1, n, bignum_int(1), $);
}

function power_double(BASE: Num, EXPO: Num, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack) {
    const base = BASE.toNumber();
    const expo = EXPO.toNumber();

    if (base > 0 || expo === Math.floor(expo)) {
        const d = Math.pow(base, expo);
        push_double(d, $);
        return;
    }

    // BASE is negative and EXPO is fractional

    power_minusone(EXPO, env, ctrl, $);

    if (base === -1) return;

    const d = Math.pow(-base, expo);
    push_double(d, $);

    multiply(env, ctrl, $);
}
// BASE is a sum of terms

function power_sum(base: U, expo: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    // console.lg("power_sum", `${ base } `, `${ expo } `, "expanding => ", ctrl.expanding);

    if (iscomplexnumber(base) && is_num(expo)) {
        power_complex_number(base, expo, env, ctrl, $);
        return;
    }

    if (ctrl.getDirective(Directive.expanding) === 0 || !issmallinteger(expo) || (is_num(expo) && isnegativenumber(expo))) {
        $.push(items_to_cons(native_sym(Native.pow), base, expo));
        // $.push(native_sym(Native.pow));
        // $.push(base);
        // $.push(expo);
        // list(3, $);
        return;
    }

    push(expo, $);
    const n = pop_integer($);

    // square the sum first (prevents infinite loop through multiply)

    const h = $.length;

    let p1 = cdr(base);

    while (is_cons(p1)) {
        let p2 = cdr(base);
        while (is_cons(p2)) {
            push(car(p1), $);
            push(car(p2), $);
            multiply(env, ctrl, $);
            p2 = cdr(p2);
        }
        p1 = cdr(p1);
    }

    sum_terms($.length - h, env, ctrl, $);

    // continue up to power n

    for (let i = 2; i < n; i++) {
        push(base, $);
        multiply(env, ctrl, $);
    }
}

export function to_sexpr(expr: U): string {
    const outbuf: string[] = [];
    prefixform(expr, outbuf);
    return outbuf.join("");
}

/**
 * prefixform means SExpr.
 */
function prefixform(p: U, outbuf: string[]) {
    if (is_cons(p)) {
        outbuf.push("(");
        try {
            prefixform(car(p), outbuf);
            p = cdr(p);
            while (is_cons(p)) {
                outbuf.push(" ");
                prefixform(car(p), outbuf);
                p = cdr(p);
            }
        } finally {
            outbuf.push(")");
        }
    } else if (is_rat(p)) {
        if (isnegativenumber(p)) {
            outbuf.push("-");
        }
        outbuf.push(bignum_itoa(p.a));
        if (isfraction(p)) {
            outbuf.push("/" + bignum_itoa(p.b));
        }
    } else if (is_flt(p)) {
        let s = p.d.toPrecision(6);
        if (s.indexOf("E") < 0 && s.indexOf("e") < 0 && s.indexOf(".") >= 0) {
            // remove trailing zeroes
            while (s.charAt(s.length - 1) === "0") {
                s = s.substring(0, s.length - 1);
            }
            if (s.charAt(s.length - 1) === ".") {
                s += "0";
            }
        }
        outbuf.push(s);
    } else if (is_sym(p)) {
        if (MATH_PI.equalsSym(p)) {
            outbuf.push("pi");
        } else {
            outbuf.push(p.key());
        }
    } else if (is_str(p)) {
        outbuf.push(JSON.stringify(p.str));
    } else if (is_tensor(p)) {
        // FIXME
        outbuf.push("[ ]");
    } else if (is_uom(p)) {
        outbuf.push(`${p.toListString()} `);
    } else if (is_atom(p)) {
        outbuf.push(`${p} `);
    } else if (p.isnil) {
        outbuf.push(`()`);
    } else {
        outbuf.push(" ? ");
    }
}

function promote_tensor($: Pick<ProgramStack, "pop" | "push">): void {
    const p1 = pop($);

    if (!istensor(p1)) {
        push(p1, $);
        return;
    }

    const ndim1 = p1.ndim;
    const nelem1 = p1.nelem;

    // check

    let p2 = p1.elems[0];

    for (let i = 1; i < nelem1; i++) {
        const p3 = p1.elems[i];
        if (!compatible_dimensions(p2, p3)) stopf("tensor dimensions");
    }

    if (!istensor(p2)) {
        push(p1, $);
        return; // all elements are scalars
    }

    const ndim2 = p2.ndim;
    const nelem2 = p2.nelem;

    // alloc

    const p3 = alloc_tensor();

    // merge dimensions

    let k = 0;

    for (let i = 0; i < ndim1; i++) p3.dims[k++] = p1.dims[i];

    for (let i = 0; i < ndim2; i++) p3.dims[k++] = p2.dims[i];

    // merge elements

    k = 0;

    for (let i = 0; i < nelem1; i++) {
        p2 = p1.elems[i];
        for (let j = 0; j < nelem2; j++) p3.elems[k++] = (p2 as Tensor).elems[j];
    }

    push(p3, $);
}

/**
 * pushes the expression onto the stack.
 * There is no evaluation of the expression.
 */
export function push(expr: U, _: Pick<ProgramStack, "push">): void {
    _.push(expr);
}
/*
function peek(tag: string, $: ProgramStack): void {
    const expr = $.pop();
    try {
        // eslint-disable-next-line no-console
        console.lg(tag, `${expr} `);
        $.push(expr);
    }
    finally {
        expr.release();
    }
}
*/

function push_double(d: number, _: Pick<ProgramStack, "push">): void {
    const n = new Flt(d);
    try {
        _.push(n);
    } finally {
        n.release();
    }
}
/**
 * Pushes a Rat onto the stack.
 * @param n
 */
export function push_integer(n: number, $: Pick<ProgramStack, "push">): void {
    push_rational(n, 1, $);
}

export function push_native(code: Native, $: Pick<ProgramStack, "push">): void {
    const sym = native_sym(code);
    try {
        $.push(sym);
    } finally {
        sym.release();
    }
}

/**
 * Pushes a Rat onto the stack.
 * @param a
 * @param b
 */
export function push_rational(a: number, b: number, $: Pick<ProgramStack, "push">): void {
    const n = create_rat(a, b);
    try {
        push(n, $);
    } finally {
        n.release();
    }
}

export function push_string(s: string, $: ProgramStack) {
    const str = new Str(s);
    try {
        push(str, $);
    } finally {
        str.release();
    }
}

/**
 * [..., x] => [..., (pow x -1)]
 */
function reciprocate(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    //                              [..., x]
    push_integer(-1, $); //  [..., x, -1]
    power(env, ctrl, $); //  [..., (pow x -1)]
}

function reduce_radical_double(h: number, COEFF: Flt, $: ProgramStack): Flt {
    let c = COEFF.d;

    let n = $.length;

    for (let i = h; i < n; i++) {
        const p1 = $.getAt(i);

        if (isradical(p1)) {
            push(cadr(p1), $); // base
            const a = pop_double($);

            push(caddr(p1), $); // exponent
            const b = pop_double($);

            c = c * Math.pow(a, b); // a > 0 by isradical above

            $.splice(i, 1); // remove factor

            i--; // use same index again
            n--;
        }
    }

    push_double(c, $);
    const C = pop($) as Flt;

    return C;
}

function reduce_radical_factors(h: number, COEFF: Num, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): Num {
    if (!any_radical_factors(h, $)) return COEFF;

    if (is_rat(COEFF)) return reduce_radical_rational(h, COEFF, env, ctrl, $);
    else return reduce_radical_double(h, COEFF, $);
}

function reduce_radical_rational(h: number, COEFF: Rat, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): Rat {
    if (isplusone(COEFF) || isminusone(COEFF)) return COEFF; // COEFF has no factors, no cancellation is possible

    push(COEFF, $);
    absfunc(env, ctrl, $);
    let p1 = pop($);

    push(p1, $);
    numerator(env, ctrl, $);
    let NUMER = pop($);

    push(p1, $);
    denominator(env, ctrl, $);
    let DENOM = pop($);

    let k = 0;

    const n = $.length;

    for (let i = h; i < n; i++) {
        p1 = $.getAt(i);
        if (!isradical(p1)) continue;
        const BASE = cadr(p1);
        const EXPO = caddr(p1);
        if (is_num(EXPO) && isnegativenumber(EXPO)) {
            mod_integers(NUMER as Rat, BASE as Rat, $);
            const p2 = pop($);
            if (iszero(p2, env)) {
                push(NUMER, $);
                push(BASE, $);
                divide(env, ctrl, $);
                NUMER = pop($);
                push(POWER, $);
                push(BASE, $);
                push_integer(1, $);
                push(EXPO, $);
                add(env, ctrl, $);
                list(3, $);
                $.setAt(i, pop($));
                k++;
            }
        } else {
            mod_integers(DENOM as Rat, BASE as Rat, $);
            const p2 = pop($);
            if (iszero(p2, env)) {
                push(DENOM, $);
                push(BASE, $);
                divide(env, ctrl, $);
                DENOM = pop($);
                push(POWER, $);
                push(BASE, $);
                push_integer(-1, $);
                push(EXPO, $);
                add(env, ctrl, $);
                list(3, $);
                $.setAt(i, pop($));
                k++;
            }
        }
    }

    if (k) {
        push(NUMER, $);
        push(DENOM, $);
        divide(env, ctrl, $);
        if (isnegativenumber(COEFF)) negate(env, ctrl, $);
        COEFF = pop($) as Rat;
    }

    return COEFF;
}

/**
 * TODO: Why do we have this global frame:
 */
const frame: StackU = new StackU();

export function save_symbol(name: Sym, env: ProgramEnv): void {
    const binding = get_binding(name, nil, env);
    const userfunc = get_userfunc(name, env);
    try {
        frame.push(name);
        frame.push(binding);
        frame.push(userfunc);
    } finally {
        binding.release();
        userfunc.release();
    }
}

export function restore_symbol(env: ProgramEnv): void {
    const userfunc = frame.pop();
    const binding = frame.pop();
    const name = assert_sym(frame.pop());
    try {
        set_symbol(name, binding, userfunc, env);
    } finally {
        userfunc.release();
        binding.release();
        name.release();
    }
}

export interface ScriptContentHandler {
    begin($: ProgramStack): void;
    output(value: U, input: U, $: ProgramStack): void;
    end($: ProgramStack): void;
}
export interface ScriptErrorHandler {
    error(inbuf: string, start: number, end: number, err: unknown, io: ProgramIO): void;
}

export class PrintScriptErrorHandler implements ScriptErrorHandler {
    error(inbuf: string, start: number, end: number, err: unknown, io: ProgramIO): void {
        const s = html_escape_and_colorize(inbuf.substring(start, end) + "\nStop: " + err, ColorCode.RED);
        broadcast(s, io);
    }
}

const T_INTEGER = 1001;
const T_DOUBLE = 1002;
const T_SYMBOL = 1003;
const T_FUNCTION = 1004;
const T_NEWLINE = 1005;
const T_STRING = 1006;
const T_GTEQ = 1007;
const T_LTEQ = 1008;
const T_EQ = 1009;
const T_EXPONENTIATION = 1010;
const T_END = 1011;

/**
 *
 */
let scanning_integrals: boolean = false;
let instring: string;
let scan_index: number;
let scan_level: number;
let token: number | string;
let token_index: number;
let token_buf: string;

function scan(s: string, k: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, io: ProgramIO, config: EigenmathParseConfig) {
    scanning_integrals = false;
    return scan_nib(s, k, env, ctrl, $, io, config);
}

class IntegralsProgramIO implements ProgramIO {
    get trace2(): number {
        throw new Error("Method not implemented.");
    }
    set trace2(trace2: number) {
        throw new Error("Method not implemented.");
    }
    get inbuf(): string {
        throw new Error("inbuf property not implemented.");
    }
    get listeners(): ExprEngineListener[] {
        throw new Error("listeners propertynot implemented.");
    }
    get trace1(): number {
        throw new Error("trace1 property not implemented.");
    }
}

/**
 * This is only used for searching in tables. We don't expect an error. Therefore, no need for ProgramIO.
 * @param s
 * @param $
 * @param config
 */
function scan_integrals(s: string, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, config: EigenmathParseConfig): number {
    const io = new IntegralsProgramIO();
    scanning_integrals = true;
    return scan_nib(s, 0, env, ctrl, $, io, config);
}

function scan_nib(s: string, k: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, io: ProgramIO, config: EigenmathParseConfig): number {
    instring = s;
    scan_index = k;
    scan_level = 0;

    get_token_skip_newlines(io, config);

    if (token === T_END) return 0;

    scan_stmt(env, ctrl, $, io, config);

    if (token !== T_NEWLINE && token !== T_END) {
        scan_error("expected newline", io);
    }

    return scan_index;
}

function scan_stmt(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, io: ProgramIO, config: EigenmathParseConfig) {
    scan_relational_expr(env, ctrl, $, io, config);
    if (token === "=") {
        get_token_skip_newlines(io, config); // get token after =
        push(ASSIGN, $);
        swap($);
        scan_relational_expr(env, ctrl, $, io, config);
        list(3, $);
    }
}

/**
 *
 */
function scan_relational_expr(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, io: ProgramIO, config: EigenmathParseConfig): void {
    scan_additive_expr(env, ctrl, $, io, config);
    switch (token) {
        case T_EQ:
            push(TESTEQ, $);
            break;
        case T_LTEQ:
            push(TESTLE, $);
            break;
        case T_GTEQ:
            push(TESTGE, $);
            break;
        case "<":
            push(TESTLT, $);
            break;
        case ">":
            push(TESTGT, $);
            break;
        default:
            return;
    }
    swap($);
    get_token_skip_newlines(io, config); // get token after rel op
    scan_additive_expr(env, ctrl, $, io, config);
    list(3, $);
}

function scan_additive_expr(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, io: ProgramIO, config: EigenmathParseConfig): void {
    const h = $.length;
    let t = token;
    if (token === "+" || token === "-") get_token_skip_newlines(io, config);
    scan_multiplicative_expr(env, ctrl, $, io, config);
    if (t === "-") static_negate(env, ctrl, $);
    while (token === "+" || token === "-") {
        t = token;
        get_token_skip_newlines(io, config); // get token after + or -
        scan_multiplicative_expr(env, ctrl, $, io, config);
        if (t === "-") static_negate(env, ctrl, $);
    }
    if ($.length - h > 1) {
        list($.length - h, $);
        push(ADD, $);
        swap($);
        cons($);
    }
}

function scan_multiplicative_expr(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, io: ProgramIO, config: EigenmathParseConfig): void {
    const h = $.length;

    scan_power(env, ctrl, $, io, config);

    while (is_multiplicative_operator_or_factor_pending(config)) {
        const t = token;

        if (token === "*" || token === "/") {
            get_token_skip_newlines(io, config);
        }

        scan_power(env, ctrl, $, io, config);

        if (t === "/") {
            static_reciprocate(env, ctrl, $);
        }
    }

    if ($.length - h > 1) {
        list($.length - h, $);
        push(MULTIPLY, $);
        swap($);
        cons($);
    }
}

/**
 * '*' | '/' | Sym | Function | Integer | Double | String | '[' | '('
 */
function is_multiplicative_operator_or_factor_pending(config: EigenmathParseConfig): boolean {
    if (config.useParenForTensors) {
        if (token === "(") {
            return true;
        }
    } else {
        if (token === "[") {
            return true;
        }
    }
    switch (token) {
        case "*":
        case "/":
        case T_SYMBOL:
        case T_FUNCTION:
        case T_INTEGER:
        case T_DOUBLE:
        case T_STRING:
            return true;
        default:
            break;
    }
    return false;
}

function scan_power(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, io: ProgramIO, config: EigenmathParseConfig) {
    scan_factor(env, ctrl, $, io, config);

    if (config.useCaretForExponentiation) {
        if (token === "^") {
            get_token_skip_newlines(io, config);
            push(POWER, $);
            swap($);
            scan_power(env, ctrl, $, io, config);
            list(3, $);
        }
    } else {
        if (token === T_EXPONENTIATION) {
            get_token_skip_newlines(io, config);
            push(POWER, $);
            swap($);
            scan_power(env, ctrl, $, io, config);
            list(3, $);
        }
    }
}

function scan_factor(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, io: ProgramIO, config: EigenmathParseConfig): void {
    const h = $.length;

    switch (token) {
        // We should really be checking config.useParenForTensors here
        case "(":
        case "[":
            scan_subexpr(env, ctrl, $, io, config);
            break;

        case T_SYMBOL:
            scan_symbol(env, $, io, config);
            break;

        case T_FUNCTION:
            scan_function_call(env, ctrl, $, io, config);
            break;

        case T_INTEGER: {
            const a = bignum_atoi(token_buf);
            const b = bignum_int(1);
            push_bignum(1, a, b, $);
            get_token(io, config);
            break;
        }
        case T_DOUBLE: {
            const d = parseFloat(token_buf);
            push_double(d, $);
            get_token(io, config);
            break;
        }
        case T_STRING:
            scan_string($, io, config);
            break;

        default:
            scan_error("expected operand", io);
    }

    // index

    if ((token as string) === "[") {
        scan_level++;

        get_token(io, config); // get token after [
        push(INDEX, $);
        swap($);

        scan_additive_expr(env, ctrl, $, io, config);

        while ((token as string) === ",") {
            get_token(io, config); // get token after ,
            scan_additive_expr(env, ctrl, $, io, config);
        }

        if ((token as string) !== "]") scan_error("expected ]", io);

        scan_level--;

        get_token(io, config); // get token after ]

        list($.length - h, $);
    }

    while ((token as string) === "!") {
        get_token(io, config); // get token after !
        push(FACTORIAL, $);
        swap($);
        list(2, $);
    }
}

/**
 * See InputState.tokenToSym
 */
function scan_symbol(env: ProgramEnv, $: ProgramStack, io: ProgramIO, config: EigenmathParseConfig): void {
    if (scanning_integrals && token_buf.length === 1) {
        // When scanning inegrals, we don't make user symbols out of the special variables, a, b, and x.
        switch (token_buf[0]) {
            case "a":
                push(DOLLAR_A, $);
                break;
            case "b":
                push(DOLLAR_B, $);
                break;
            case "x":
                push(DOLLAR_X, $);
                break;
            default:
                push(lookup(create_sym(token_buf), env), $);
                break;
        }
    } else {
        push(lookup(create_sym(token_buf), env), $);
    }
    get_token(io, config);
}

function scan_string($: ProgramStack, io: ProgramIO, config: EigenmathParseConfig): void {
    push_string(token_buf, $);
    get_token(io, config);
}

function scan_function_call(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, io: ProgramIO, config: EigenmathParseConfig): void {
    const h = $.length;
    scan_level++;
    push(lookup(create_sym(token_buf), env), $); // push function name
    get_token(io, config); // get token after function name
    get_token(io, config); // get token after (
    if (token === ")") {
        scan_level--;
        get_token(io, config); // get token after )
        list(1, $); // function call with no args
        return;
    }
    scan_stmt(env, ctrl, $, io, config);
    while (token === ",") {
        get_token(io, config); // get token after ,
        scan_stmt(env, ctrl, $, io, config);
    }
    if (token !== ")") scan_error("expected )", io);
    scan_level--;
    get_token(io, config); // get token after )
    list($.length - h, $);
}

function get_matching_token(lhs: string | number): string {
    if (lhs === "(") {
        return ")";
    } else if (lhs === "[") {
        return "]";
    }
    throw new Error(`get_matching_token ${lhs} `);
}

function scan_subexpr(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, io: ProgramIO, config: EigenmathParseConfig): void {
    const h = $.length;

    scan_level++;

    const lhs = token;
    const rhs = get_matching_token(lhs);
    get_token(io, config); // get token after "(" or "["

    scan_stmt(env, ctrl, $, io, config);

    while (token === ",") {
        get_token(io, config); // get token after ,
        scan_stmt(env, ctrl, $, io, config);
    }

    if (config.useParenForTensors) {
        if (token === rhs) {
            // Fall through.
        } else if (token !== ")") {
            scan_error("expected )", io);
        }
    } else {
        if (token === rhs) {
            // Fall through.
        } else if (token !== "]") {
            scan_error("expected ]", io);
        }
    }

    scan_level--;

    get_token(io, config); // get token after ")" or "]""

    if ($.length - h > 1) {
        vector(h, $);
    }
}

function get_token_skip_newlines(io: ProgramIO, config: EigenmathParseConfig): void {
    scan_level++;
    get_token(io, config);
    scan_level--;
}

function get_token(io: ProgramIO, config: EigenmathParseConfig): void {
    get_token_nib(io, config);

    if (scan_level) while (token === T_NEWLINE) get_token_nib(io, config); // skip over newlines
}

export interface EigenmathParseConfig {
    useCaretForExponentiation: boolean;
    useParenForTensors: boolean;
}

function get_token_nib(io: ProgramIO, config: EigenmathParseConfig): void {
    let c: string;

    // skip spaces

    for (;;) {
        c = inchar();
        if (c === "" || c === "\n" || c === "\r" || (c.charCodeAt(0) > 32 && c.charCodeAt(0) < 127)) break;
        scan_index++;
    }

    token_index = scan_index;

    // end of input?

    if (c === "") {
        token = T_END;
        return;
    }

    scan_index++;

    // newline?

    if (c === "\n" || c === "\r") {
        token = T_NEWLINE;
        return;
    }

    // comment?

    if (c === "#" || (c === "-" && inchar() === "-")) {
        while (inchar() !== "" && inchar() !== "\n") scan_index++;

        if (inchar() === "\n") {
            scan_index++;
            token = T_NEWLINE;
        } else {
            token = T_END;
        }

        return;
    }

    // number?

    if (isdigit(c) || c === ".") {
        while (isdigit(inchar())) scan_index++;

        if (inchar() === ".") {
            scan_index++;

            while (isdigit(inchar())) scan_index++;

            if (scan_index - token_index === 1) scan_error("expected decimal digit", io); // only a decimal point

            token = T_DOUBLE;
        } else {
            token = T_INTEGER;
        }

        update_token_buf(token_index, scan_index);

        return;
    }

    // symbol or function call?

    if (isalpha(c)) {
        while (isalnum(inchar())) scan_index++;

        if (inchar() === "(") token = T_FUNCTION;
        else token = T_SYMBOL;

        update_token_buf(token_index, scan_index);

        return;
    }

    // string ?

    if (c === '"') {
        while (inchar() !== "" && inchar() !== "\n" && inchar() !== '"') scan_index++;
        if (inchar() !== '"') {
            token_index = scan_index; // no token
            scan_error("runaway string", io);
        }
        scan_index++;
        token = T_STRING;
        update_token_buf(token_index + 1, scan_index - 1); // don't include quote chars
        return;
    }

    // relational operator?

    if (c === "=" && inchar() === "=") {
        scan_index++;
        token = T_EQ;
        return;
    }

    if (c === "<" && inchar() === "=") {
        scan_index++;
        token = T_LTEQ;
        return;
    }

    if (c === ">" && inchar() === "=") {
        scan_index++;
        token = T_GTEQ;
        return;
    }

    // exponentiation
    if (config.useCaretForExponentiation) {
        // Do nothing
    } else {
        // We're using the ** exponentiation operator syntax.
        if (c === "*" && inchar() === "*") {
            scan_index++;
            token = T_EXPONENTIATION;
            return;
        }
    }

    // single char token

    token = c;
}

function update_token_buf(j: number, k: number): void {
    token_buf = instring.substring(j, k);
}

function scan_error(s: string, io: ProgramIO): never {
    let t = io.inbuf.substring(io.trace1, scan_index);

    t += "\nStop: Syntax error, " + s;

    if (token_index < scan_index) {
        t += " instead of ";
        t += instring.substring(token_index, scan_index);
    }

    const escaped = html_escape_and_colorize(t, ColorCode.RED);

    broadcast(escaped, io);

    stopf(`scan_error ${s} `);
}

function inchar(): string {
    return instring.charAt(scan_index); // returns empty string if index out of range
}

export function scan_inbuf(k: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, io: ProgramIO, config: EigenmathParseConfig): number {
    io.trace1 = k;
    k = scan(io.inbuf, k, env, ctrl, $, io, config);
    if (k) {
        io.trace2 = k;
        trace_source_text(env, io);
    }
    return k;
}

export function set_symbol(name: Sym, binding: U, userfunc: U, env: ProgramEnv): void {
    /*
    if (!env.hasUserFunction(name)) {
        stopf("symbol error");
    }
    */
    env.setBinding(name, binding);
    env.setUserFunction(name, userfunc);
}

export function set_binding(sym: Sym, binding: U, env: ProgramEnv): void {
    if (!env.hasUserFunction(sym)) {
        stopf("symbol error");
    }
    env.setBinding(sym, binding);
}
export function set_user_function(name: Sym, userfunc: U, env: ProgramEnv): void {
    if (!env.hasUserFunction(name)) {
        stopf("symbol error");
    }
    env.setUserFunction(name, userfunc);
}

/**
 *
 * @param n
 * @param $
 */
function sort(n: number, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    // console.lg("sort", n);
    const compareFn = (lhs: U, rhs: U) => cmp(lhs, rhs);

    const candidates = $.splice($.length - n);

    const context = new ExprContextFromProgram(env, ctrl);
    try {
        const zs = candidates.map(item_to_complex(context));

        for (let i = 0; i < candidates.length; i++) {
            candidates[i].release();
        }

        zs.sort(complex_comparator(compareFn));

        const sorted: U[] = zs.map(complex_to_item(context));

        for (let i = 0; i < zs.length; i++) {
            zs[i].release();
        }

        $.concat(sorted);

        for (let i = 0; i < sorted.length; i++) {
            sorted[i].release();
        }
    } finally {
        context.release();
    }
}

function sort_factors(start: number, ctrl: ProgramControl, $: ProgramStack): void {
    const compareFn = ctrl.compareFn(native_sym(Native.multiply));
    const parts = $.splice(start);
    const t = parts.sort(compareFn);
    $.concat(t);
}

function sort_factors_provisional(start: number, $: ProgramStack): void {
    const compareFn = (lhs: U, rhs: U) => cmp_factors_provisional(lhs, rhs);
    const parts = $.splice(start);
    const t = parts.sort(compareFn);
    $.concat(t);
}

function static_negate(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p1 = pop($);

    if (is_num(p1)) {
        push(p1, $);
        negate(env, ctrl, $);
        return;
    }

    if (car(p1).equals(MULTIPLY)) {
        push(MULTIPLY, $);
        if (is_num(cadr(p1))) {
            push(cadr(p1), $);
            negate(env, ctrl, $);
            push(cddr(p1), $);
        } else {
            push_integer(-1, $);
            push(cdr(p1), $);
        }
        cons($);
        cons($);
        return;
    }

    push(MULTIPLY, $);
    push_integer(-1, $);
    push(p1, $);
    list(3, $);
}

function static_reciprocate(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const p2 = pop($);
    const p1 = pop($);

    if (iszero(p2, env)) {
        if (!(is_rat(p1) && isinteger1(p1))) {
            push(p1, $);
        }
        push(POWER, $);
        push(p2, $);
        push_integer(-1, $);
        list(3, $);
        return;
    }

    if (is_num(p1) && is_num(p2)) {
        push(p1, $);
        push(p2, $);
        divide(env, ctrl, $);
        return;
    }

    if (is_num(p2)) {
        if (!(is_rat(p1) && isinteger1(p1))) push(p1, $);
        push(p2, $);
        reciprocate(env, ctrl, $);
        return;
    }

    if (car(p2).equals(POWER) && is_num(caddr(p2))) {
        if (!(is_rat(p1) && isinteger1(p1))) push(p1, $);
        push(POWER, $);
        push(cadr(p2), $);
        push(caddr(p2), $);
        negate(env, ctrl, $);
        list(3, $);
        return;
    }

    if (!(is_rat(p1) && isinteger1(p1))) push(p1, $);

    push(POWER, $);
    push(p2, $);
    push_integer(-1, $);
    list(3, $);
}

export function stopf(errmsg: string): never {
    throw new Error(errmsg);
}

/**
 * [..., x, y] => [..., (+ x (* -1 y))]
 */
export function subtract(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    negate(env, ctrl, $); //  [..., x, (* -1 y)]
    sum_terms(2, env, ctrl, $); //  [..., (+ x (* -1 y))]
}

/**
 * ( x y => y x )
 */
export function swap($: ProgramStack): void {
    const p2 = pop($);
    const p1 = pop($);
    try {
        push(p2, $);
        push(p1, $);
    } finally {
        p1.release();
        p2.release();
    }
}

function trace_source_text(env: ProgramEnv, io: ProgramIO): void {
    const binding = get_binding(TRACE, nil, env);
    try {
        if (!binding.equals(TRACE) && !iszero(binding, env)) {
            const escaped = html_escape_and_colorize(instring.substring(io.trace1, io.trace2), ColorCode.BLUE);
            broadcast(escaped, io);
        }
    } finally {
        binding.release();
    }
}

/**
 * Sends the `text` to all output listeners.
 */
export function broadcast(text: string, io: Pick<ProgramIO, "listeners">): void {
    for (const listener of io.listeners) {
        listener.output(text);
    }
}

const zero: Rat = create_int(0);
const one: Rat = create_int(1);
const minusone: Rat = create_int(-1);

export function make_lambda_expr_from_stack_function(sym: Sym, stackFunction: StackFunction): LambdaExpr {
    return function (argList: Cons, ctxt: ExprContext): U {
        const $ = new StackU();
        stackFunction(create_cons(sym, argList), ctxt, ctxt, $);
        return $.pop();
    };
}

export interface UserFunction {
    (x: Sym, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void;
}

function vector(h: number, $: ProgramStack): void {
    const n = $.length - h;
    const v = new Tensor([n], $.splice(h, n));
    push(v, $);
}
