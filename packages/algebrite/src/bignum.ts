import { bigInt, BigInteger, Err, is_flt, is_rat, Num, Rat } from "@stemcmicro/atoms";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { U } from "@stemcmicro/tree";
import { mdiv, mmul } from "./mmul";
import { ProgrammingError } from "./programming/ProgrammingError";

export function mint(a: number): BigInteger {
    return bigInt(a);
}

export function makePositive(a: BigInteger): BigInteger {
    if (a.isNegative()) {
        return a.multiply(bigInt(-1));
    }
    return a;
}

export function makeSignSameAs(a: BigInteger, b: BigInteger): BigInteger {
    if (a.isPositive()) {
        if (b.isNegative()) {
            return a.multiply(bigInt(-1));
        }
    } else {
        // a is negative
        if (b.isPositive()) {
            return a.multiply(bigInt(-1));
        }
    }
    return a;
}

export function setSignTo(a: BigInteger, b: 1 | -1 | 0): BigInteger {
    if (a.isPositive()) {
        if (b < 0) {
            return a.multiply(bigInt(-1));
        }
    } else {
        // a is negative
        if (b > 0) {
            return a.multiply(bigInt(-1));
        }
    }
    return a;
}

/**
 * Move to NumExtension
 */
export function invert_number(x: Num): Num | Err {
    if (x.isZero()) {
        return diagnostic(Diagnostics.Division_by_zero);
    }

    if (is_flt(x)) {
        return x.inv();
    }

    if (is_rat(x)) {
        return x.inv();
    }

    throw new ProgrammingError();
}

export function bignum_truncate(p1: Rat): Rat {
    const a = mdiv(p1.a, p1.b);
    return new Rat(a, bigInt.one);
}

// expo is an integer
export function bignum_power_number(base: Rat, expo: number): Rat {
    const abs_expo = Math.abs(expo);
    let a = base.a.pow(abs_expo);
    let b = base.b.pow(abs_expo);

    if (expo < 0) {
        // swap a and b
        const t = a;
        a = b;
        b = t;

        a = makeSignSameAs(a, b);
        b = setSignTo(b, 1);
    }

    return new Rat(a, b);
}

export function convert_rat_to_number(p: Rat): number {
    const a_div_b = p.a.divmod(p.b);
    const result = a_div_b.quotient.toJSNumber() + a_div_b.remainder.toJSNumber() / p.b.toJSNumber();
    return result;
}

export function rational(a: number | BigInteger, b: number | BigInteger): Rat {
    // `as any as number` cast added because bigInt(number) and bigInt(BigInteger)
    // are both accepted signatures, but bigInt(number|BigInteger) is not
    return new Rat(bigInt(a as unknown as number), bigInt(b as unknown as number));
}

export function nativeDouble(p1: U): number {
    if (is_rat(p1)) {
        return p1.toNumber();
    } else if (is_flt(p1)) {
        return p1.toNumber();
    } else {
        return 0;
    }
}

// n is an int
export function bignum_factorial(n: number): Rat {
    return new Rat(__factorial(n), bigInt.one);
}

// n is an int
function __factorial(n: number): BigInteger {
    let a: BigInteger;

    if (n === 0 || n === 1) {
        a = bigInt(1);
        return a;
    }

    a = bigInt(2);

    let b = bigInt(0);

    if (3 <= n) {
        for (let i = 3; i <= n; i++) {
            b = bigInt(i);
            a = mmul(a, b);
        }
    }

    return a;
}
