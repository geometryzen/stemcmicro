import { is_singleton } from "../predicates/is_singleton";
import { is_cons, U } from "../tree/tree";

export function singularize(expr: U): U {
    if (is_cons(expr)) {
        if (is_singleton(expr)) {
            return singularize(expr.car);
        } else {
            // We can't go any further.
            return expr;
        }
    } else {
        // You can't unwrap something that is not a Cons.
        // This also handles the NIL case.
        return expr;
    }
}
