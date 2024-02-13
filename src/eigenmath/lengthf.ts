import { cdr, is_cons, U } from "math-expression-tree";

/**
 * Beware! atoms and nil will return zero. 
 */
export function lengthf(expr: U): number {
    let n = 0;
    while (is_cons(expr)) {
        n++;
        expr = cdr(expr);
    }
    return n;
}
