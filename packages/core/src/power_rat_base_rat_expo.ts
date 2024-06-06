import { bigInt, BigInteger, imu, negOne, one, Rat, Sym, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { Directive } from "@stemcmicro/directive";
import { is_num_and_negative, is_rat_and_integer, is_safe_integer_range, multiply, negate, num_to_number, subtract } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, items_to_cons, U } from "@stemcmicro/tree";
import { bignum_truncate, makePositive, makeSignSameAs } from "./bignum";
import { exp } from "./helpers/exp";
import { is_num_and_eq_minus_one } from "./is";
import { mroot } from "./mroot";
import { quickfactor } from "./quickfactor";
import { half } from "./tree/rat/Rat";

export const E = native_sym(Native.E);
export const EXP = native_sym(Native.exp);
export const PI = native_sym(Native.PI);
export const POWER = native_sym(Native.pow);

// Rational power function
export function power_rat_base_rat_expo(base: Rat, expo: Rat, $: ExprContext): Cons | Rat | Sym | U {
    // console.lg("power_rat_base_rat_expo", `${base}`, `${expo}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg("pow_rat_base_rat_expo", "base", $.toInfixString(base), "expo", $.toInfixString(expo), "retval", $.toInfixString(retval), description);
        return retval;
    };

    //unsigned int a, b, *t, *x, *y

    // if base is 1 or exponent is 0 then return 1
    if (base.isOne() || expo.isZero()) {
        return hook(one, "A");
    }

    // (pow -1 1/2) is recognized as being the imaginary unit, but we transform according to how complex numbers are being handled.
    if (base.isMinusOne() && expo.isHalf()) {
        if ($.getDirective(Directive.complexAsClock)) {
            return hook(items_to_cons(POWER, base, expo), "B-clock");
        } else if ($.getDirective(Directive.complexAsPolar)) {
            const x = multiply($, half, imu, PI);
            const expX = exp(x, $);
            return hook(expX, "B-power");
        } else {
            return hook(imu, "B");
        }
    }

    // console.lg(`power(base => ${base}, expo => ${expo}) => ?`);

    // if base is zero then return 0
    if (base.isZero()) {
        if (is_num_and_negative(expo)) {
            const err = diagnostic(Diagnostics.Division_by_zero);
            try {
                return hook(err, "D0");
            } finally {
                err.release();
            }
        }
        return hook(zero, "D");
    }

    // if exponent is 1 then return base
    if (expo.isOne()) {
        return hook(base, "E");
    }

    let expoJs = 0;
    let x: BigInteger | 0;
    let y: BigInteger;
    // if exponent is integer then power
    if (is_rat_and_integer(expo)) {
        expoJs = num_to_number(expo);
        if (isNaN(expoJs)) {
            // expo greater than 32 bits
            return hook(items_to_cons(POWER, base, expo), "F");
        }

        x = base.a.pow(Math.abs(expoJs));
        y = base.b.pow(Math.abs(expoJs));
        if (expoJs < 0) {
            const t = x;
            x = y;
            y = t;
            x = makeSignSameAs(x, y);
            y = makePositive(y);
        }

        return hook(new Rat(x, y), "G");
    }

    // from here on out the exponent is NOT an integer

    // if base is -1 then normalize polar angle
    if (is_num_and_eq_minus_one(base)) {
        return hook(normalize_angle(expo, $), "H");
    }

    // if base is negative then (-N)^M -> N^M * (-1)^M
    if (is_num_and_negative(base)) {
        return hook(multiply($, power_rat_base_rat_expo(base.neg(), expo, $), power_rat_base_rat_expo(negOne, expo, $)), "I");
    }

    // if base is not an integer then power numerator and denominator
    if (!is_rat_and_integer(base)) {
        // (m/n)^a = m^a * n^(-a)
        const m = base.numer();
        const n = base.denom();
        const a = expo;
        const pow_m_a = power_rat_base_rat_expo(m, a, $);
        const minus_a = a.neg();
        const pow_n_minus_a = power_rat_base_rat_expo(n, minus_a, $);
        return hook(multiply($, pow_m_a, pow_n_minus_a), "J");
    }

    // At this point base is a positive integer.

    // If base is small then factor it.
    if (is_small_integer(base)) {
        return hook(quickfactor(base, expo, $), "K");
    }

    // At this point base is a positive integer and EXPO is not an integer.
    if (!is_safe_integer_range(expo.a) || !is_safe_integer_range(expo.b)) {
        return hook(items_to_cons(POWER, base, expo), "L");
    }

    const { a, b } = expo;

    x = mroot(base.a, b.toJSNumber());

    if (x === 0) {
        return hook(items_to_cons(POWER, base, expo), "M");
    }

    y = x.pow(a);

    return hook(expo.a.isNegative() ? new Rat(bigInt.one, y) : new Rat(y, bigInt.one), "N");
}

//-----------------------------------------------------------------------------
//
//  Normalize the angle of unit imaginary, i.e. (-1) ^ N
//
//  Input:    N on stack (must be rational, not float)
//
//  Output:    Result on stack
//
//  Note:
//
//  n = q * d + r
//
//  Example:
//            n  d  q  r
//
//  (-1)^(8/3)  ->   (-1)^(2/3)  8  3  2  2
//  (-1)^(7/3)  ->   (-1)^(1/3)  7  3  2  1
//  (-1)^(5/3)  ->  -(-1)^(2/3)  5  3  1  2
//  (-1)^(4/3)  ->  -(-1)^(1/3)  4  3  1  1
//  (-1)^(2/3)  ->   (-1)^(2/3)  2  3  0  2
//  (-1)^(1/3)  ->   (-1)^(1/3)  1  3  0  1
//
//  (-1)^(-1/3)  ->  -(-1)^(2/3)  -1  3  -1  2
//  (-1)^(-2/3)  ->  -(-1)^(1/3)  -2  3  -1  1
//  (-1)^(-4/3)  ->   (-1)^(2/3)  -4  3  -2  2
//  (-1)^(-5/3)  ->   (-1)^(1/3)  -5  3  -2  1
//  (-1)^(-7/3)  ->  -(-1)^(2/3)  -7  3  -3  2
//  (-1)^(-8/3)  ->  -(-1)^(1/3)  -8  3  -3  1
//
//-----------------------------------------------------------------------------

function normalize_angle(A: Rat, $: ExprContext): U {
    // integer exponent?
    if (is_rat_and_integer(A)) {
        if (A.a.isOdd()) {
            return negOne; // odd exponent
        } else {
            return one; // even exponent
        }
    }

    // floor
    let Q = bignum_truncate(A);
    if (is_num_and_negative(A)) {
        Q = Q.add(negOne);
    }

    // remainder (always positive)
    // TODO: Need a sub on Rat
    const R = subtract($, A, Q);

    // remainder becomes new angle
    let result: U = items_to_cons(POWER, negOne, R);

    // negate if quotient is odd
    if (Q.a.isOdd()) {
        result = negate($, result);
    }
    return result;
}

function is_small_integer(p: Rat): boolean {
    return is_safe_integer_range(p.a);
}
