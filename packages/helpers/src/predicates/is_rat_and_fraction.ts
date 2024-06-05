import { is_rat, Rat } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

/**
 *
 */
export function is_rat_and_fraction(p: U): p is Rat {
    return is_rat(p) && p.isFraction();
}
