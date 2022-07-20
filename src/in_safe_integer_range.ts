import bigInt from 'big-integer';

export function in_safe_integer_range(a: bigInt.BigInteger): boolean {
    return a.geq(Number.MIN_SAFE_INTEGER) && a.leq(Number.MAX_SAFE_INTEGER);
}
