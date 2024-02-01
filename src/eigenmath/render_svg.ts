import { assert_sym, Blade, Boo, create_sym, Flt, is_blade, is_boo, is_flt, is_num, is_rat, is_str, is_sym, is_tensor, is_uom, Num, Rat, Str, Sym, Tensor, Uom } from "math-expression-atoms";
import { is_native_sym, Native, native_sym } from "math-expression-native";
import { car, cdr, Cons, is_atom, is_cons, is_nil, items_to_cons, nil, U } from "math-expression-tree";
import { is_imu } from "../operators/imu/is_imu";
import { assert_cons } from "../tree/cons/assert_cons";
import { cadddr, caddr, cadr, cddddr, cddr } from "../tree/helpers";
import { Imu } from "../tree/imu/Imu";
import { bignum_itoa } from "./bignum_itoa";
import { count_denominators } from "./count_denominators";
import { find_denominator } from "./find_denominator";
import { fmtnum } from "./fmtnum";
import {
    broadcast,
    eval_nonstop,
    floatfunc,
    get_binding,
    iszero,
    list,
    lookup,
    pop,
    push,
    push_double,
    restore_symbol,
    save_symbol,
    ScriptContentHandler,
    ScriptOutputListener,
    ScriptVars,
    set_symbol,
    value_of
} from './index';
import { infix_config_from_options } from "./infixform";
import { isdenominator } from "./isdenominator";
import { isdigit } from "./isdigit";
import { isfraction } from "./isfraction";
import { isimaginaryunit } from "./isimaginaryunit";
import { isinteger } from "./isinteger";
import { isminusone } from "./isminusone";
import { isnegativenumber } from "./isnegativenumber";
import { isnegativeterm } from "./isnegativeterm";
import { isnumerator } from "./isnumerator";
import { isposint } from "./isposint";
import { render_as_html_infix } from "./render_as_html_infix";

const DERIVATIVE = create_sym("derivative");
const FACTORIAL = create_sym("factorial");
const TESTEQ = create_sym("testeq");
const TESTGE = create_sym("testge");
const TESTGT = create_sym("testgt");
const TESTLE = create_sym("testle");
const TESTLT = create_sym("testlt");
const TTY = create_sym("tty");
const ADD = native_sym(Native.add);
const MULTIPLY = native_sym(Native.multiply);
const POWER = native_sym(Native.pow);
const INDEX = native_sym(Native.component);
const ASSIGN = native_sym(Native.assign);
const LAST = create_sym("last");
/**
 * mathematical constant Pi
 */
const Pi = native_sym(Native.PI);
const TRACE = create_sym("trace");
/**
 * 'i'
 */
const I_LOWER = create_sym("i");
const J_LOWER = create_sym("j");
const X_LOWER = create_sym("x");

const DOLLAR_E = create_sym("$e");

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

function get_cap_height(font_num: number): number {
    switch (font_num) {
        case ROMAN_FONT:
        case ITALIC_FONT:
            return FONT_CAP_HEIGHT * FONT_SIZE / 2048;
        case SMALL_ROMAN_FONT:
        case SMALL_ITALIC_FONT:
            return FONT_CAP_HEIGHT * SMALL_FONT_SIZE / 2048;
        default: throw new Error();
    }
}

function get_descent(font_num: number): number {
    switch (font_num) {
        case ROMAN_FONT:
        case ITALIC_FONT:
            return FONT_DESCENT * FONT_SIZE / 2048;
        case SMALL_ROMAN_FONT:
        case SMALL_ITALIC_FONT:
            return FONT_DESCENT * SMALL_FONT_SIZE / 2048;
        default: throw new Error();
    }
}

const roman_descent_tab = [

    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

    //	  ! " # $ % & ' ( ) * + , - . / 0 1 2 3 4 5 6 7 8 9 : ; < = > ?
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

    //	@ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [   ] ^ _
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1,

    //	` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~
    0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0,

    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // upper case greek
    0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, // lower case greek

    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

const italic_descent_tab = [

    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

    //	  ! " # $ % & ' ( ) * + , - . / 0 1 2 3 4 5 6 7 8 9 : ; < = > ?
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

    //	@ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [   ] ^ _
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1,

    //	` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~
    0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0,

    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // upper case greek
    0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, // lower case greek

    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

function get_char_depth(font_num: number, char_num: number) {
    switch (font_num) {
        case ROMAN_FONT:
        case SMALL_ROMAN_FONT:
            return get_descent(font_num) * roman_descent_tab[char_num];
        case ITALIC_FONT:
        case SMALL_ITALIC_FONT:
            return get_descent(font_num) * italic_descent_tab[char_num];
        default: throw new Error();
    }
}

const roman_width_tab = [

    909, 909, 909, 909, 909, 909, 909, 909,
    909, 909, 909, 909, 909, 909, 909, 909,
    909, 909, 909, 909, 909, 909, 909, 909,
    909, 909, 909, 909, 909, 909, 909, 909,

    512, 682, 836, 1024, 1024, 1706, 1593, 369,		// printable ascii
    682, 682, 1024, 1155, 512, 682, 512, 569,
    1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024,
    1024, 1024, 569, 569, 1155, 1155, 1155, 909,
    1886, 1479, 1366, 1366, 1479, 1251, 1139, 1479,
    1479, 682, 797, 1479, 1251, 1821, 1479, 1479,
    1139, 1479, 1366, 1139, 1251, 1479, 1479, 1933,
    1479, 1479, 1251, 682, 569, 682, 961, 1024,
    682, 909, 1024, 909, 1024, 909, 682, 1024,
    1024, 569, 569, 1024, 569, 1593, 1024, 1024,
    1024, 1024, 682, 797, 569, 1024, 1024, 1479,
    1024, 1024, 909, 983, 410, 983, 1108, 1593,

    1479, 1366, 1184, 1253, 1251, 1251, 1479, 1479,	// upper case greek
    682, 1479, 1485, 1821, 1479, 1317, 1479, 1479,
    1139, 1192, 1251, 1479, 1497, 1479, 1511, 1522,

    1073, 1042, 905, 965, 860, 848, 1071, 981,		// lower case greek
    551, 1032, 993, 1098, 926, 913, 1024, 1034,
    1022, 1104, 823, 1014, 1182, 909, 1282, 1348,

    1024, 1155, 1155, 1155, 1124, 1124, 1012, 909,		// other symbols

    909, 909, 909, 909, 909, 909, 909, 909,
    909, 909, 909, 909, 909, 909, 909, 909,
    909, 909, 909, 909, 909, 909, 909, 909,
    909, 909, 909, 909, 909, 909, 909, 909,
    909, 909, 909, 909, 909, 909, 909, 909,
    909, 909, 909, 909, 909, 909, 909, 909,
    909, 909, 909, 909, 909, 909, 909, 909,
    909, 909, 909, 909, 909, 909, 909, 909,
    909, 909, 909, 909, 909, 909, 909, 909,
];

const italic_width_tab = [

    1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024,
    1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024,
    1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024,
    1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024,

    512, 682, 860, 1024, 1024, 1706, 1593, 438,		// printable ascii
    682, 682, 1024, 1382, 512, 682, 512, 569,
    1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024,
    1024, 1024, 682, 682, 1382, 1382, 1382, 1024,
    1884, 1251, 1251, 1366, 1479, 1251, 1251, 1479,
    1479, 682, 909, 1366, 1139, 1706, 1366, 1479,
    1251, 1479, 1251, 1024, 1139, 1479, 1251, 1706,
    1251, 1139, 1139, 797, 569, 797, 864, 1024,
    682, 1024, 1024, 909, 1024, 909, 569, 1024,
    1024, 569, 569, 909, 569, 1479, 1024, 1024,
    1024, 1024, 797, 797, 569, 1024, 909, 1366,
    909, 909, 797, 819, 563, 819, 1108, 1593,

    1251, 1251, 1165, 1253, 1251, 1139, 1479, 1479,	// upper case greek
    682, 1366, 1237, 1706, 1366, 1309, 1479, 1479,
    1251, 1217, 1139, 1139, 1559, 1251, 1440, 1481,

    1075, 1020, 807, 952, 807, 829, 1016, 1006,		// lower case greek
    569, 983, 887, 1028, 909, 877, 1024, 1026,
    983, 1010, 733, 940, 1133, 901, 1272, 1446,

    1024, 1382, 1382, 1382, 1124, 1124, 1012, 1024,	// other symbols

    1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024,
    1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024,
    1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024,
    1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024,
    1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024,
    1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024,
    1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024,
    1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024,
    1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024,
];

function get_char_width(font_num: number, char_num: number): number {
    switch (font_num) {
        case ROMAN_FONT:
            return FONT_SIZE * roman_width_tab[char_num] / 2048;
        case ITALIC_FONT:
            return FONT_SIZE * italic_width_tab[char_num] / 2048;
        case SMALL_ROMAN_FONT:
            return SMALL_FONT_SIZE * roman_width_tab[char_num] / 2048;
        case SMALL_ITALIC_FONT:
            return SMALL_FONT_SIZE * italic_width_tab[char_num] / 2048;
        default: throw new Error();
    }
}

function get_xheight(font_num: number): number {
    switch (font_num) {
        case ROMAN_FONT:
        case ITALIC_FONT:
            return FONT_XHEIGHT * FONT_SIZE / 2048;
        case SMALL_ROMAN_FONT:
        case SMALL_ITALIC_FONT:
            return FONT_XHEIGHT * SMALL_FONT_SIZE / 2048;
        default: throw new Error();
    }
}

function get_operator_height(font_num: number): number {
    return get_cap_height(font_num) / 2;
}

function inrange(x: number, y: number): boolean {
    return x > -0.5 && x < DRAW_WIDTH + 0.5 && y > -0.5 && y < DRAW_HEIGHT + 0.5;
}

export interface StackContext {
    stack: U[];
}

export interface EmitContext {
    useImaginaryI: boolean;
    useImaginaryJ: boolean;
}

export function make_should_annotate(scope: EigenmathReadScope) {
    return function should_annotate_symbol(x: Sym, value: U): boolean {
        if (scope.hasUserFunction(x)) {
            if (x.equals(value) || is_nil(value)) {
                return false;
            }
            /*
            if (x.equals(I_LOWER) && isimaginaryunit(value))
                return false;
    
            if (x.equals(J_LOWER) && isimaginaryunit(value))
                return false;
            */

            return true;
        }
        else {
            if (is_native_sym(x)) {
                return false;
            }
            else {
                return true;
            }
        }
    };
}

export function eval_print(p1: U, $: ScriptVars): void {
    p1 = cdr(p1);
    while (is_cons(p1)) {
        push(car(p1), $);
        push(car(p1), $);
        value_of($);
        const result = pop($);
        const input = pop($);
        const ec: EmitContext = {
            useImaginaryI: isimaginaryunit(get_binding(I_LOWER, $)),
            useImaginaryJ: isimaginaryunit(get_binding(J_LOWER, $))
        };
        print_value_and_input_as_svg_or_infix(result, input, should_render_svg($), ec, $.listeners, make_should_annotate($), $);
        p1 = cdr(p1);
    }
    push(nil, $);
}

export interface DrawContext {
    /**
     * -Math.PI
     */
    tmin: number;
    /**
     * +Math.PI
     */
    tmax: number;
    /**
     * -10
     */
    xmin: number;
    /**
     * +10
     */
    xmax: number;
    /**
     * -10
     */
    ymin: number;
    /**
     * +10
     */
    ymax: number;
}

function setup_final(F: U, T: Sym, $: ScriptVars, dc: DrawContext): void {

    push_double(dc.tmin, $);
    let p1 = pop($);
    set_symbol(T, p1, nil, $);

    push(F, $);
    eval_nonstop($);
    p1 = pop($);

    if (!is_tensor(p1)) {
        dc.tmin = dc.xmin;
        dc.tmax = dc.xmax;
    }
}

function setup_trange($: ScriptVars, dc: DrawContext): void {

    dc.tmin = -Math.PI;
    dc.tmax = Math.PI;

    let p1: U = lookup(create_sym("trange"), $);
    push(p1, $);
    eval_nonstop($);
    floatfunc($);
    p1 = pop($);

    if (!is_tensor(p1) || p1.ndim !== 1 || p1.dims[0] !== 2)
        return;

    const p2 = p1.elems[0];
    const p3 = p1.elems[1];

    if (!is_num(p2) || !is_num(p3)) {
        return;
    }

    dc.tmin = p2.toNumber();
    dc.tmax = p3.toNumber();
}

function setup_xrange($: ScriptVars, dc: DrawContext): void {

    dc.xmin = -10;
    dc.xmax = 10;

    let p1: U = lookup(create_sym("xrange"), $);
    push(p1, $);
    eval_nonstop($);
    floatfunc($);
    p1 = pop($);

    if (!is_tensor(p1) || p1.ndim !== 1 || p1.dims[0] !== 2)
        return;

    const p2 = p1.elems[0];
    const p3 = p1.elems[1];

    if (!is_num(p2) || !is_num(p3))
        return;

    dc.xmin = p2.toNumber();
    dc.xmax = p3.toNumber();
}

function setup_yrange($: ScriptVars, dc: DrawContext): void {

    dc.ymin = -10;
    dc.ymax = 10;

    let p1: U = lookup(create_sym("yrange"), $);
    push(p1, $);
    eval_nonstop($);
    floatfunc($);
    p1 = pop($);

    if (!is_tensor(p1) || p1.ndim !== 1 || p1.dims[0] !== 2)
        return;

    const p2 = p1.elems[0];
    const p3 = p1.elems[1];

    if (!is_num(p2) || !is_num(p3))
        return;

    dc.ymin = p2.toNumber();
    dc.ymax = p3.toNumber();
}

function sample(F: U, T: U, t: number, draw_array: { t: number; x: number; y: number }[], $: ScriptVars, dc: DrawContext): void {
    let X: U;
    let Y: U;

    push_double(t, $);
    let p1 = pop($);
    set_symbol(assert_sym(T), p1, nil, $);

    push(F, $);
    eval_nonstop($);
    floatfunc($);
    p1 = pop($);

    if (is_tensor(p1)) {
        X = p1.elems[0];
        Y = p1.elems[1];
    }
    else {
        push_double(t, $);
        X = pop($);
        Y = p1;
    }

    if (!is_num(X) || !is_num(Y))
        return;

    let x = X.toNumber();
    let y = Y.toNumber();

    if (!isFinite(x) || !isFinite(y))
        return;

    x = DRAW_WIDTH * (x - dc.xmin) / (dc.xmax - dc.xmin);
    y = DRAW_HEIGHT * (y - dc.ymin) / (dc.ymax - dc.ymin);

    draw_array.push({ t: t, x: x, y: y });
}

export function should_render_svg($: ScriptVars): boolean {
    const tty = get_binding(TTY, $);
    if (tty.equals(TTY) || iszero(tty)) {
        return true;
    }
    else {
        return false;
    }
}

export type ShouldAnnotateFunction = (sym: Sym, value: U) => boolean;

export interface EigenmathReadScope {
    hasBinding(sym: Sym): boolean;
    hasUserFunction(sym: Sym): boolean;
}

export interface EigenmathWriteScope {
    defineUserSymbol(sym: Sym): void;
}

export interface EigenmathScope extends EigenmathReadScope, EigenmathWriteScope {

}

/**
 * This function is used by...
 * 
 * PrintScriptHandler
 * 
 * PrintScriptContentHandler (DRY?)
 * 
 * eval_print       (Eigenmath)
 * 
 * eval_run         (Eigenmath)
 * 
 * handler.spec.ts
 * 
 * runscript.spec.ts
 * 
 * FIXME: A possible problem with this function is that it has access to module level variables.
 * This makes it unsuitable as a pure function.
 * @param value 
 * @param x 
 * @param svg 
 * @param ec 
 * @param listeners The destination for the rendering.
 * @param should_annotate_symbol A callback function that determines whether a symbol should be annotated.
 * @returns 
 */
export function print_value_and_input_as_svg_or_infix(value: U, x: U, svg: boolean, ec: EmitContext, listeners: ScriptOutputListener[], should_annotate_symbol: ShouldAnnotateFunction, scope: EigenmathReadScope): void {

    if (is_nil(value)) {
        return;
    }

    if (is_sym(x) && should_annotate_symbol(x, value)) {
        // console.lg("The result WILL be annotated.");
        value = annotate(x, value);
    }
    else {
        // console.lg("The result will NOT be annotated.");
    }

    if (svg) {
        for (const listener of listeners) {
            listener.output(render_svg(value, ec, scope));
        }
    }
    else {
        const config = infix_config_from_options({});
        for (const listener of listeners) {
            listener.output(render_as_html_infix(value, config));
        }
    }
}

function annotate(input: U, result: U): U {
    return items_to_cons(ASSIGN, input, result);
}

export function eval_draw(expr: U, $: ScriptVars): void {

    if ($.drawing) {
        // Do nothing
    }
    else {
        $.drawing = 1;
        try {

            const F = assert_cons(expr).item(1);
            let T = assert_cons(expr).item(2);

            if (!(is_sym(T) && $.hasUserFunction(T))) {
                T = X_LOWER;
            }

            save_symbol(assert_sym(T), $);
            try {
                const dc: DrawContext = {
                    tmax: +Math.PI,
                    tmin: -Math.PI,
                    xmax: +10,
                    xmin: -10,
                    ymax: +10,
                    ymin: -10
                };
                setup_trange($, dc);
                setup_xrange($, dc);
                setup_yrange($, dc);

                setup_final(F, assert_sym(T), $, dc);

                const draw_array: { t: number; x: number; y: number }[] = [];

                // TODO: Why do we use the theta range? How do we ensure integrity across function calls?
                draw_pass1(F, T, draw_array, $, dc);
                draw_pass2(F, T, draw_array, $, dc);

                const outbuf: string[] = [];

                const ec: EmitContext = {
                    useImaginaryI: isimaginaryunit(get_binding(I_LOWER, $)),
                    useImaginaryJ: isimaginaryunit(get_binding(J_LOWER, $))
                };
                emit_graph(draw_array, $, dc, ec, outbuf, $);

                const output = outbuf.join('');

                broadcast(output, $);
            }
            finally {
                restore_symbol($);
            }
        }
        finally {
            $.drawing = 0;
        }
    }

    push(nil, $); // return value
}

let emit_level: number;

class SvgStackContext implements StackContext {
    readonly stack: U[] = [];
}

export function render_svg(expr: U, ec: EmitContext, scope: EigenmathReadScope): string {
    const $ = new SvgStackContext();

    emit_level = 0;

    emit_list(expr, $, ec, scope);

    const codes = pop($);

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
    return outbuf.join('');
}

/**
 * Converts an expression into an encoded form with opcode, height, depth, width, and data (depends on opcode).
 */
function emit_list(expr: U, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {
    const t = $.stack.length;
    emit_expr(expr, $, ec, scope);
    emit_update_list(t, $);
}

function emit_expr(p: U, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {
    if (isnegativeterm(p) || (car(p).equals(ADD) && isnegativeterm(cadr(p)))) {
        emit_roman_char(MINUS_SIGN, $);
        emit_thin_space($);
    }

    if (car(p).equals(ADD))
        emit_expr_nib(p, $, ec, scope);
    else
        emit_term(p, $, ec, scope);
}

function emit_expr_nib(p: U, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {
    p = cdr(p);
    emit_term(car(p), $, ec, scope);
    p = cdr(p);
    while (is_cons(p)) {
        if (isnegativeterm(car(p)))
            emit_infix_operator(MINUS_SIGN, $);
        else
            emit_infix_operator(PLUS_SIGN, $);
        emit_term(car(p), $, ec, scope);
        p = cdr(p);
    }
}

function emit_args(p: U, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {

    p = cdr(p);

    if (!is_cons(p)) {
        emit_roman_string("(", $);
        emit_roman_string(")", $);
        return;
    }

    const t = $.stack.length;

    emit_expr(car(p), $, ec, scope);

    p = cdr(p);

    while (is_cons(p)) {
        emit_roman_string(",", $);
        emit_thin_space($);
        emit_expr(car(p), $, ec, scope);
        p = cdr(p);
    }

    emit_update_list(t, $);

    emit_update_subexpr($);
}

function emit_base(p: U, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {
    if (is_num(p) && isnegativenumber(p) || (is_rat(p) && isfraction(p)) || is_flt(p) || car(p).equals(ADD) || car(p).equals(MULTIPLY) || car(p).equals(POWER))
        emit_subexpr(p, $, ec, scope);
    else
        emit_expr(p, $, ec, scope);
}

function emit_denominators(p: Cons, $: StackContext, ec: EmitContext, scope: EigenmathReadScope) {

    const t = $.stack.length;
    const n = count_denominators(p);
    p = cdr(p);

    while (is_cons(p)) {

        let q = car(p);
        p = cdr(p);

        if (!isdenominator(q))
            continue;

        if ($.stack.length > t)
            emit_medium_space($);

        if (is_rat(q)) {
            const s = bignum_itoa(q.b);
            emit_roman_string(s, $);
            continue;
        }

        if (isminusone(caddr(q))) {
            q = cadr(q);
            if (car(q).equals(ADD) && n === 1)
                emit_expr(q, $, ec, scope); // parens not needed
            else
                emit_factor(q, $, ec, scope);
        }
        else {
            emit_base(cadr(q), $, ec, scope);
            emit_numeric_exponent(caddr(q) as Num, $); // sign is not emitted
        }
    }

    emit_update_list(t, $);
}

function emit_double(p: Flt, $: StackContext): void {
    let i: number;
    let j: number;

    const s = fmtnum(p.d);

    let k = 0;

    while (k < s.length && s.charAt(k) !== "." && s.charAt(k) !== "E" && s.charAt(k) !== "e")
        k++;

    emit_roman_string(s.substring(0, k), $);

    // handle trailing zeroes

    if (s.charAt(k) === ".") {

        i = k++;

        while (k < s.length && s.charAt(k) !== "E" && s.charAt(k) !== "e")
            k++;

        j = k;

        while (s.charAt(j - 1) === "0")
            j--;

        if (j - i > 1)
            emit_roman_string(s.substring(i, j), $);
    }

    if (s.charAt(k) !== "E" && s.charAt(k) !== "e")
        return;

    k++;

    emit_roman_char(MULTIPLY_SIGN, $);

    emit_roman_string("10", $);

    // superscripted exponent

    emit_level++;

    const t = $.stack.length;

    // sign of exponent

    if (s.charAt(k) === "+")
        k++;
    else if (s.charAt(k) === "-") {
        emit_roman_char(MINUS_SIGN, $);
        emit_thin_space($);
        k++;
    }

    // skip leading zeroes in exponent

    while (s.charAt(k) === "0")
        k++;

    emit_roman_string(s.substring(k), $);

    emit_update_list(t, $);

    emit_level--;

    emit_update_superscript($);
}

function emit_exponent(p: U, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {
    if (is_num(p) && !isnegativenumber(p)) {
        emit_numeric_exponent(p, $); // sign is not emitted
        return;
    }

    emit_level++;
    emit_list(p, $, ec, scope);
    emit_level--;

    emit_update_superscript($);
}

function emit_factor(p: U, $: StackContext, ec: EmitContext, scope: EigenmathReadScope) {
    if (is_rat(p)) {
        emit_rational(p, $);
        return;
    }

    if (is_flt(p)) {
        emit_double(p, $);
        return;
    }

    if (is_sym(p)) {
        emit_symbol(p, $, scope);
        return;
    }

    if (is_str(p)) {
        emit_string(p, $);
        return;
    }

    if (is_tensor(p)) {
        emit_tensor(p, $, ec, scope);
        return;
    }

    if (is_uom(p)) {
        emit_uom(p, $, scope);
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
            emit_power(p, $, ec, scope);
        }
        else if (car(p).equals(ADD) || car(p).equals(MULTIPLY)) {
            emit_subexpr(p, $, ec, scope);
        }
        else {
            emit_function(p, $, ec, scope);
        }
        return;
    }

    if (is_nil(p)) {
        throw new Error();
    }

    if (is_atom(p)) {
        emit_atom(p, $);
        return;
    }
}

function emit_fraction(p: Cons, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {
    emit_numerators(p, $, ec, scope);
    emit_denominators(p, $, ec, scope);
    emit_update_fraction($);
}

function emit_function(p: U, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {
    // d(f(x),x)

    if (car(p).equals(DERIVATIVE)) {
        emit_roman_string("d", $);
        emit_args(p, $, ec, scope);
        return;
    }

    // n!

    if (car(p).equals(FACTORIAL)) {
        p = cadr(p);
        if (is_rat(p) && isposint(p) || is_sym(p))
            emit_expr(p, $, ec, scope);
        else
            emit_subexpr(p, $, ec, scope);
        emit_roman_string("!", $);
        return;
    }

    // A[1,2]

    if (car(p).equals(INDEX)) {
        p = cdr(p);
        const leading = car(p);
        if (is_sym(leading))
            emit_symbol(leading, $, scope);
        else
            emit_subexpr(leading, $, ec, scope);
        emit_indices(p, $, ec, scope);
        return;
    }

    if (is_cons(p) && (p.opr.equals(ASSIGN) || p.opr.equals(TESTEQ))) {
        emit_expr(cadr(p), $, ec, scope);
        emit_infix_operator(EQUALS_SIGN, $);
        emit_expr(caddr(p), $, ec, scope);
        return;
    }

    if (car(p).equals(TESTGE)) {
        emit_expr(cadr(p), $, ec, scope);
        emit_infix_operator(GREATEREQUAL, $);
        emit_expr(caddr(p), $, ec, scope);
        return;
    }

    if (car(p).equals(TESTGT)) {
        emit_expr(cadr(p), $, ec, scope);
        emit_infix_operator(GREATER_SIGN, $);
        emit_expr(caddr(p), $, ec, scope);
        return;
    }

    if (car(p).equals(TESTLE)) {
        emit_expr(cadr(p), $, ec, scope);
        emit_infix_operator(LESSEQUAL, $);
        emit_expr(caddr(p), $, ec, scope);
        return;
    }

    if (car(p).equals(TESTLT)) {
        emit_expr(cadr(p), $, ec, scope);
        emit_infix_operator(LESS_SIGN, $);
        emit_expr(caddr(p), $, ec, scope);
        return;
    }

    // default

    const leading = car(p);
    if (is_sym(leading))
        emit_symbol(leading, $, scope);
    else
        emit_subexpr(leading, $, ec, scope);

    emit_args(p, $, ec, scope);
}

function emit_indices(p: U, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {
    emit_roman_string("[", $);

    p = cdr(p);

    if (is_cons(p)) {
        emit_expr(car(p), $, ec, scope);
        p = cdr(p);
        while (is_cons(p)) {
            emit_roman_string(",", $);
            emit_thin_space($);
            emit_expr(car(p), $, ec, scope);
            p = cdr(p);
        }
    }

    emit_roman_string("]", $);
}

function emit_infix_operator(char_num: number, $: StackContext): void {
    emit_thick_space($);
    emit_roman_char(char_num, $);
    emit_thick_space($);
}

function emit_italic_char(char_num: number, $: StackContext): void {
    let font_num: number;

    if (emit_level === 0)
        font_num = ITALIC_FONT;
    else
        font_num = SMALL_ITALIC_FONT;

    const h = get_cap_height(font_num);
    const d = get_char_depth(font_num, char_num);
    const w = get_char_width(font_num, char_num);

    push_double(EMIT_CHAR, $);
    push_double(h, $);
    push_double(d, $);
    push_double(w, $);
    push_double(font_num, $);
    push_double(char_num, $);

    list(6, $);

    if (char_num === LOWER_F)
        emit_thin_space($);
}

function emit_italic_string(s: 'i' | 'j', $: StackContext): void {
    for (let i = 0; i < s.length; i++)
        emit_italic_char(s.charCodeAt(i), $);
}

function emit_matrix(p: Tensor, d: number, k: number, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {

    if (d === p.ndim) {
        emit_list(p.elems[k], $, ec, scope);
        return;
    }

    // compute element span

    let span = 1;

    let n = p.ndim;

    for (let i = d + 2; i < n; i++)
        span *= p.dims[i];

    n = p.dims[d];		// number of rows
    const m = p.dims[d + 1];	// number of columns

    for (let i = 0; i < n; i++)
        for (let j = 0; j < m; j++)
            emit_matrix(p, d + 2, k + (i * m + j) * span, $, ec, scope);

    emit_update_table(n, m, $);
}

function emit_medium_space($: StackContext): void {
    let w: number;

    if (emit_level === 0)
        w = 0.5 * get_char_width(ROMAN_FONT, LOWER_N);
    else
        w = 0.5 * get_char_width(SMALL_ROMAN_FONT, LOWER_N);

    push_double(EMIT_SPACE, $);
    push_double(0.0, $);
    push_double(0.0, $);
    push_double(w, $);

    list(4, $);
}

function emit_numerators(p: Cons, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {

    const t = $.stack.length;
    const n = count_numerators(p);
    p = cdr(p);

    while (is_cons(p)) {

        const q = car(p);
        p = cdr(p);

        if (!isnumerator(q))
            continue;

        if ($.stack.length > t)
            emit_medium_space($);

        if (is_rat(q)) {
            const s = bignum_itoa(q.a);
            emit_roman_string(s, $);
            continue;
        }

        if (car(q).equals(ADD) && n === 1)
            emit_expr(q, $, ec, scope); // parens not needed
        else
            emit_factor(q, $, ec, scope);
    }

    if ($.stack.length === t)
        emit_roman_string("1", $); // no numerators

    emit_update_list(t, $);
}

// p is rational or double, sign is not emitted

function emit_numeric_exponent(p: Num, $: StackContext) {

    emit_level++;

    const t = $.stack.length;

    if (is_rat(p)) {
        let s = bignum_itoa(p.a);
        emit_roman_string(s, $);
        if (isfraction(p)) {
            emit_roman_string("/", $);
            s = bignum_itoa(p.b);
            emit_roman_string(s, $);
        }
    }
    else {
        emit_double(p, $);
    }

    emit_update_list(t, $);

    emit_level--;

    emit_update_superscript($);
}

function emit_power(p: U, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {
    if (cadr(p).equals(DOLLAR_E)) {
        emit_roman_string("exp", $);
        emit_args(cdr(p), $, ec, scope);
        return;
    }

    if (isimaginaryunit(p)) {
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
    if (is_num(X) && isnegativenumber(X)) {
        emit_reciprocal(p, $, ec, scope);
        return;
    }

    emit_base(cadr(p), $, ec, scope);
    emit_exponent(caddr(p), $, ec, scope);
}

function emit_rational(p: Rat, $: StackContext): void {

    if (isinteger(p)) {
        const s = bignum_itoa(p.a);
        emit_roman_string(s, $);
        return;
    }

    emit_level++;

    let t = $.stack.length;
    let s = bignum_itoa(p.a);
    emit_roman_string(s, $);
    emit_update_list(t, $);

    t = $.stack.length;
    s = bignum_itoa(p.b);
    emit_roman_string(s, $);
    emit_update_list(t, $);

    emit_level--;

    emit_update_fraction($);
}

// p = y^x where x is a negative number

function emit_reciprocal(p: U, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {

    emit_roman_string("1", $); // numerator

    const t = $.stack.length;

    if (isminusone(caddr(p)))
        emit_expr(cadr(p), $, ec, scope);
    else {
        emit_base(cadr(p), $, ec, scope);
        emit_numeric_exponent(caddr(p) as Num, $); // sign is not emitted
    }

    emit_update_list(t, $);

    emit_update_fraction($);
}

function emit_roman_char(char_num: number, $: StackContext): void {
    let font_num: number;

    if (emit_level === 0)
        font_num = ROMAN_FONT;
    else
        font_num = SMALL_ROMAN_FONT;

    const h = get_cap_height(font_num);
    const d = get_char_depth(font_num, char_num);
    const w = get_char_width(font_num, char_num);

    push_double(EMIT_CHAR, $);
    push_double(h, $);
    push_double(d, $);
    push_double(w, $);
    push_double(font_num, $);
    push_double(char_num, $);

    list(6, $);
}

function emit_roman_string(s: string, $: StackContext): void {

    for (let i = 0; i < s.length; i++) {
        emit_roman_char(s.charCodeAt(i), $);
    }
}

function emit_string(p: Str, $: StackContext): void {
    emit_roman_string(p.str, $);
}

function emit_subexpr(p: U, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {
    emit_list(p, $, ec, scope);
    emit_update_subexpr($);
}

export function printname_from_symbol(sym: Sym): string {
    if (sym.equalsSym(Pi)) {
        return 'pi';
    }
    else if (sym.key() === 'Ω') {
        return 'Omega';
    }
    else {
        return sym.key();
    }
}

function emit_symbol(sym: Sym, $: StackContext, scope: Pick<EigenmathReadScope, 'hasBinding' | 'hasUserFunction'>): void {

    if (sym.equalsSym(DOLLAR_E)) {
        emit_roman_string("exp(1)", $);
        return;
    }

    const s = printname_from_symbol(sym);

    if (scope.hasUserFunction(sym)) {
        // Fall through
        // console.lg(`${sym} is user symbol`);
    }
    else if ((scope.hasBinding(sym)) || sym.equals(LAST) || sym.equals(TRACE) || sym.equals(TTY)) {
        // Keywords are printed Roman without italics.
        // console.lg(`${sym} is keyword`);
        emit_roman_string(s, $);
        return;
    }

    let k = emit_symbol_fragment(s, 0, $);

    if (k === s.length)
        return;

    // emit subscript

    emit_level++;

    const t = $.stack.length;

    while (k < s.length)
        k = emit_symbol_fragment(s, k, $);

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

    "hbar",
];

const symbol_italic_tab = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    0,
];

function emit_symbol_fragment(s: string, k: number, $: StackContext): number {
    let i: number;
    let t: string = "";

    const n = symbol_name_tab.length;

    for (i = 0; i < n; i++) {
        t = symbol_name_tab[i];
        if (s.startsWith(t, k))
            break;
    }

    if (i === n) {
        if (isdigit(s.charAt(k)))
            emit_roman_char(s.charCodeAt(k), $);
        else
            emit_italic_char(s.charCodeAt(k), $);
        return k + 1;
    }

    const char_num = i + 128;

    if (symbol_italic_tab[i])
        emit_italic_char(char_num, $);
    else
        emit_roman_char(char_num, $);

    return k + t.length;
}

function emit_blade(blade: Blade, $: StackContext): void {
    const str = blade.toInfixString();
    emit_roman_string(str, $);
}

function emit_atom(atom: U, $: StackContext): void {
    const str = atom.toString();
    emit_roman_string(str, $);
}

function emit_imaginary_unit(imu: Imu, $: StackContext, ec: EmitContext): void {
    if (ec.useImaginaryI) {
        emit_italic_string("i", $);
    }
    else if (ec.useImaginaryJ) {
        emit_italic_string("j", $);
    }
    else {
        emit_italic_string("i", $);
    }
}

function emit_tensor(p: Tensor, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {
    if (p.ndim % 2 === 1)
        emit_vector(p, $, ec, scope); // odd rank
    else
        emit_matrix(p, 0, 0, $, ec, scope); // even rank
}

function emit_boo(boo: Boo, $: StackContext): void {
    if (boo.isTrue()) {
        emit_roman_string('true', $);
    }
    else if (boo.isFalse()) {
        emit_roman_string('false', $);
    }
    else {
        emit_roman_string('fuzzy', $);
    }
}

function emit_uom(uom: Uom, $: StackContext, scope: EigenmathReadScope): void {
    const str = uom.toInfixString();
    const sym = create_sym(str);
    emit_symbol(sym, $, scope);
    // emit_roman_string(str, $);
}

function emit_term(p: U, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {
    if (is_cons(p) && p.opr.equals(MULTIPLY))
        emit_term_nib(p, $, ec, scope);
    else
        emit_factor(p, $, ec, scope);
}

function emit_term_nib(p: Cons, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {
    if (find_denominator(p)) {
        emit_fraction(p, $, ec, scope);
        return;
    }

    // no denominators

    p = cdr(p);

    if (isminusone(car(p)) && !is_flt(car(p)))
        p = cdr(p); // sign already emitted

    emit_factor(car(p), $, ec, scope);

    p = cdr(p);

    while (is_cons(p)) {
        emit_medium_space($);
        emit_factor(car(p), $, ec, scope);
        p = cdr(p);
    }
}

function emit_thick_space($: StackContext): void {
    let w: number;

    if (emit_level === 0)
        w = get_char_width(ROMAN_FONT, LOWER_N);
    else
        w = get_char_width(SMALL_ROMAN_FONT, LOWER_N);

    push_double(EMIT_SPACE, $);
    push_double(0.0, $);
    push_double(0.0, $);
    push_double(w, $);

    list(4, $);
}

function emit_thin_space($: StackContext): void {
    let w: number;

    if (emit_level === 0)
        w = 0.25 * get_char_width(ROMAN_FONT, LOWER_N);
    else
        w = 0.25 * get_char_width(SMALL_ROMAN_FONT, LOWER_N);

    push_double(EMIT_SPACE, $);
    push_double(0.0, $);
    push_double(0.0, $);
    push_double(w, $);

    list(4, $);
}

function emit_update_fraction($: StackContext): void {

    const p2 = pop($); // denominator
    const p1 = pop($); // numerator

    let h = height(p1) + depth(p1);
    let d = height(p2) + depth(p2);
    let w = Math.max(width(p1), width(p2));

    let opcode: number;
    let font_num: number;

    if (emit_level === 0) {
        opcode = EMIT_FRACTION;
        font_num = ROMAN_FONT;
    }
    else {
        opcode = EMIT_SMALL_FRACTION;
        font_num = SMALL_ROMAN_FONT;
    }

    const m = get_operator_height(font_num);

    const v = 0.75 * m; // extra vertical space

    h += v + m;
    d += v - m;

    w += get_char_width(font_num, LOWER_N) / 2; // make horizontal line a bit wider

    push_double(opcode, $);
    push_double(h, $);
    push_double(d, $);
    push_double(w, $);
    push(p1, $);
    push(p2, $);

    list(6, $);
}

function emit_update_list(t: number, $: StackContext): void {

    if ($.stack.length - t === 1) {
        return;
    }

    let h = 0;
    let d = 0;
    let w = 0;

    let p1: U;

    for (let i = t; i < $.stack.length; i++) {
        p1 = $.stack[i];
        h = Math.max(h, height(p1));
        d = Math.max(d, depth(p1));
        w += width(p1);
    }

    list($.stack.length - t, $);
    p1 = pop($);

    push_double(EMIT_LIST, $);
    push_double(h, $);
    push_double(d, $);
    push_double(w, $);
    push(p1, $);

    list(5, $);
}

function emit_update_subexpr($: StackContext): void {

    const p1 = pop($);

    let h = height(p1);
    let d = depth(p1);
    let w = width(p1);

    let opcode: number;
    let font_num: number;

    if (emit_level === 0) {
        opcode = EMIT_SUBEXPR;
        font_num = ROMAN_FONT;
    }
    else {
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

    push_double(opcode, $);
    push_double(h, $);
    push_double(d, $);
    push_double(w, $);
    push(p1, $);

    list(5, $);
}

function emit_update_subscript($: StackContext): void {

    const p1 = pop($);

    let font_num: number;

    if (emit_level === 0)
        font_num = ROMAN_FONT;
    else
        font_num = SMALL_ROMAN_FONT;

    const t = get_char_width(font_num, LOWER_N) / 6;

    const h = get_cap_height(font_num);
    let d = depth(p1);
    const w = t + width(p1);

    const dx = t;
    const dy = h / 2;

    d += dy;

    push_double(EMIT_SUBSCRIPT, $);
    push_double(h, $);
    push_double(d, $);
    push_double(w, $);
    push_double(dx, $);
    push_double(dy, $);
    push(p1, $);

    list(7, $);
}

function emit_update_superscript($: StackContext): void {

    const p2 = pop($); // exponent
    const p1 = pop($); // base

    let font_num: number;

    if (emit_level === 0)
        font_num = ROMAN_FONT;
    else
        font_num = SMALL_ROMAN_FONT;

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

    push(p1, $); // base

    push_double(EMIT_SUPERSCRIPT, $);
    push_double(h, $);
    push_double(d, $);
    push_double(w, $);
    push_double(dx, $);
    push_double(dy, $);
    push(p2, $);

    list(7, $);
}

function emit_update_table(n: number, m: number, $: StackContext): void {

    let total_height = 0;
    let total_width = 0;

    const t = $.stack.length - n * m;

    // max height for each row

    for (let i = 0; i < n; i++) { // for each row
        let h = 0;
        for (let j = 0; j < m; j++) { // for each column
            const p1 = $.stack[t + i * m + j];
            h = Math.max(h, height(p1));
        }
        push_double(h, $);
        total_height += h;
    }

    list(n, $);
    const p2 = pop($);

    // max depth for each row

    for (let i = 0; i < n; i++) { // for each row
        let d = 0;
        for (let j = 0; j < m; j++) { // for each column
            const p1 = $.stack[t + i * m + j];
            d = Math.max(d, depth(p1));
        }
        push_double(d, $);
        total_height += d;
    }

    list(n, $);
    const p3 = pop($);

    // max width for each column

    for (let j = 0; j < m; j++) { // for each column
        let w = 0;
        for (let i = 0; i < n; i++) { // for each row
            const p1 = $.stack[t + i * m + j];
            w = Math.max(w, width(p1));
        }
        push_double(w, $);
        total_width += w;
    }

    list(m, $);
    const p4 = pop($);

    // padding

    total_height += n * 2 * TABLE_VSPACE;
    total_width += m * 2 * TABLE_HSPACE;

    // h, d, w for entire table

    const h = total_height / 2 + get_operator_height(ROMAN_FONT);
    const d = total_height - h;
    const w = total_width + 2 * get_char_width(ROMAN_FONT, LEFT_PAREN);

    list(n * m, $);
    const p1 = pop($);

    push_double(EMIT_TABLE, $);
    push_double(h, $);
    push_double(d, $);
    push_double(w, $);
    push_double(n, $);
    push_double(m, $);
    push(p1, $);
    push(p2, $);
    push(p3, $);
    push(p4, $);

    list(10, $);
}

function emit_vector(p: Tensor, $: StackContext, ec: EmitContext, scope: EigenmathReadScope): void {
    // compute element span

    let span = 1;

    let n = p.ndim;

    for (let i = 1; i < n; i++)
        span *= p.dims[i];

    n = p.dims[0]; // number of rows

    for (let i = 0; i < n; i++)
        emit_matrix(p, 1, i * span, $, ec, scope);

    emit_update_table(n, 1, $); // n rows, 1 column
}

function opcode(p: U) {
    return (car(p) as Flt).d;
}

function height(p: U) {
    return (cadr(p) as Flt).d;
}

function depth(p: U) {
    return (caddr(p) as Flt).d;
}

function width(p: U) {
    return (cadddr(p) as Flt).d;
}

function val1(p: U) {
    return (car(p) as Flt).d;
}

function val2(p: U) {
    return (cadr(p) as Flt).d;
}

function draw_formula(x: number, y: number, codes: U, outbuf: string[]): void {
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

    const data = cddddr(codes);

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

    "&hbar;",	// 176

    "&plus;",	// 177
    "&minus;",	// 178
    "&times;",	// 179
    "&ge;",		// 180
    "&le;",		// 181
];

// https://www.ascii-code.com
const ASCII_CODE_MIDDOT = 183;

function draw_char(x: number, y: number, font_num: number, char_num: number, outbuf: string[]): void {
    let s: string;
    let t: string;

    if (char_num === ASCII_CODE_MIDDOT) {
        s = "&middot;";
    }
    else if (char_num < 32 || char_num > 181) {
        // console.lg(`char_num => ${char_num}`);
        s = "?";
    }
    else if (char_num === 34)
        s = "&quot;";
    else if (char_num === 38)
        s = "&amp;";
    else if (char_num === 60)
        s = "&lt;";
    else if (char_num === 62)
        s = "&gt;";
    else if (char_num < 128)
        s = String.fromCharCode(char_num);
    else
        s = html_name_tab[char_num - 128];

    t = "<text style='font-family:\"Times New Roman\";";

    switch (font_num) {
        case ROMAN_FONT:
            t += "font-size:" + FONT_SIZE + "px;";
            break;
        case ITALIC_FONT:
            t += "font-size:" + FONT_SIZE + "px;font-style:italic;";
            break;
        case SMALL_ROMAN_FONT:
            t += "font-size:" + SMALL_FONT_SIZE + "px;";
            break;
        case SMALL_ITALIC_FONT:
            t += "font-size:" + SMALL_FONT_SIZE + "px;font-style:italic;";
            break;
    }

    const xeq = "x='" + x + "'";
    const yeq = "y='" + y + "'";

    t += "'" + xeq + yeq + ">" + s + "</text>";

    outbuf.push(t);
}

function draw_delims(x: number, y: number, h: number, d: number, w: number, stroke_width: number, font_num: number, outbuf: string[]): void {

    const ch = get_cap_height(font_num);
    const cd = get_char_depth(font_num, LEFT_PAREN);
    const cw = get_char_width(font_num, LEFT_PAREN);

    if (h > ch || d > cd) {
        draw_left_delim(x, y, h, d, cw, stroke_width, outbuf);
        draw_right_delim(x + w - cw, y, h, d, cw, stroke_width, outbuf);
    }
    else {
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

    for (let i = 0; i < n; i++) { // for each row

        const row_height = val1(h);
        const row_depth = val1(d);

        y += TABLE_VSPACE + row_height;

        let dx = 0;

        let w = cadddr(p);

        for (let j = 0; j < m; j++) { // for each column

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

function draw_line(x1: number, y1: number, x2: number, y2: number, t: number, outbuf: string[]): void {
    x1 += DRAW_LEFT_PAD;
    x2 += DRAW_LEFT_PAD;

    y1 += DRAW_TOP_PAD;
    y2 += DRAW_TOP_PAD;

    const x1eq = "x1='" + x1 + "'";
    const x2eq = "x2='" + x2 + "'";

    const y1eq = "y1='" + y1 + "'";
    const y2eq = "y2='" + y2 + "'";

    outbuf.push("<line " + x1eq + y1eq + x2eq + y2eq + "style='stroke:black;stroke-width:" + t + "'/>\n");
}

function draw_pass1(F: U, T: U, draw_array: { t: number; x: number; y: number }[], $: ScriptVars, dc: DrawContext): void {
    for (let i = 0; i <= DRAW_WIDTH; i++) {
        const t = dc.tmin + (dc.tmax - dc.tmin) * i / DRAW_WIDTH;
        sample(F, T, t, draw_array, $, dc);
    }
}
//    draw_array: { t: number; x: number; y: number }[] = [];

function draw_pass2(F: U, T: U, draw_array: { t: number; x: number; y: number }[], $: ScriptVars, dc: DrawContext): void {
    // var dt, dx, dy, i, j, m, n, t, t1, t2, x1, x2, y1, y2;

    const n = draw_array.length - 1;

    for (let i = 0; i < n; i++) {

        const t1 = draw_array[i].t;
        const t2 = draw_array[i + 1].t;

        const x1 = draw_array[i].x;
        const x2 = draw_array[i + 1].x;

        const y1 = draw_array[i].y;
        const y2 = draw_array[i + 1].y;

        if (!inrange(x1, y1) && !inrange(x2, y2))
            continue;

        const dt = t2 - t1;
        const dx = x2 - x1;
        const dy = y2 - y1;

        let m = Math.sqrt(dx * dx + dy * dy);

        m = Math.floor(m);

        for (let j = 1; j < m; j++) {
            const t = t1 + dt * j / m;
            sample(F, T, t, draw_array, $, dc);
        }
    }
}
const DRAW_WIDTH = 300;
const DRAW_HEIGHT = 300;

const DRAW_LEFT_PAD = 200;
const DRAW_RIGHT_PAD = 100;

const DRAW_TOP_PAD = 10;
const DRAW_BOTTOM_PAD = 40;

const DRAW_XLABEL_BASELINE = 30;
const DRAW_YLABEL_MARGIN = 15;



function emit_axes(dc: DrawContext, outbuf: string[]): void {

    const x = 0;
    const y = 0;

    const dx = DRAW_WIDTH * (x - dc.xmin) / (dc.xmax - dc.xmin);
    const dy = DRAW_HEIGHT - DRAW_HEIGHT * (y - dc.ymin) / (dc.ymax - dc.ymin);

    if (dx > 0 && dx < DRAW_WIDTH)
        draw_line(dx, 0, dx, DRAW_HEIGHT, 0.5, outbuf); // vertical axis

    if (dy > 0 && dy < DRAW_HEIGHT)
        draw_line(0, dy, DRAW_WIDTH, dy, 0.5, outbuf); // horizontal axis
}

function emit_box(dc: DrawContext, outbuf: string[]): void {
    const x1 = 0;
    const x2 = DRAW_WIDTH;

    const y1 = 0;
    const y2 = DRAW_HEIGHT;

    draw_line(x1, y1, x2, y1, 0.5, outbuf); // top line
    draw_line(x1, y2, x2, y2, 0.5, outbuf); // bottom line

    draw_line(x1, y1, x1, y2, 0.5, outbuf); // left line
    draw_line(x2, y1, x2, y2, 0.5, outbuf); // right line
}

function emit_graph(draw_array: { t: number; x: number; y: number }[], $: ScriptVars, dc: DrawContext, ec: EmitContext, outbuf: string[], scope: EigenmathReadScope): void {

    const h = DRAW_TOP_PAD + DRAW_HEIGHT + DRAW_BOTTOM_PAD;
    const w = DRAW_LEFT_PAD + DRAW_WIDTH + DRAW_RIGHT_PAD;

    const heq = "height='" + h + "'";
    const weq = "width='" + w + "'";

    outbuf.push("<svg " + heq + weq + ">");

    emit_axes(dc, outbuf);
    emit_box(dc, outbuf);
    emit_labels($, dc, ec, outbuf, scope);
    emit_points(draw_array, dc, outbuf);

    outbuf.push("</svg>");
}

function emit_labels($: ScriptVars, dc: DrawContext, ec: EmitContext, outbuf: string[], scope: EigenmathReadScope): void {
    // TODO; Why do we need ScriptVars here?
    emit_level = 1; // small font
    emit_list(new Flt(dc.ymax), $, ec, scope);
    const YMAX = pop($);
    let x = DRAW_LEFT_PAD - width(YMAX) - DRAW_YLABEL_MARGIN;
    let y = DRAW_TOP_PAD + height(YMAX);
    draw_formula(x, y, YMAX, outbuf);

    emit_level = 1; // small font
    emit_list(new Flt(dc.ymin), $, ec, scope);
    const YMIN = pop($);
    x = DRAW_LEFT_PAD - width(YMIN) - DRAW_YLABEL_MARGIN;
    y = DRAW_TOP_PAD + DRAW_HEIGHT;
    draw_formula(x, y, YMIN, outbuf);

    emit_level = 1; // small font
    emit_list(new Flt(dc.xmin), $, ec, scope);
    const XMIN = pop($);
    x = DRAW_LEFT_PAD - width(XMIN) / 2;
    y = DRAW_TOP_PAD + DRAW_HEIGHT + DRAW_XLABEL_BASELINE;
    draw_formula(x, y, XMIN, outbuf);

    emit_level = 1; // small font
    emit_list(new Flt(dc.xmax), $, ec, scope);
    const XMAX = pop($);
    x = DRAW_LEFT_PAD + DRAW_WIDTH - width(XMAX) / 2;
    y = DRAW_TOP_PAD + DRAW_HEIGHT + DRAW_XLABEL_BASELINE;
    draw_formula(x, y, XMAX, outbuf);
}

function emit_points(draw_array: { t: number; x: number; y: number }[], $: DrawContext, outbuf: string[]): void {

    const n = draw_array.length;

    for (let i = 0; i < n; i++) {

        let x = draw_array[i].x;
        let y = draw_array[i].y;

        if (!inrange(x, y)) {
            continue;
        }

        x += DRAW_LEFT_PAD;
        y = DRAW_HEIGHT - y + DRAW_TOP_PAD;

        const xeq = "cx='" + x + "'";
        const yeq = "cy='" + y + "'";

        outbuf.push("<circle " + xeq + yeq + "r='1.5' style='stroke:black;fill:black'/>\n");
    }
}

function count_numerators(p: Cons): number {
    let n = 0;
    p = cdr(p);
    while (is_cons(p)) {
        if (isnumerator(car(p)))
            n++;
        p = cdr(p);
    }
    return n;
}


class PrintScriptOutputListener implements ScriptOutputListener {
    // TODO: only stdout needed here.
    // TOOD: May be the proper place for escaping.
    constructor(private readonly outer: PrintScriptContentHandler) {
        this.outer.stdout.innerHTML = "";
    }
    output(output: string): void {
        this.outer.stdout.innerHTML += output;
    }

}

class PrintScriptContentHandler implements ScriptContentHandler {
    private readonly listener: PrintScriptOutputListener;
    constructor(readonly stdout: HTMLElement) {
        this.listener = new PrintScriptOutputListener(this);
    }
    begin($: ScriptVars): void {
        $.addOutputListener(this.listener);
    }
    end($: ScriptVars): void {
        $.removeOutputListener(this.listener);
    }
    output(value: U, input: U, $: ScriptVars): void {
        const ec: EmitContext = {
            useImaginaryI: isimaginaryunit(get_binding(I_LOWER, $)),
            useImaginaryJ: isimaginaryunit(get_binding(J_LOWER, $))
        };
        function should_annotate_symbol(x: Sym, value: U): boolean {
            if ($.hasUserFunction(x)) {
                if (x.equals(value) || is_nil(value)) {
                    return false;
                }
                /*
                if (x.equals(I_LOWER) && isimaginaryunit(value))
                    return false;
        
                if (x.equals(J_LOWER) && isimaginaryunit(value))
                    return false;
                */

                return true;
            }
            else {
                if (is_native_sym(x)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        print_value_and_input_as_svg_or_infix(value, input, should_render_svg($), ec, [this.listener], should_annotate_symbol, $);
    }
}

