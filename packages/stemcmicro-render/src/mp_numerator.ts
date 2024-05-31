import { is_rat, one, Rat } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

export function mp_numerator(x: U): Rat {
    if (is_rat(x)) {
        return x.numer();
    } else {
        return one;
    }
}
