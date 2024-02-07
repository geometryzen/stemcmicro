import { cdr, is_cons, U } from "math-expression-tree";

export function lengthf(p: U): number {
    let n = 0;
    while (is_cons(p)) {
        n++;
        p = cdr(p);
    }
    return n;
}
