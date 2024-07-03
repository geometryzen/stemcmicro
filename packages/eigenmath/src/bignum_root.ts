import { BigInteger } from "@stemcmicro/atoms";
// returns null if not perfect root, otherwise returns u^(1/v)

export function bignum_root(u: BigInteger, v: BigInteger): BigInteger | null {
    return u.pow(new BigInteger(BigInt(1)).divide(v));
}
