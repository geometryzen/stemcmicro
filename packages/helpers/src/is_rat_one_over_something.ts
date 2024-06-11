import { is_rat } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

export function is_rat_one_over_something(p: U): boolean {
    return is_rat(p) && p.isFraction() && p.a.abs().equals(1);
}
