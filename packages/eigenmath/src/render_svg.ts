import { Blade, Boo, create_flt, create_sym, Flt, Imu, is_blade, is_boo, is_flt, is_imu, is_num, is_rat, is_str, is_sym, is_tensor, is_uom, Num, Rat, Str, Sym, Tensor, Uom } from "@stemcmicro/atoms";
import { ExprContext, ExprHandler } from "@stemcmicro/context";
import { str_to_string } from "@stemcmicro/helpers";
import { is_native, Native, native_sym } from "@stemcmicro/native";
import { ProgramStack, StackU } from "@stemcmicro/stack";
import { assert_cons, assert_cons_or_nil, Atom, cadddr, caddr, cadr, car, cddr, cdnr, cdr, Cons, cons as create_cons, is_atom, is_cons, is_nil, nil, U } from "@stemcmicro/tree";
import { bignum_itoa } from "./bignum_itoa";
import { count_denominators } from "./count_denominators";
import { find_denominator } from "./find_denominator";
import { fmtnum } from "./fmtnum";
import { isdenominator } from "./isdenominator";
import { isdigit } from "./isdigit";
import { isfraction } from "./isfraction";
import { isminusone } from "./isminusone";
import { isnegativeterm } from "./isnegativeterm";
import { isnumerator } from "./isnumerator";
import { printname_from_symbol } from "./printname_from_symbol";

const ADD = native_sym(Native.add);
const ASSIGN = native_sym(Native.assign);
const DERIVATIVE = native_sym(Native.derivative);
const FACTORIAL = native_sym(Native.factorial);
const INDEX = native_sym(Native.component);
const MULTIPLY = native_sym(Native.multiply);
const POWER = native_sym(Native.pow);
const TESTEQ = native_sym(Native.testeq);
const TESTGE = native_sym(Native.testge);
const TESTGT = native_sym(Native.testgt);
const TESTLE = native_sym(Native.testle);
const TESTLT = native_sym(Native.testlt);
const MATH_E = native_sym(Native.E);

const HPAD = 10;
const VPAD = 10;

const TABLE_HSPACE = 12;
const TABLE_VSPACE = 10;

const DELIM_STROKE = 0.09;
const FRAC_STROKE = 0.07;

const LEFT_PAREN = 40;
const RIGHT_PAREN = 41;
const LESS_SIGN = 60;
const EQUALS_SIGN = 61;
const GREATER_SIGN = 62;
const LOWER_F = 102;
const LOWER_N = 110;

const PLUS_SIGN = 177;
const MINUS_SIGN = 178;
const MULTIPLY_SIGN = 179;
const GREATEREQUAL = 180;
const LESSEQUAL = 181;

const EMIT_SPACE = 1;
const EMIT_CHAR = 2;
const EMIT_LIST = 3;
const EMIT_SUPERSCRIPT = 4;
const EMIT_SUBSCRIPT = 5;
const EMIT_SUBEXPR = 6;
const EMIT_SMALL_SUBEXPR = 7;
const EMIT_FRACTION = 8;
const EMIT_SMALL_FRACTION = 9;
const EMIT_TABLE = 10;

const FONT_SIZE = 24;
const SMALL_FONT_SIZE = 18;

const FONT_CAP_HEIGHT = 1356;
const FONT_DESCENT = 443;
const FONT_XHEIGHT = 916;

const ROMAN_FONT = 1;
const ITALIC_FONT = 2;
const SMALL_ROMAN_FONT = 3;
const SMALL_ITALIC_FONT = 4;

function list(n: number, $: ProgramStack): void {
    $.push(nil);
    for (let i = 0; i < n; i++) {
        cons($);
    }
}

function cons($: ProgramStack): void {
    const pop1 = assert_cons_or_nil($.pop());
    const pop2 = $.pop();
    $.push(create_cons(pop2, pop1));
}

function get_cap_height(font_num: number): number {
    switch (font_num) {
        case ROMAN_FONT:
        case ITALIC_FONT:
            return (FONT_CAP_HEIGHT * FONT_SIZE) / 2048;
        case SMALL_ROMAN_FONT:
        case SMALL_ITALIC_FONT:
            return (FONT_CAP_HEIGHT * SMALL_FONT_SIZE) / 2048;
        default:
            throw new Error();
    }
}

function get_descent(font_num: number): number {
    switch (font_num) {
        case ROMAN_FONT:
        case ITALIC_FONT:
            return (FONT_DESCENT * FONT_SIZE) / 2048;
        case SMALL_ROMAN_FONT:
        case SMALL_ITALIC_FONT:
            return (FONT_DESCENT * SMALL_FONT_SIZE) / 2048;
        default:
            throw new Error();
    }
}

const roman_descent_tab = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,

    //	  ! " # $ % & ' ( ) * + , - . / 0 1 2 3 4 5 6 7 8 9 : ; < = > ?
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,

    //	@ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [   ] ^ _
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    0,
    1,

    //	` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    1,
    1,
    0,
    0,

    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0, // upper case greek
    0,
    1,
    1,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    0,
    1,
    1,
    1,
    0, // lower case greek

    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
];

const italic_descent_tab = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,

    //	  ! " # $ % & ' ( ) * + , - . / 0 1 2 3 4 5 6 7 8 9 : ; < = > ?
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,

    //	@ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [   ] ^ _
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    0,
    1,

    //	` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    1,
    1,
    0,
    0,

    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0, // upper case greek
    0,
    1,
    1,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    0,
    1,
    1,
    1,
    0, // lower case greek

    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
];

function get_char_depth(font_num: number, char_num: number) {
    switch (font_num) {
        case ROMAN_FONT:
        case SMALL_ROMAN_FONT:
            return get_descent(font_num) * roman_descent_tab[char_num];
        case ITALIC_FONT:
        case SMALL_ITALIC_FONT:
            return get_descent(font_num) * italic_descent_tab[char_num];
        default:
            throw new Error();
    }
}

const roman_width_tab = [
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,

    512,
    682,
    836,
    1024,
    1024,
    1706,
    1593,
    369, // printable ascii
    682,
    682,
    1024,
    1155,
    512,
    682,
    512,
    569,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    569,
    569,
    1155,
    1155,
    1155,
    909,
    1886,
    1479,
    1366,
    1366,
    1479,
    1251,
    1139,
    1479,
    1479,
    682,
    797,
    1479,
    1251,
    1821,
    1479,
    1479,
    1139,
    1479,
    1366,
    1139,
    1251,
    1479,
    1479,
    1933,
    1479,
    1479,
    1251,
    682,
    569,
    682,
    961,
    1024,
    682,
    909,
    1024,
    909,
    1024,
    909,
    682,
    1024,
    1024,
    569,
    569,
    1024,
    569,
    1593,
    1024,
    1024,
    1024,
    1024,
    682,
    797,
    569,
    1024,
    1024,
    1479,
    1024,
    1024,
    909,
    983,
    410,
    983,
    1108,
    1593,

    1479,
    1366,
    1184,
    1253,
    1251,
    1251,
    1479,
    1479, // upper case greek
    682,
    1479,
    1485,
    1821,
    1479,
    1317,
    1479,
    1479,
    1139,
    1192,
    1251,
    1479,
    1497,
    1479,
    1511,
    1522,

    1073,
    1042,
    905,
    965,
    860,
    848,
    1071,
    981, // lower case greek
    551,
    1032,
    993,
    1098,
    926,
    913,
    1024,
    1034,
    1022,
    1104,
    823,
    1014,
    1182,
    909,
    1282,
    1348,

    1024,
    1155,
    1155,
    1155,
    1124,
    1124,
    1012,
    909, // other symbols

    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909,
    909
];

const italic_width_tab = [
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,

    512,
    682,
    860,
    1024,
    1024,
    1706,
    1593,
    438, // printable ascii
    682,
    682,
    1024,
    1382,
    512,
    682,
    512,
    569,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    682,
    682,
    1382,
    1382,
    1382,
    1024,
    1884,
    1251,
    1251,
    1366,
    1479,
    1251,
    1251,
    1479,
    1479,
    682,
    909,
    1366,
    1139,
    1706,
    1366,
    1479,
    1251,
    1479,
    1251,
    1024,
    1139,
    1479,
    1251,
    1706,
    1251,
    1139,
    1139,
    797,
    569,
    797,
    864,
    1024,
    682,
    1024,
    1024,
    909,
    1024,
    909,
    569,
    1024,
    1024,
    569,
    569,
    909,
    569,
    1479,
    1024,
    1024,
    1024,
    1024,
    797,
    797,
    569,
    1024,
    909,
    1366,
    909,
    909,
    797,
    819,
    563,
    819,
    1108,
    1593,

    1251,
    1251,
    1165,
    1253,
    1251,
    1139,
    1479,
    1479, // upper case greek
    682,
    1366,
    1237,
    1706,
    1366,
    1309,
    1479,
    1479,
    1251,
    1217,
    1139,
    1139,
    1559,
    1251,
    1440,
    1481,

    1075,
    1020,
    807,
    952,
    807,
    829,
    1016,
    1006, // lower case greek
    569,
    983,
    887,
    1028,
    909,
    877,
    1024,
    1026,
    983,
    1010,
    733,
    940,
    1133,
    901,
    1272,
    1446,

    1024,
    1382,
    1382,
    1382,
    1124,
    1124,
    1012,
    1024, // other symbols

    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024,
    1024
];

function get_char_width(font_num: number, char_num: number): number {
    switch (font_num) {
        case ROMAN_FONT:
            return (FONT_SIZE * roman_width_tab[char_num]) / 2048;
        case ITALIC_FONT:
            return (FONT_SIZE * italic_width_tab[char_num]) / 2048;
        case SMALL_ROMAN_FONT:
            return (SMALL_FONT_SIZE * roman_width_tab[char_num]) / 2048;
        case SMALL_ITALIC_FONT:
            return (SMALL_FONT_SIZE * italic_width_tab[char_num]) / 2048;
        default:
            throw new Error();
    }
}

function get_xheight(font_num: number): number {
    switch (font_num) {
        case ROMAN_FONT:
        case ITALIC_FONT:
            return (FONT_XHEIGHT * FONT_SIZE) / 2048;
        case SMALL_ROMAN_FONT:
        case SMALL_ITALIC_FONT:
            return (FONT_XHEIGHT * SMALL_FONT_SIZE) / 2048;
        default:
            throw new Error();
    }
}

function get_operator_height(font_num: number): number {
    return get_cap_height(font_num) / 2;
}

let emit_level: number;

export function set_emit_small_font(): void {
    emit_level = 1;
}

class SvgProgramStack implements ProgramStack {
    readonly #stack = new StackU();
    #refCount = 1;
    constructor() {
        // Nothing to see here.
    }
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            this.#stack.release();
        }
    }
    get isatom(): boolean {
        return this.#stack.isatom;
    }
    get iscons(): boolean {
        return this.#stack.iscons;
    }
    get istrue(): boolean {
        return this.#stack.istrue;
    }
    dupl(): void {
        this.#stack.dupl();
    }
    head(): void {
        this.#stack.head();
    }
    rest(): void {
        this.#stack.rest();
    }
    rotateL(n: number): void {
        this.#stack.rotateL(n);
    }
    rotateR(n: number): void {
        this.#stack.rotateR(n);
    }
    swap(): void {
        this.#stack.swap();
    }
    get frameLength(): number {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    frameSplice(start: number, deleteCount?: number): U[] {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    framePush(expr: U): void {
        throw new Error("Method not implemented.");
    }
    get length(): number {
        return this.#stack.length;
    }
    set length(length: number) {
        this.#stack.length = length;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    concat(exprs: U[]): void {
        throw new Error("concat method not implemented.");
    }
    peek(): U {
        const x = this.pop();
        this.push(x);
        return x;
    }
    push(expr: U): void {
        this.#stack.push(expr);
    }
    pop(): U {
        return this.#stack.pop();
    }
    getAt(i: number): U {
        return this.#stack.getAt(i);
    }
    setAt(i: number, expr: U): void {
        this.#stack.setAt(i, expr);
    }
    splice(start: number, deleteCount?: number): U[] {
        if (typeof deleteCount === "number") {
            return this.#stack.splice(start, deleteCount);
        } else {
            return this.#stack.splice(start);
        }
    }
    fpop(): U {
        throw new Error("fpop method not implemented.");
    }
}

export interface SvgRenderEnv extends ExprContext {
    handlerFor<T extends U>(expr: T): ExprHandler<T>;
}

export interface SvgRenderConfig {
    useImaginaryI: boolean;
    useImaginaryJ: boolean;
}

export function render_svg(expr: U, env: SvgRenderEnv, options: SvgRenderConfig): string {
    const stack = new SvgProgramStack();
    try {
        emit_level = 0;

        emit_list(expr, env, stack, options);

        const codes = stack.pop()!;

        const h0 = height(codes);
        const d0 = depth(codes);
        const w0 = width(codes);

        const x = HPAD;
        const y = Math.round(h0 + VPAD);

        const h = Math.round(h0 + d0 + 2 * VPAD);
        const w = Math.round(w0 + 2 * HPAD);

        const heq = "height='" + h + "'";
        const weq = "width='" + w + "'";

        const outbuf: string[] = [];

        outbuf.push("<svg " + heq + weq + ">");

        draw_formula(x, y, codes, outbuf);

        outbuf.push("</svg>");
        return outbuf.join("");
    } finally {
        stack.release();
    }
}

/**
 * Converts an expression into an encoded form with opcode, height, depth, width, and data (depends on opcode).
 */
export function emit_list(expr: U, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    const t = $.length;
    emit_expr(expr, env, $, ec);
    emit_update_list(t, $);
}

function emit_expr(p: U, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    if (isnegativeterm(p) || (car(p).equals(ADD) && isnegativeterm(cadr(p)))) {
        emit_roman_char(MINUS_SIGN, $);
        emit_thin_space($);
    }

    if (car(p).equals(ADD)) emit_expr_nib(p, env, $, ec);
    else emit_term(p, env, $, ec);
}

function emit_expr_nib(p: U, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    p = cdr(p);
    emit_term(car(p), env, $, ec);
    p = cdr(p);
    while (is_cons(p)) {
        if (isnegativeterm(car(p))) emit_infix_operator(MINUS_SIGN, $);
        else emit_infix_operator(PLUS_SIGN, $);
        emit_term(car(p), env, $, ec);
        p = cdr(p);
    }
}

function emit_args(p: Cons, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    p = cdr(p);

    if (!is_cons(p)) {
        emit_roman_string("(", $);
        emit_roman_string(")", $);
        return;
    }

    const t = $.length;

    emit_expr(car(p), env, $, ec);

    p = cdr(p);

    while (is_cons(p)) {
        emit_roman_string(",", $);
        emit_thin_space($);
        emit_expr(car(p), env, $, ec);
        p = cdr(p);
    }

    emit_update_list(t, $);

    emit_update_subexpr($);
}

function emit_base(p: U, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    if ((is_num(p) && p.isNegative()) || (is_rat(p) && isfraction(p)) || is_flt(p) || car(p).equals(ADD) || car(p).equals(MULTIPLY) || car(p).equals(POWER)) emit_subexpr(p, env, $, ec);
    else emit_expr(p, env, $, ec);
}

function emit_denominators(p: Cons, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig) {
    const t = $.length;
    const n = count_denominators(p);
    p = cdr(p);

    while (is_cons(p)) {
        let q = car(p);
        p = cdr(p);

        if (!isdenominator(q)) continue;

        if ($.length > t) emit_medium_space($);

        if (is_rat(q)) {
            const s = bignum_itoa(q.b);
            emit_roman_string(s, $);
            continue;
        }

        if (isminusone(caddr(q))) {
            q = cadr(q);
            if (car(q).equals(ADD) && n === 1)
                emit_expr(q, env, $, ec); // parens not needed
            else emit_factor(q, env, $, ec);
        } else {
            emit_base(cadr(q), env, $, ec);
            emit_numeric_exponent(caddr(q) as Num, $); // sign is not emitted
        }
    }

    emit_update_list(t, $);
}

function emit_double(p: Flt, $: ProgramStack): void {
    let i: number;
    let j: number;

    const s = fmtnum(p.d);

    let k = 0;

    while (k < s.length && s.charAt(k) !== "." && s.charAt(k) !== "E" && s.charAt(k) !== "e") k++;

    emit_roman_string(s.substring(0, k), $);

    // handle trailing zeroes

    if (s.charAt(k) === ".") {
        i = k++;

        while (k < s.length && s.charAt(k) !== "E" && s.charAt(k) !== "e") k++;

        j = k;

        while (s.charAt(j - 1) === "0") j--;

        if (j - i > 1) emit_roman_string(s.substring(i, j), $);
    }

    if (s.charAt(k) !== "E" && s.charAt(k) !== "e") return;

    k++;

    emit_roman_char(MULTIPLY_SIGN, $);

    emit_roman_string("10", $);

    // superscripted exponent

    emit_level++;

    const t = $.length;

    // sign of exponent

    if (s.charAt(k) === "+") k++;
    else if (s.charAt(k) === "-") {
        emit_roman_char(MINUS_SIGN, $);
        emit_thin_space($);
        k++;
    }

    // skip leading zeroes in exponent

    while (s.charAt(k) === "0") k++;

    emit_roman_string(s.substring(k), $);

    emit_update_list(t, $);

    emit_level--;

    emit_update_superscript($);
}

function emit_exponent(p: U, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    if (is_num(p) && !p.isNegative()) {
        emit_numeric_exponent(p, $); // sign is not emitted
        return;
    }

    emit_level++;
    emit_list(p, env, $, ec);
    emit_level--;

    emit_update_superscript($);
}

function emit_factor(p: U, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig) {
    if (is_rat(p)) {
        emit_rational(p, $);
        return;
    }

    if (is_flt(p)) {
        emit_double(p, $);
        return;
    }

    if (is_sym(p)) {
        emit_symbol(p, $);
        return;
    }

    if (is_str(p)) {
        emit_string(p, $);
        return;
    }

    if (is_tensor(p)) {
        emit_tensor(p, env, $, ec);
        return;
    }

    if (is_uom(p)) {
        emit_uom(p, $);
        return;
    }

    if (is_boo(p)) {
        emit_boo(p, $);
        return;
    }

    if (is_blade(p)) {
        emit_blade(p, $);
        return;
    }

    if (is_imu(p)) {
        emit_imaginary_unit(p, $, ec);
        return;
    }

    if (is_cons(p)) {
        if (car(p).equals(POWER)) {
            emit_power(p, env, $, ec);
        } else if (car(p).equals(ADD) || car(p).equals(MULTIPLY)) {
            emit_subexpr(p, env, $, ec);
        } else {
            emit_function(p, env, $, ec);
        }
        return;
    }

    if (is_nil(p)) {
        throw new Error();
    }

    if (is_atom(p)) {
        emit_atom(p, env, $);
        return;
    }
}

function emit_fraction(p: Cons, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    emit_numerators(p, env, $, ec);
    emit_denominators(p, env, $, ec);
    emit_update_fraction($);
}

function emit_function(expr: Cons, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    // d(f(x),x)

    if (car(expr).equals(DERIVATIVE)) {
        emit_roman_string("d", $);
        emit_args(expr, env, $, ec);
        return;
    }

    // n!

    if (car(expr).equals(FACTORIAL)) {
        const p = cadr(expr);
        if ((is_rat(p) && p.isPositiveInteger()) || is_sym(p)) {
            emit_expr(p, env, $, ec);
        } else {
            emit_subexpr(p, env, $, ec);
        }
        emit_roman_string("!", $);
        return;
    }

    // A[1,2]

    if (car(expr).equals(INDEX)) {
        const p = cdr(expr);
        const leading = car(p);
        if (is_sym(leading)) emit_symbol(leading, $);
        else emit_subexpr(leading, env, $, ec);
        emit_indices(p, env, $, ec);
        return;
    }

    if (is_cons(expr) && (expr.opr.equals(ASSIGN) || expr.opr.equals(TESTEQ))) {
        emit_expr(cadr(expr), env, $, ec);
        emit_infix_operator(EQUALS_SIGN, $);
        emit_expr(caddr(expr), env, $, ec);
        return;
    }

    if (car(expr).equals(TESTGE)) {
        emit_expr(cadr(expr), env, $, ec);
        emit_infix_operator(GREATEREQUAL, $);
        emit_expr(caddr(expr), env, $, ec);
        return;
    }

    if (car(expr).equals(TESTGT)) {
        emit_expr(cadr(expr), env, $, ec);
        emit_infix_operator(GREATER_SIGN, $);
        emit_expr(caddr(expr), env, $, ec);
        return;
    }

    if (car(expr).equals(TESTLE)) {
        emit_expr(cadr(expr), env, $, ec);
        emit_infix_operator(LESSEQUAL, $);
        emit_expr(caddr(expr), env, $, ec);
        return;
    }

    if (car(expr).equals(TESTLT)) {
        emit_expr(cadr(expr), env, $, ec);
        emit_infix_operator(LESS_SIGN, $);
        emit_expr(caddr(expr), env, $, ec);
        return;
    }

    // default

    const leading = car(expr);
    if (is_sym(leading)) emit_symbol(leading, $);
    else emit_subexpr(leading, env, $, ec);

    emit_args(expr, env, $, ec);
}

function emit_indices(p: U, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    emit_roman_string("[", $);

    p = cdr(p);

    if (is_cons(p)) {
        emit_expr(car(p), env, $, ec);
        p = cdr(p);
        while (is_cons(p)) {
            emit_roman_string(",", $);
            emit_thin_space($);
            emit_expr(car(p), env, $, ec);
            p = cdr(p);
        }
    }

    emit_roman_string("]", $);
}

function emit_infix_operator(char_num: number, $: ProgramStack): void {
    emit_thick_space($);
    emit_roman_char(char_num, $);
    emit_thick_space($);
}

function emit_italic_char(char_num: number, $: ProgramStack): void {
    let font_num: number;

    if (emit_level === 0) font_num = ITALIC_FONT;
    else font_num = SMALL_ITALIC_FONT;

    const h = get_cap_height(font_num);
    const d = get_char_depth(font_num, char_num);
    const w = get_char_width(font_num, char_num);

    $.push(create_flt(EMIT_CHAR));
    $.push(create_flt(h));
    $.push(create_flt(d));
    $.push(create_flt(w));
    $.push(create_flt(font_num));
    $.push(create_flt(char_num));

    list(6, $);

    if (char_num === LOWER_F) emit_thin_space($);
}

function emit_italic_string(s: "i" | "j", $: ProgramStack): void {
    for (let i = 0; i < s.length; i++) emit_italic_char(s.charCodeAt(i), $);
}

function emit_matrix(p: Tensor, d: number, k: number, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    if (d === p.ndim) {
        emit_list(p.elems[k], env, $, ec);
        return;
    }

    // compute element span

    let span = 1;

    let n = p.ndim;

    for (let i = d + 2; i < n; i++) span *= p.dims[i];

    n = p.dims[d]; // number of rows
    const m = p.dims[d + 1]; // number of columns

    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) emit_matrix(p, d + 2, k + (i * m + j) * span, env, $, ec);

    emit_update_table(n, m, $);
}

function emit_medium_space($: ProgramStack): void {
    let w: number;

    if (emit_level === 0) w = 0.5 * get_char_width(ROMAN_FONT, LOWER_N);
    else w = 0.5 * get_char_width(SMALL_ROMAN_FONT, LOWER_N);

    $.push(create_flt(EMIT_SPACE));
    $.push(create_flt(0.0));
    $.push(create_flt(0.0));
    $.push(create_flt(w));

    list(4, $);
}

function emit_numerators(p: Cons, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    const t = $.length;
    const n = count_numerators(p);
    p = cdr(p);

    while (is_cons(p)) {
        const q = car(p);
        p = cdr(p);

        if (!isnumerator(q)) continue;

        if ($.length > t) emit_medium_space($);

        if (is_rat(q)) {
            const s = bignum_itoa(q.a);
            emit_roman_string(s, $);
            continue;
        }

        if (car(q).equals(ADD) && n === 1) {
            emit_expr(q, env, $, ec); // parens not needed
        } else {
            emit_factor(q, env, $, ec);
        }
    }

    if ($.length === t) {
        emit_roman_string("1", $); // no numerators
    }

    emit_update_list(t, $);
}

// p is rational or double, sign is not emitted

function emit_numeric_exponent(p: Num, $: ProgramStack) {
    emit_level++;

    const t = $.length;

    if (is_rat(p)) {
        let s = bignum_itoa(p.a);
        emit_roman_string(s, $);
        if (isfraction(p)) {
            emit_roman_string("/", $);
            s = bignum_itoa(p.b);
            emit_roman_string(s, $);
        }
    } else {
        emit_double(p, $);
    }

    emit_update_list(t, $);

    emit_level--;

    emit_update_superscript($);
}

function emit_power(p: U, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    if (cadr(p).equals(MATH_E)) {
        emit_roman_string("exp", $);
        emit_args(cdr(p), env, $, ec);
        return;
    }

    if (is_imu(p)) {
        if (ec.useImaginaryJ) {
            emit_italic_string("j", $);
            return;
        }
        if (ec.useImaginaryI) {
            emit_italic_string("i", $);
            return;
        }
    }

    const X = caddr(p);
    if (is_num(X) && X.isNegative()) {
        emit_reciprocal(p, env, $, ec);
        return;
    }

    emit_base(cadr(p), env, $, ec);
    emit_exponent(caddr(p), env, $, ec);
}

function emit_rational(x: Rat, $: ProgramStack): void {
    if (x.isInteger()) {
        const s = bignum_itoa(x.a);
        emit_roman_string(s, $);
        return;
    }

    emit_level++;

    let t = $.length;
    let s = bignum_itoa(x.a);
    emit_roman_string(s, $);
    emit_update_list(t, $);

    t = $.length;
    s = bignum_itoa(x.b);
    emit_roman_string(s, $);
    emit_update_list(t, $);

    emit_level--;

    emit_update_fraction($);
}

// p = y^x where x is a negative number

function emit_reciprocal(p: U, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    emit_roman_string("1", $); // numerator

    const t = $.length;

    if (isminusone(caddr(p))) emit_expr(cadr(p), env, $, ec);
    else {
        emit_base(cadr(p), env, $, ec);
        emit_numeric_exponent(caddr(p) as Num, $); // sign is not emitted
    }

    emit_update_list(t, $);

    emit_update_fraction($);
}

function emit_roman_char(char_num: number, $: ProgramStack): void {
    let font_num: number;

    if (emit_level === 0) font_num = ROMAN_FONT;
    else font_num = SMALL_ROMAN_FONT;

    const h = get_cap_height(font_num);
    const d = get_char_depth(font_num, char_num);
    const w = get_char_width(font_num, char_num);

    $.push(create_flt(EMIT_CHAR));
    $.push(create_flt(h));
    $.push(create_flt(d));
    $.push(create_flt(w));
    $.push(create_flt(font_num));
    $.push(create_flt(char_num));

    list(6, $);
}

function emit_roman_string(s: string, $: ProgramStack): void {
    for (let i = 0; i < s.length; i++) {
        emit_roman_char(s.charCodeAt(i), $);
    }
}

function emit_string(str: Str, $: ProgramStack): void {
    const human = JSON.stringify(str.str);
    emit_roman_string(human, $);
}

function emit_subexpr(p: U, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    emit_list(p, env, $, ec);
    emit_update_subexpr($);
}

function emit_symbol(sym: Sym, $: ProgramStack): void {
    if (is_native(sym, Native.PI)) {
        emit_symbol_as_fragments("pi", $);
    } else if (sym.key() === "Ω") {
        emit_symbol_as_fragments("Omega", $);
    } else {
        return emit_symbol_roman(sym, $);
    }
}

/**
 * Used to render symbols as Roman fonts.
 * This is the standard for most mathematics.
 */
function emit_symbol_roman(sym: Sym, $: ProgramStack): void {
    if (sym.equalsSym(MATH_E)) {
        emit_roman_string("exp(1)", $);
        return;
    }

    const s = printname_from_symbol(sym);

    emit_roman_string(s, $);
}

/**
 * Used to render symbols as a leading character then a suffix.
 * We use this when there is some cue that the symbol.
 */
export function emit_symbol_as_fragments(s: string, $: ProgramStack): void {
    let k = emit_symbol_fragment(s, 0, $);

    if (k === s.length) {
        return;
    }

    // emit subscript

    emit_level++;

    const t = $.length;

    while (k < s.length) {
        k = emit_symbol_fragment(s, k, $);
    }

    emit_update_list(t, $);

    emit_level--;

    emit_update_subscript($);
}

const symbol_name_tab = [
    "Alpha",
    "Beta",
    "Gamma",
    "Delta",
    "Epsilon",
    "Zeta",
    "Eta",
    "Theta",
    "Iota",
    "Kappa",
    "Lambda",
    "Mu",
    "Nu",
    "Xi",
    "Omicron",
    "Pi",
    "Rho",
    "Sigma",
    "Tau",
    "Upsilon",
    "Phi",
    "Chi",
    "Psi",
    "Omega",

    "alpha",
    "beta",
    "gamma",
    "delta",
    "epsilon",
    "zeta",
    "eta",
    "theta",
    "iota",
    "kappa",
    "lambda",
    "mu",
    "nu",
    "xi",
    "omicron",
    "pi",
    "rho",
    "sigma",
    "tau",
    "upsilon",
    "phi",
    "chi",
    "psi",
    "omega",

    "hbar"
];

const symbol_italic_tab = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0];

function emit_symbol_fragment(s: string, k: number, $: ProgramStack): number {
    let i: number;
    let t: string = "";

    const n = symbol_name_tab.length;

    for (i = 0; i < n; i++) {
        t = symbol_name_tab[i];
        if (s.startsWith(t, k)) break;
    }

    if (i === n) {
        if (isdigit(s.charAt(k))) emit_roman_char(s.charCodeAt(k), $);
        else emit_italic_char(s.charCodeAt(k), $);
        return k + 1;
    }

    const char_num = i + 128;

    if (symbol_italic_tab[i]) emit_italic_char(char_num, $);
    else emit_roman_char(char_num, $);

    return k + t.length;
}

function emit_blade(blade: Blade, $: ProgramStack): void {
    const str = blade.toInfixString();
    emit_roman_string(str, $);
}

function emit_atom(atom: Atom, env: SvgRenderEnv, $: ProgramStack): void {
    const handler = env.handlerFor(atom);
    const value = handler.dispatch(atom, native_sym(Native.infix), nil, env);
    try {
        const str = str_to_string(value);
        emit_roman_string(str, $);
    } finally {
        value.release();
    }
}

function emit_imaginary_unit(imu: Imu, $: ProgramStack, ec: SvgRenderConfig): void {
    if (ec.useImaginaryI) {
        emit_italic_string("i", $);
    } else if (ec.useImaginaryJ) {
        emit_italic_string("j", $);
    } else {
        emit_italic_string("i", $);
    }
}

function emit_tensor(p: Tensor, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    if (p.ndim % 2 === 1)
        emit_vector(p, env, $, ec); // odd rank
    else emit_matrix(p, 0, 0, env, $, ec); // even rank
}

function emit_boo(boo: Boo, $: ProgramStack): void {
    if (boo.isTrue()) {
        emit_roman_string("true", $);
    } else if (boo.isFalse()) {
        emit_roman_string("false", $);
    } else {
        emit_roman_string("fuzzy", $);
    }
}

function emit_uom(uom: Uom, $: ProgramStack): void {
    const str = uom.toInfixString();
    const sym = create_sym(str);
    emit_symbol(sym, $);
    // emit_roman_string(str, $);
}

function emit_term(p: U, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    if (is_cons(p) && p.opr.equals(MULTIPLY)) emit_term_nib(p, env, $, ec);
    else emit_factor(p, env, $, ec);
}

function emit_term_nib(p: Cons, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    if (find_denominator(p)) {
        emit_fraction(p, env, $, ec);
        return;
    }

    // no denominators

    p = cdr(p);

    if (isminusone(car(p)) && !is_flt(car(p))) p = cdr(p); // sign already emitted

    emit_factor(car(p), env, $, ec);

    p = cdr(p);

    while (is_cons(p)) {
        emit_medium_space($);
        emit_factor(car(p), env, $, ec);
        p = cdr(p);
    }
}

function emit_thick_space($: ProgramStack): void {
    let w: number;

    if (emit_level === 0) w = get_char_width(ROMAN_FONT, LOWER_N);
    else w = get_char_width(SMALL_ROMAN_FONT, LOWER_N);

    $.push(create_flt(EMIT_SPACE));
    $.push(create_flt(0.0));
    $.push(create_flt(0.0));
    $.push(create_flt(w));

    list(4, $);
}

function emit_thin_space($: ProgramStack): void {
    let w: number;

    if (emit_level === 0) w = 0.25 * get_char_width(ROMAN_FONT, LOWER_N);
    else w = 0.25 * get_char_width(SMALL_ROMAN_FONT, LOWER_N);

    $.push(create_flt(EMIT_SPACE));
    $.push(create_flt(0.0));
    $.push(create_flt(0.0));
    $.push(create_flt(w));

    list(4, $);
}

function emit_update_fraction($: ProgramStack): void {
    const p2 = $.pop()!; // denominator
    const p1 = $.pop()!; // numerator

    let h = height(p1) + depth(p1);
    let d = height(p2) + depth(p2);
    let w = Math.max(width(p1), width(p2));

    let opcode: number;
    let font_num: number;

    if (emit_level === 0) {
        opcode = EMIT_FRACTION;
        font_num = ROMAN_FONT;
    } else {
        opcode = EMIT_SMALL_FRACTION;
        font_num = SMALL_ROMAN_FONT;
    }

    const m = get_operator_height(font_num);

    const v = 0.75 * m; // extra vertical space

    h += v + m;
    d += v - m;

    w += get_char_width(font_num, LOWER_N) / 2; // make horizontal line a bit wider

    $.push(create_flt(opcode));
    $.push(create_flt(h));
    $.push(create_flt(d));
    $.push(create_flt(w));
    $.push(p1);
    $.push(p2);

    list(6, $);
}

function emit_update_list(t: number, $: ProgramStack): void {
    if ($.length - t === 1) {
        return;
    }

    let h = 0;
    let d = 0;
    let w = 0;

    let p1: U;

    for (let i = t; i < $.length; i++) {
        p1 = $.getAt(i);
        h = Math.max(h, height(p1));
        d = Math.max(d, depth(p1));
        w += width(p1);
    }

    list($.length - t, $);
    p1 = $.pop()!;

    $.push(create_flt(EMIT_LIST));
    $.push(create_flt(h));
    $.push(create_flt(d));
    $.push(create_flt(w));
    $.push(p1);

    list(5, $);
}

function emit_update_subexpr($: ProgramStack): void {
    const p1 = $.pop()!;

    let h = height(p1);
    let d = depth(p1);
    let w = width(p1);

    let opcode: number;
    let font_num: number;

    if (emit_level === 0) {
        opcode = EMIT_SUBEXPR;
        font_num = ROMAN_FONT;
    } else {
        opcode = EMIT_SMALL_SUBEXPR;
        font_num = SMALL_ROMAN_FONT;
    }

    h = Math.max(h, get_cap_height(font_num));
    d = Math.max(d, get_descent(font_num));

    // delimiters have vertical symmetry (h - m === d + m)

    if (h > get_cap_height(font_num) || d > get_descent(font_num)) {
        const m = get_operator_height(font_num);
        h = Math.max(h, d + 2 * m) + 0.5 * m; // plus a little extra
        d = h - 2 * m; // by symmetry
    }

    w += 2 * get_char_width(font_num, LEFT_PAREN);

    $.push(create_flt(opcode));
    $.push(create_flt(h));
    $.push(create_flt(d));
    $.push(create_flt(w));
    $.push(p1);

    list(5, $);
}

function emit_update_subscript($: ProgramStack): void {
    const p1 = $.pop()!;

    let font_num: number;

    if (emit_level === 0) font_num = ROMAN_FONT;
    else font_num = SMALL_ROMAN_FONT;

    const t = get_char_width(font_num, LOWER_N) / 6;

    const h = get_cap_height(font_num);
    let d = depth(p1);
    const w = t + width(p1);

    const dx = t;
    const dy = h / 2;

    d += dy;

    $.push(create_flt(EMIT_SUBSCRIPT));
    $.push(create_flt(h));
    $.push(create_flt(d));
    $.push(create_flt(w));
    $.push(create_flt(dx));
    $.push(create_flt(dy));
    $.push(p1);

    list(7, $);
}

function emit_update_superscript($: ProgramStack): void {
    const p2 = $.pop()!; // exponent
    const p1 = $.pop()!; // base

    let font_num: number;

    if (emit_level === 0) font_num = ROMAN_FONT;
    else font_num = SMALL_ROMAN_FONT;

    const t = get_char_width(font_num, LOWER_N) / 6;

    let h = height(p2);
    let d = depth(p2);
    let w = t + width(p2);

    // y is height of base

    let y = height(p1);

    // adjust

    y -= (h + d) / 2;

    y = Math.max(y, get_xheight(font_num));

    let dx = t;
    const dy = -(y + d);

    h = y + h + d;
    d = 0;

    if (opcode(p1) === EMIT_SUBSCRIPT) {
        dx = -width(p1) + t;
        w = Math.max(0, w - width(p1));
    }

    $.push(p1); // base

    $.push(create_flt(EMIT_SUPERSCRIPT));
    $.push(create_flt(h));
    $.push(create_flt(d));
    $.push(create_flt(w));
    $.push(create_flt(dx));
    $.push(create_flt(dy));
    $.push(p2);

    list(7, $);
}

function emit_update_table(n: number, m: number, $: ProgramStack): void {
    let total_height = 0;
    let total_width = 0;

    const t = $.length - n * m;

    // max height for each row

    for (let i = 0; i < n; i++) {
        // for each row
        let h = 0;
        for (let j = 0; j < m; j++) {
            // for each column
            const p1 = $.getAt(t + i * m + j);
            h = Math.max(h, height(p1));
        }
        $.push(create_flt(h));
        total_height += h;
    }

    list(n, $);
    const p2 = $.pop()!;

    // max depth for each row

    for (let i = 0; i < n; i++) {
        // for each row
        let d = 0;
        for (let j = 0; j < m; j++) {
            // for each column
            const p1 = $.getAt(t + i * m + j);
            d = Math.max(d, depth(p1));
        }
        $.push(create_flt(d));
        total_height += d;
    }

    list(n, $);
    const p3 = $.pop()!;

    // max width for each column

    for (let j = 0; j < m; j++) {
        // for each column
        let w = 0;
        for (let i = 0; i < n; i++) {
            // for each row
            const p1 = $.getAt(t + i * m + j);
            w = Math.max(w, width(p1));
        }
        $.push(create_flt(w));
        total_width += w;
    }

    list(m, $);
    const p4 = $.pop()!;

    // padding

    total_height += n * 2 * TABLE_VSPACE;
    total_width += m * 2 * TABLE_HSPACE;

    // h, d, w for entire table

    const h = total_height / 2 + get_operator_height(ROMAN_FONT);
    const d = total_height - h;
    const w = total_width + 2 * get_char_width(ROMAN_FONT, LEFT_PAREN);

    list(n * m, $);
    const p1 = $.pop()!;

    $.push(create_flt(EMIT_TABLE));
    $.push(create_flt(h));
    $.push(create_flt(d));
    $.push(create_flt(w));
    $.push(create_flt(n));
    $.push(create_flt(m));
    $.push(p1);
    $.push(p2);
    $.push(p3);
    $.push(p4);

    list(10, $);
}

function emit_vector(p: Tensor, env: SvgRenderEnv, $: ProgramStack, ec: SvgRenderConfig): void {
    // compute element span

    let span = 1;

    let n = p.ndim;

    for (let i = 1; i < n; i++) span *= p.dims[i];

    n = p.dims[0]; // number of rows

    for (let i = 0; i < n; i++) emit_matrix(p, 1, i * span, env, $, ec);

    emit_update_table(n, 1, $); // n rows, 1 column
}

function opcode(p: U): number {
    return (car(p) as Flt).d;
}

export function height(p: U): number {
    return (cadr(p) as Flt).d;
}

function depth(p: U): number {
    return (caddr(p) as Flt).d;
}

export function width(p: U): number {
    return (cadddr(p) as Flt).d;
}

function val1(p: U): number {
    return (car(p) as Flt).d;
}

function val2(p: U): number {
    return (cadr(p) as Flt).d;
}

export function draw_formula(x: number, y: number, codes: U, outbuf: string[]): void {
    if (isNaN(x)) {
        throw new Error("x is NaN");
    }
    if (isNaN(y)) {
        throw new Error("y is NaN");
    }

    const k = opcode(codes);
    const h = height(codes);
    const d = depth(codes);
    const w = width(codes);

    const data = cdnr(assert_cons(codes), 4);

    let font_num: number;
    let char_num: number;

    switch (k) {
        case EMIT_SPACE:
            break;

        case EMIT_CHAR:
            font_num = val1(data);
            char_num = val2(data);
            draw_char(x, y, font_num, char_num, outbuf);
            break;

        case EMIT_LIST: {
            let p = car(data);
            while (is_cons(p)) {
                draw_formula(x, y, car(p), outbuf);
                x += width(car(p));
                p = cdr(p);
            }
            break;
        }
        case EMIT_SUPERSCRIPT:
        case EMIT_SUBSCRIPT: {
            const dx = val1(data);
            const dy = val2(data);
            const p = caddr(data);
            draw_formula(x + dx, y + dy, p, outbuf);
            break;
        }
        case EMIT_SUBEXPR: {
            draw_delims(x, y, h, d, w, FONT_SIZE * DELIM_STROKE, ROMAN_FONT, outbuf);
            const dx = get_char_width(ROMAN_FONT, LEFT_PAREN);
            draw_formula(x + dx, y, car(data), outbuf);
            break;
        }
        case EMIT_SMALL_SUBEXPR: {
            draw_delims(x, y, h, d, w, SMALL_FONT_SIZE * DELIM_STROKE, SMALL_ROMAN_FONT, outbuf);
            const dx = get_char_width(SMALL_ROMAN_FONT, LEFT_PAREN);
            draw_formula(x + dx, y, car(data), outbuf);
            break;
        }
        case EMIT_FRACTION:
            draw_fraction(x, y, h, d, w, FONT_SIZE * FRAC_STROKE, ROMAN_FONT, data, outbuf);
            break;

        case EMIT_SMALL_FRACTION:
            draw_fraction(x, y, h, d, w, SMALL_FONT_SIZE * FRAC_STROKE, SMALL_ROMAN_FONT, data, outbuf);
            break;

        case EMIT_TABLE: {
            draw_delims(x, y, h, d, w, 1.2 * FONT_SIZE * DELIM_STROKE, ROMAN_FONT, outbuf);
            const dx = get_char_width(ROMAN_FONT, LEFT_PAREN);
            draw_table(x + dx, y - h, data, outbuf);
            break;
        }
    }
}

const html_name_tab = [
    "&Alpha;",
    "&Beta;",
    "&Gamma;",
    "&Delta;",
    "&Epsilon;",
    "&Zeta;",
    "&Eta;",
    "&Theta;",
    "&Iota;",
    "&Kappa;",
    "&Lambda;",
    "&Mu;",
    "&Nu;",
    "&Xi;",
    "&Omicron;",
    "&Pi;",
    "&Rho;",
    "&Sigma;",
    "&Tau;",
    "&Upsilon;",
    "&Phi;",
    "&Chi;",
    "&Psi;",
    "&Omega;",

    "&alpha;",
    "&beta;",
    "&gamma;",
    "&delta;",
    "&epsilon;",
    "&zeta;",
    "&eta;",
    "&theta;",
    "&iota;",
    "&kappa;",
    "&lambda;",
    "&mu;",
    "&nu;",
    "&xi;",
    "&omicron;",
    "&pi;",
    "&rho;",
    "&sigma;",
    "&tau;",
    "&upsilon;",
    "&phi;",
    "&chi;",
    "&psi;",
    "&omega;",

    "&hbar;", // 176

    "&plus;", // 177
    "&minus;", // 178
    "&times;", // 179
    "&ge;", // 180
    "&le;" // 181
];

// https://www.ascii-code.com
const ASCII_CODE_MIDDOT = 183;

function draw_char(x: number, y: number, font_num: number, char_num: number, outbuf: string[]): void {
    let text: string;
    let buffer: string;

    if (char_num === ASCII_CODE_MIDDOT) {
        text = "&middot;";
    } else if (char_num < 32 || char_num > 181) {
        // console.lg(`char_num => ${char_num}`);
        text = "?";
    } else if (char_num === 34) text = "&quot;";
    else if (char_num === 38) text = "&amp;";
    else if (char_num === 60) text = "&lt;";
    else if (char_num === 62) text = "&gt;";
    else if (char_num < 128) text = String.fromCharCode(char_num);
    else text = html_name_tab[char_num - 128];

    buffer = `<text style='font-family:"Times New Roman";`;

    switch (font_num) {
        case ROMAN_FONT:
            buffer += "font-size:" + FONT_SIZE + "px;";
            break;
        case ITALIC_FONT:
            buffer += "font-size:" + FONT_SIZE + "px;font-style:italic;";
            break;
        case SMALL_ROMAN_FONT:
            buffer += "font-size:" + SMALL_FONT_SIZE + "px;";
            break;
        case SMALL_ITALIC_FONT:
            buffer += "font-size:" + SMALL_FONT_SIZE + "px;font-style:italic;";
            break;
    }

    const xeq = "x='" + x + "'";
    const yeq = "y='" + y + "'";

    buffer += `' ${xeq} ${yeq}>${text}</text>`;

    outbuf.push(buffer);
}

function draw_delims(x: number, y: number, h: number, d: number, w: number, stroke_width: number, font_num: number, outbuf: string[]): void {
    const ch = get_cap_height(font_num);
    const cd = get_char_depth(font_num, LEFT_PAREN);
    const cw = get_char_width(font_num, LEFT_PAREN);

    if (h > ch || d > cd) {
        draw_left_delim(x, y, h, d, cw, stroke_width, outbuf);
        draw_right_delim(x + w - cw, y, h, d, cw, stroke_width, outbuf);
    } else {
        draw_char(x, y, font_num, LEFT_PAREN, outbuf);
        draw_char(x + w - cw, y, font_num, RIGHT_PAREN, outbuf);
    }
}

function draw_left_delim(x: number, y: number, h: number, d: number, w: number, stroke_width: number, outbuf: string[]): void {
    const x1 = Math.round(x + 0.5 * w);
    const x2 = x1 + Math.round(0.5 * w);

    const y1 = Math.round(y - h);
    const y2 = Math.round(y + d);

    draw_stroke(x1, y1, x1, y2, stroke_width, outbuf); // stem stroke
    draw_stroke(x1, y1, x2, y1, stroke_width, outbuf); // top stroke
    draw_stroke(x1, y2, x2, y2, stroke_width, outbuf); // bottom stroke
}

function draw_right_delim(x: number, y: number, h: number, d: number, w: number, stroke_width: number, outbuf: string[]): void {
    const x1 = Math.round(x + 0.5 * w);
    const x2 = x1 - Math.round(0.5 * w);

    const y1 = Math.round(y - h);
    const y2 = Math.round(y + d);

    draw_stroke(x1, y1, x1, y2, stroke_width, outbuf); // stem stroke
    draw_stroke(x1, y1, x2, y1, stroke_width, outbuf); // top stroke
    draw_stroke(x1, y2, x2, y2, stroke_width, outbuf); // bottom stroke
}

function draw_stroke(x1: number, y1: number, x2: number, y2: number, stroke_width: number, outbuf: string[]): void {
    const x1eq = "x1='" + x1 + "'";
    const x2eq = "x2='" + x2 + "'";

    const y1eq = "y1='" + y1 + "'";
    const y2eq = "y2='" + y2 + "'";

    const s = "<line " + x1eq + y1eq + x2eq + y2eq + "style='stroke:black;stroke-width:" + stroke_width + "'/>";

    outbuf.push(s);
}

function draw_fraction(x: number, y: number, h: number, d: number, w: number, stroke_width: number, font_num: number, p: U, outbuf: string[]): void {
    // horizontal line

    let dy = get_operator_height(font_num);

    draw_stroke(x, y - dy, x + w, y - dy, stroke_width, outbuf);

    // numerator

    let dx = (w - width(car(p))) / 2;
    dy = h - height(car(p));
    draw_formula(x + dx, y - dy, car(p), outbuf);

    // denominator

    p = cdr(p);
    dx = (w - width(car(p))) / 2;
    dy = d - depth(car(p));
    draw_formula(x + dx, y + dy, car(p), outbuf);
}

function draw_table(x: number, y: number, p: U, outbuf: string[]): void {
    const n = val1(p);
    const m = val2(p);

    p = cddr(p);

    let table = car(p);
    let h = cadr(p);
    let d = caddr(p);

    for (let i = 0; i < n; i++) {
        // for each row

        const row_height = val1(h);
        const row_depth = val1(d);

        y += TABLE_VSPACE + row_height;

        let dx = 0;

        let w = cadddr(p);

        for (let j = 0; j < m; j++) {
            // for each column

            const column_width = val1(w);
            const elem_width = width(car(table));
            const cx = x + dx + TABLE_HSPACE + (column_width - elem_width) / 2; // center horizontal
            draw_formula(cx, y, car(table), outbuf);
            dx += column_width + 2 * TABLE_HSPACE;
            table = cdr(table);
            w = cdr(w);
        }

        y += row_depth + TABLE_VSPACE;

        h = cdr(h);
        d = cdr(d);
    }
}

function count_numerators(p: Cons): number {
    let n = 0;
    p = cdr(p);
    while (is_cons(p)) {
        if (isnumerator(car(p))) n++;
        p = cdr(p);
    }
    return n;
}
