import bigInt from 'big-integer';

export function isSmall(a: bigInt.BigInteger): boolean {
    return a.geq(Number.MIN_SAFE_INTEGER) && a.leq(Number.MAX_SAFE_INTEGER);
}
