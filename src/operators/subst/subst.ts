import { assert_cons_or_nil, cons, is_cons, U } from 'math-expression-tree';
import { ExtensionEnv } from '../../env/ExtensionEnv';

/**
 * BEWARE: The order of parameters does not match the scripting language which is (subst newExpr, oldExpr, expr).
 * There is no evaluation performed; the ExtensionEnv is used to recurse into atoms.
 * @param expr 
 * @param oldExpr 
 * @param newExpr
 */
export function subst(expr: U, oldExpr: U, newExpr: U, $: Pick<ExtensionEnv, 'operatorFor'>): U {
    if (expr.equals(oldExpr)) {
        return newExpr;
    }
    if (is_cons(expr)) {
        const car_expr = expr.car;
        const cdr_expr = expr.cdr;
        const replace_car = car_expr.contains(oldExpr);
        const replace_cdr = cdr_expr.contains(oldExpr);
        if (replace_car) {
            const new_car = subst(car_expr, oldExpr, newExpr, $);
            if (replace_cdr) {
                const new_cdr = subst(cdr_expr, oldExpr, newExpr, $);
                return cons(new_car, assert_cons_or_nil(new_cdr));
            }
            else {
                return cons(new_car, cdr_expr);
            }
        }
        else {
            if (replace_cdr) {
                const new_cdr = subst(cdr_expr, oldExpr, newExpr, $);
                return cons(car_expr, assert_cons_or_nil(new_cdr));
            }
            else {
                return expr;
            }
        }
    }
    else {
        const op = $.operatorFor(expr);
        if (op) {
            return op.subst(expr, oldExpr, newExpr);
        }
        else {
            return expr;
        }
    }
}
