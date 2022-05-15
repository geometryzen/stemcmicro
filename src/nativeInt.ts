import { isSmall } from "./isSmall";
import { is_rat_integer } from "./is_rat_integer";
import { is_flt } from "./tree/flt/is_flt";
import { is_rat } from "./tree/rat/is_rat";
import { U } from "./tree/tree";

export function nativeInt(p1: U): number {
    let n = NaN;
    if (is_rat(p1)) {
        if (is_rat_integer(p1) && isSmall(p1.a)) {
            n = p1.a.toJSNumber();
        }
    }
    else if (is_flt(p1)) {
        if (Math.floor(p1.d) === p1.d) {
            n = p1.d;
        }
    }
    return n;
}
