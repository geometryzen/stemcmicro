import { BigInteger } from "@stemcmicro/atoms";

const MAX_SMALL_INTEGER = new BigInteger(BigInt(Number.MAX_SAFE_INTEGER));
const MIN_SMALL_INTEGER = new BigInteger(BigInt(Number.MIN_SAFE_INTEGER));

export function bignum_issmallnum(u: BigInteger): boolean {
    if (u.geq(MIN_SMALL_INTEGER) && u.leq(MAX_SMALL_INTEGER)) {
        return true;
    } else {
        return false;
    }
}
