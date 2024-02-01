import { is_rat, Rat } from "math-expression-atoms";
import { bignum_equal } from "./bignum_equal";

export function isinteger(p: Rat): boolean {
    return is_rat(p) && bignum_equal(p.b, 1);
}
