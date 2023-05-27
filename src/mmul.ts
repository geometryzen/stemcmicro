import { BigInteger } from './tree/rat/big-integer';

export function mmul(a: BigInteger, b: BigInteger): BigInteger {
    return a.multiply(b);
}

export function mdiv(a: BigInteger, b: BigInteger): BigInteger {
    return a.divide(b);
}
export function mmod(a: BigInteger, b: BigInteger): BigInteger {
    return a.mod(b);
}

// return both quotient and remainder of a/b
// we'd have this method as divmod(number)
// but obviously doesn't change the passed parameters
export function mdivrem(a: BigInteger, b: BigInteger): [quotient: BigInteger, remainder: BigInteger] {
    const toReturn = a.divmod(b);
    return [toReturn.quotient, toReturn.remainder];
}
