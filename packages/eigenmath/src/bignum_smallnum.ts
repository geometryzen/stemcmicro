import { BigInteger } from "@stemcmicro/atoms";

export function bignum_smallnum(u: BigInteger): number {
    return u.toJSNumber();
}
