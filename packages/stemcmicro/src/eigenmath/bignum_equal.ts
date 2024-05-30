import { BigInteger } from "@stemcmicro/atoms";

export function bignum_equal(u: BigInteger, n: number): boolean {
    return u.eq(n);
}
