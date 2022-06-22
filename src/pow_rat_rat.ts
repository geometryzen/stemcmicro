import bigInt from 'big-integer';
import { bignum_truncate, makePositive, makeSignSameAs, mp_denominator, mp_numerator } from './bignum';
import { ExtensionEnv } from './env/ExtensionEnv';
import { imu } from './env/imu';
import { is_num_and_eq_minus_one } from './is';
import { isSmall } from './isSmall';
import { is_rat_integer } from './is_rat_integer';
import { makeList } from './makeList';
import { mpow } from './mpow';
import { mroot } from './mroot';
import { nativeInt } from './nativeInt';
import { is_negative_number } from './predicates/is_negative_number';
import { quickfactor } from './quickfactor';
import { POWER } from './runtime/constants';
import { negOne, one, Rat, zero } from './tree/rat/Rat';
import { Sym } from './tree/sym/Sym';
import { Cons, U } from './tree/tree';

// Rational power function
export function pow_rat_rat(base: Rat, expo: Rat, $: ExtensionEnv): Cons | Rat | Sym | U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        return retval;
    };

    //unsigned int a, b, *t, *x, *y

    // if base is 1 or exponent is 0 then return 1
    if (base.isOne() || expo.isZero()) {
        return hook(one, "A");
    }

    // (power -1 1/2) is replaced by the imaginary unit.
    if (base.isMinusOne() && expo.isHalf()) {
        // console.lg(`power(base => ${base}, expo => ${expo}) => i`);
        return hook(imu, "B");
    }

    // console.lg(`power(base => ${base}, expo => ${expo}) => ?`);

    // if base is zero then return 0
    if ($.isZero(base)) {
        if (is_negative_number(expo)) {
            throw new Error(`divide by zero for base => ${base} and exponent => ${expo}`);
        }
        return hook(zero, "D");
    }

    // if exponent is 1 then return base
    if (expo.isOne()) {
        return hook(base, "E");
    }

    let expoJs = 0;
    let x: bigInt.BigInteger | 0;
    let y: bigInt.BigInteger;
    // if exponent is integer then power
    if (is_rat_integer(expo)) {
        expoJs = nativeInt(expo);
        if (isNaN(expoJs)) {
            // expo greater than 32 bits
            return hook(makeList(POWER, base, expo), "F");
        }

        x = mpow(base.a, Math.abs(expoJs));
        y = mpow(base.b, Math.abs(expoJs));
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
    if (is_negative_number(base)) {
        return hook($.multiply(pow_rat_rat($.negate(base) as Rat, expo, $), pow_rat_rat(negOne, expo, $)), "I");
    }

    // if BASE is not an integer then power numerator and denominator
    if (!is_rat_integer(base)) {
        return hook($.multiply(pow_rat_rat(mp_numerator(base), expo, $), pow_rat_rat(mp_denominator(base), $.negate(expo) as Rat, $)), "J");
    }

    // At this point BASE is a positive integer.

    // If BASE is small then factor it.
    if (is_small_integer(base)) {
        return hook(quickfactor(base, expo, $), "K");
    }

    // At this point BASE is a positive integer and EXPO is not an integer.
    if (!isSmall(expo.a) || !isSmall(expo.b)) {
        return hook(makeList(POWER, base, expo), "L");
    }

    const { a, b } = expo;

    x = mroot(base.a, b.toJSNumber());

    if (x === 0) {
        return hook(makeList(POWER, base, expo), "M");
    }

    y = mpow(x, a);

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
function normalize_angle(A: Rat, $: ExtensionEnv): U {
    // integer exponent?
    if (is_rat_integer(A)) {
        if (A.a.isOdd()) {
            return negOne; // odd exponent
        }
        else {
            return one; // even exponent
        }
    }

    // floor
    let Q = bignum_truncate(A);
    if (is_negative_number(A)) {
        Q = Q.add(negOne);
    }

    // remainder (always positive)
    // TODO: Need a sub on Rat
    const R = $.subtract(A, Q);

    // remainder becomes new angle
    let result: U = makeList(POWER, negOne, R);

    // negate if quotient is odd
    if (Q.a.isOdd()) {
        result = $.negate(result);
    }
    return result;
}

function is_small_integer(p: Rat): boolean {
    return isSmall(p.a);
}
