import bigInt from 'big-integer';
import { mdiv, mmul } from './mmul';
import { mpow } from './mpow';
import { nativeInt } from './nativeInt';
import { is_num } from './operators/num/is_num';
import { halt } from './runtime/defs';
import { stack_pop, stack_push } from './runtime/stack';
import { create_flt, Flt } from './tree/flt/Flt';
import { is_flt } from './operators/flt/is_flt';
import { Num } from './tree/num/Num';
import { is_rat } from './operators/rat/is_rat';
import { one, Rat } from './tree/rat/Rat';
import { U } from './tree/tree';

export function mint(a: number): bigInt.BigInteger {
    return bigInt(a);
}

export function makePositive(a: bigInt.BigInteger): bigInt.BigInteger {
    if (a.isNegative()) {
        return a.multiply(bigInt(-1));
    }
    return a;
}

export function makeSignSameAs(a: bigInt.BigInteger, b: bigInt.BigInteger): bigInt.BigInteger {
    if (a.isPositive()) {
        if (b.isNegative()) {
            return a.multiply(bigInt(-1));
        }
    }
    else {
        // a is negative
        if (b.isPositive()) {
            return a.multiply(bigInt(-1));
        }
    }
    return a;
}

export function setSignTo(a: bigInt.BigInteger, b: 1 | -1 | 0): bigInt.BigInteger {
    if (a.isPositive()) {
        if (b < 0) {
            return a.multiply(bigInt(-1));
        }
    }
    else {
        // a is negative
        if (b > 0) {
            return a.multiply(bigInt(-1));
        }
    }
    return a;
}

/**
 * TODO: Move to the NumExtension
 */
export function divide_numbers(lhs: Num, rhs: Num): Num {
    if (is_rat(lhs) && is_rat(rhs)) {
        return lhs.div(rhs);
    }

    if (rhs.isZero()) {
        throw new Error('divide by zero');
    }

    const a = is_flt(lhs) ? lhs.d : lhs.toNumber();
    const b = is_flt(rhs) ? rhs.d : rhs.toNumber();

    return create_flt(a / b);
}

/**
 * Move to NumExtension
 */
export function invert_number(p1: Num): Num {
    if (p1.isZero()) {
        // TODO: This error could/should be part of the inv() methods?
        throw new Error('divide by zero');
    }

    if (is_flt(p1)) {
        return p1.inv();
    }

    if (is_rat(p1)) {
        return p1.inv();
    }

    throw new Error();
}

export function bignum_truncate(p1: Rat): Rat {
    const a = mdiv(p1.a, p1.b);
    return new Rat(a, bigInt.one);
}

export function mp_numerator(p1: U): Rat {
    if (is_rat(p1)) {
        return p1.numer();
    }
    else {
        return one;
    }
}

export function mp_denominator(p1: U): Rat {
    if (is_rat(p1)) {
        return p1.denom();
    }
    else {
        return one;
    }
}

// expo is an integer
export function bignum_power_number(base: Rat, expo: number): Rat {
    let a = mpow(base.a, Math.abs(expo));
    let b = mpow(base.b, Math.abs(expo));

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
    const result =
        a_div_b.quotient.toJSNumber() +
        a_div_b.remainder.toJSNumber() / p.b.toJSNumber();

    return result;
}

/*
export function integer(n: number): Num {
  return new Num(bigInt(n));
}
*/

export function push_rational(a: number | bigInt.BigInteger, b: number | bigInt.BigInteger): void {
    stack_push(rational(a, b));
}

export function rational(a: number | bigInt.BigInteger, b: number | bigInt.BigInteger): Rat {
    // `as any as number` cast added because bigInt(number) and bigInt(bigInt.BigInteger)
    // are both accepted signatures, but bigInt(number|bigInt.BigInteger) is not
    return new Rat(bigInt((a as unknown) as number), bigInt((b as unknown) as number));
}

export function pop_integer(): number {
    const p1 = stack_pop();
    return nativeInt(p1);
}

export function pop_double(): number {
    const p1 = stack_pop();
    return nativeDouble(p1);
}

export function nativeDouble(p1: U): number {
    if (is_rat(p1)) {
        return p1.toNumber();
    }
    else if (is_flt(p1)) {
        return p1.toNumber();
    }
    else {
        return 0;
    }
}

export function pop_number(): Num {
    const n = stack_pop();
    if (!is_num(n)) {
        halt('not a number');
    }
    return n;
}


export function rat_to_flt(n: Rat): Flt {
    const d = n.toNumber();
    return create_flt(d);
}

//static unsigned int *__factorial(int)

// n is an int
export function bignum_factorial(n: number): Rat {
    return new Rat(__factorial(n), bigInt.one);
}

// n is an int
function __factorial(n: number): bigInt.BigInteger {
    let a: bigInt.BigInteger;
    // unsigned int *a, *b, *t

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

/*
const mask = [
  0x00000001,
  0x00000002,
  0x00000004,
  0x00000008,
  0x00000010,
  0x00000020,
  0x00000040,
  0x00000080,
  0x00000100,
  0x00000200,
  0x00000400,
  0x00000800,
  0x00001000,
  0x00002000,
  0x00004000,
  0x00008000,
  0x00010000,
  0x00020000,
  0x00040000,
  0x00080000,
  0x00100000,
  0x00200000,
  0x00400000,
  0x00800000,
  0x01000000,
  0x02000000,
  0x04000000,
  0x08000000,
  0x10000000,
  0x20000000,
  0x40000000,
  0x80000000,
];
*/

// unsigned int *x, unsigned int k
/*
function mp_clr_bit(x: bigInt.BigInteger, k: number) {
  console.lg('not implemented yet');
  breakpoint;
  return (x[k / 32] &= ~mask[k % 32]);
}
*/
