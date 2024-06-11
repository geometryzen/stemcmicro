import { car, cdr, is_cons, U } from "@stemcmicro/tree";
import { isdenominator } from "./isdenominator";

export function count_denominators(p: U): number {
    let n = 0;
    p = cdr(p);
    while (is_cons(p)) {
        if (isdenominator(car(p))) {
            n++;
        }
        p = cdr(p);
    }
    return n;
}
