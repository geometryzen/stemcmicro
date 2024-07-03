import { BigInteger } from "@stemcmicro/atoms";

export function bignum_int(n: number): BigInteger {
    return new BigInteger(BigInt(n));
}
