import { ExtensionEnv } from '../../env/ExtensionEnv';
import { cons, is_cons, U } from '../../tree/tree';

export function subst(expr: U, oldExpr: U, newExpr: U, $: ExtensionEnv): U {
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
                return cons(new_car, new_cdr);
            }
            else {
                return cons(new_car, cdr_expr);
            }
        }
        else {
            if (replace_cdr) {
                const new_cdr = subst(cdr_expr, oldExpr, newExpr, $);
                return cons(car_expr, new_cdr);
            }
            else {
                return expr;
            }
        }
    }
    else {
        const op = $.operatorFor(expr);
        return op.subst(expr, oldExpr, newExpr);
    }
}
