import { BigInteger } from 'big-integer';

// Bignum power
export function mpow(a: BigInteger, n: number | BigInteger): BigInteger {
    return a.pow(n);
}
