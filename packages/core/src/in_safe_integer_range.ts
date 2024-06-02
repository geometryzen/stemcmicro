import { BigInteger } from "@stemcmicro/atoms";

export function in_safe_integer_range(a: BigInteger): boolean {
    return a.geq(Number.MIN_SAFE_INTEGER) && a.leq(Number.MAX_SAFE_INTEGER);
}
