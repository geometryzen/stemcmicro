import { is_rat } from "../operators/rat/is_rat";
import { Rat } from "../tree/rat/Rat";
import { U } from "../tree/tree";

export function is_positive_integer(p: U): p is Rat & { __ts_integer: true; __ts_sign: 1 } {
    return is_rat(p) && p.isPositiveInteger();
}
