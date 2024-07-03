import { BigInteger } from "@stemcmicro/atoms";

export function bignum_pow(u: BigInteger, v: BigInteger): BigInteger {
    if (v.isNegative()) {
        throw new Error(`bignum_pow(u=${u}, v=${v}): v must be positive.`);
    }
    const result = u.pow(v);
    return result;
}
