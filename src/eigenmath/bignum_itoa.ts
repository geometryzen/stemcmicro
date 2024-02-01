import { BigInteger } from 'math-expression-atoms';
// Previously, this probably did not have a sign
export function bignum_itoa(u: BigInteger): string {
    if (u.isNegative()) {
        return u.negate().toString();
    }
    const str = u.toString();
    return str;
}
