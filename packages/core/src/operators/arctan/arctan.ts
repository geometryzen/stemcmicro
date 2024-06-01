import { create_flt, create_rat, is_flt, is_sym, is_tensor, Num, Sym } from "@stemcmicro/atoms";
import { is_native, Native, native_sym } from "@stemcmicro/native";
import { car, cdr, Cons, Cons1, is_cons, items_to_cons, nil, U } from "@stemcmicro/tree";
import { rational } from "../../bignum";
import { eigenmath_arctan_numbers } from "../../eigenmath/eigenmath";
import { isdoublez } from "../../eigenmath/isdoublez";
import { isnegativeterm } from "../../eigenmath/isnegativeterm";
import { isplusone } from "../../eigenmath/isplusone";
import { iszero } from "../../eigenmath/iszero";
import { Directive, ExtensionEnv } from "../../env/ExtensionEnv";
import { StackU } from "../../env/StackU";
import { equaln, is_num_and_equalq } from "../../is";
import { is_negative } from "../../predicates/is_negative";
import { ARCTAN, COS, POWER, SIN, TAN } from "../../runtime/constants";
import { DynamicConstants } from "../../runtime/defs";
import { is_multiply, is_power } from "../../runtime/helpers";
import { MATH_PI } from "../../runtime/ns_math";
import { piAsFlt } from "../../tree/flt/Flt";
import { caddr, cadr } from "../../tree/helpers";
import { imu } from "../../tree/imu/Imu";
import { third, zero } from "../../tree/rat/Rat";
import { denominator } from "../denominator/denominator";
import { is_num } from "../num/is_num";
import { numerator } from "../numerator/numerator";

export function is_sin(expr: U): expr is Cons1<Sym, U> {
    return is_cons(expr) && is_sym(expr.opr) && is_native(expr.opr, Native.sin);
}

export function is_cos(expr: U): expr is Cons1<Sym, U> {
    return is_cons(expr) && is_sym(expr.opr) && is_native(expr.opr, Native.cos);
}

function parse_args(expr: Cons, $: ExtensionEnv): [x: U, y: U] {
    const argList = expr.argList;
    try {
        switch (argList.length) {
            case 1: {
                return [$.valueOf(argList.item0), nil];
            }
            case 2: {
                // arctan(y,x) means x is item1, y is item0
                return [$.valueOf(argList.item1), $.valueOf(argList.item0)];
            }
            default:
                return [nil, nil];
        }
    } finally {
        argList.release();
    }
}

/**
 * (arctan x) or (arctan y x)
 */
export function eval_arctan(expr: Cons, $: ExtensionEnv): U {
    const [x, y] = parse_args(expr, $);
    if (y.isnil) {
        return arctan(x, $);
    } else {
        return arctan2(y, x, $);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * The arctan2 function measures the counterclockwise angle θ, in radians, between the positive x-axis and the point (x, y).
 * Note that the arguments to this function pass the y-coordinate first and the x-coordinate second.
 * @param y The coordinate of the point.
 * @param x The coordinate of the point.
 * @param _
 * @returns the angle in the plane (in radians) between the positive x-axis and the ray from (0,0) to the point(x,y).
 * The angle is in the rsange -pi to pi, inclusive. Thus we measure the counterclockwise angle.
 */
function arctan2(y: U, x: U, _: ExtensionEnv): U {
    // console.lg("arctan2", $.toInfixString(y), $.toInfixString(x));

    if (is_tensor(y)) {
        return y.map((e) => arctan2(e, x, _));
    }

    if (is_num(x) && is_num(y)) {
        return arctan_numbers(x, y, _);
    }

    // arctan(z) = -1/2 i log((i - z) / (i + z))
    if (!iszero(x, _) && (isdoublez(x) || isdoublez(y))) {
        const z = _.divide(y, x);
        const i_minus_z = _.subtract(imu, z);
        const i_plus_z = _.add(imu, z);
        const arg = _.divide(i_minus_z, i_plus_z);
        const s = items_to_cons(native_sym(Native.log), arg);
        return items_to_cons(native_sym(Native.multiply), create_rat(-1, 2), imu, s);
    }

    // arctan(-y,x) = -arctan(y,x)
    if (isnegativeterm(y)) {
        return _.negate(items_to_cons(native_sym(Native.arctan), _.negate(y), x));
    }

    if (is_cons(y) && is_sym(y.opr) && is_native(y.opr, Native.tan) && isplusone(x)) {
        // x of tan(x). y has already been evaluated so there is no need for evaluation.
        return y.arg;
    }

    return items_to_cons(native_sym(Native.arctan), y, x);
}

function arctan_numbers(x: Num, y: Num, _: ExtensionEnv): U {
    const $ = new StackU();
    eigenmath_arctan_numbers(x, y, _, _, $);
    return $.pop();
}

/**
 *
 * @param x
 * @param $
 * @returns the inverse tangent of a number, the unique y in [-pi/2, pi/2] such that tan(y) = x.
 */
function arctan(x: U, $: ExtensionEnv): U {
    // console.lg("arctan", $.toInfixString(x), "expanding", $.isExpanding());
    if (car(x).equals(TAN)) {
        return cadr(x);
    }

    if (is_flt(x)) {
        return create_flt(Math.atan(x.d));
    }

    if ($.iszero(x)) {
        return zero;
    }

    if (is_negative(x)) {
        return $.negate($.arctan($.negate(x)));
    }

    // arctan(sin(x)/cos(x)) --> x
    if (x.contains(SIN) && x.contains(COS)) {
        const numer = numerator(x, $);
        const denom = denominator(x, $);
        if (is_sin(numer) && is_cos(denom)) {
            const x = numer.arg;
            if (x.equals(denom.arg)) {
                return x;
            }
        }
    }

    // arctan(1/sqrt(3)) -> pi/6
    // second if catches the other way of saying it, sqrt(3)/3
    if (
        (is_power(x) && equaln(cadr(x), 3) && is_num_and_equalq(caddr(x), -1, 2)) ||
        (is_multiply(x) && is_num_and_equalq(car(cdr(x)), 1, 3) && car(car(cdr(cdr(x)))).equals(POWER) && equaln(car(cdr(car(cdr(cdr(x))))), 3) && is_num_and_equalq(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2))
    ) {
        return $.multiply(rational(1, 6), $.getDirective(Directive.evaluatingAsFloat) ? piAsFlt : MATH_PI);
    }

    // arctan(1) -> pi/4
    if (equaln(x, 1)) {
        return $.multiply(rational(1, 4), DynamicConstants.PI($));
    }

    // arctan(sqrt(3)) -> pi/3
    if (is_power(x) && equaln(cadr(x), 3) && is_num_and_equalq(caddr(x), 1, 2)) {
        return $.multiply(third, DynamicConstants.PI($));
    }

    // Construct but don't evaluate.
    return items_to_cons(ARCTAN, x);
}
