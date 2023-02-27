import { Cons, nil } from "../tree/tree";

/**
 * Returns true if cdr(expr) is NIL. Since expr is a Cons, that would make it a single item in a Cons list.
 */
export function is_singleton(expr: Cons): boolean {
    if (nil === expr) {
        // Nope, it's the empty list.
        return false;
    }
    const cdr_expr = expr.cdr;
    if (nil === cdr_expr) {
        return true;
    }
    else {
        return false;
    }
}