
import { ExtensionEnv } from "../env/ExtensionEnv";
import { is_sym } from "../operators/sym/is_sym";
import { Cons, is_cons, NIL, U } from "../tree/tree";

/**
 * Unpacks a Cons expression into an array.
 * The first element of the array is car(expr) or expr.car.
 * The remaining elements
 * @param expr 
 * @param $ 
 * @returns 
 */
export function args(expr: Cons, $: ExtensionEnv): U[] {
    const car_expr = expr.car;
    if (is_cons(car_expr)) {
        const cdr_expr = expr.cdr;
        if (is_cons(cdr_expr)) {
            return [car_expr, ...args(cdr_expr, $)];
        }
        else if (NIL === cdr_expr) {
            return [car_expr];
        }
        throw new Error();
    }
    else if (is_sym(car_expr)) {
        const cdr_expr = expr.cdr;
        if (is_cons(cdr_expr)) {
            return [car_expr, ...args(cdr_expr, $)];
        }
        else if (NIL === cdr_expr) {
            return [car_expr];
        }
    }
    else {
        // car_expr is an extension type.
        const cdr_expr = expr.cdr;
        if (is_cons(cdr_expr)) {
            return [car_expr, ...args(cdr_expr, $)];
        }
        else if (NIL === cdr_expr) {
            return [car_expr];
        }
    }
    throw new Error();
}
