import { Rat } from "@stemcmicro/atoms";

/**
 * @deprecated Use x.isInteger() instead.
 */
export function isinteger(x: Rat): boolean {
    return x.isInteger();
}
