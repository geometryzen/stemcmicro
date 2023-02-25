import { args } from "../calculators/args";
import { ExtensionEnv } from "../env/ExtensionEnv";
import { is_sym } from "../operators/sym/is_sym";
import { Sym } from "../tree/sym/Sym";
import { Cons, is_cons, U } from "../tree/tree";

/**
 * matches expr: Cons(Sym, Cons(*, *)) and car(exp) equals symbol(num)
 * TODO: Change the type of expr to Cons so that consumers don't accidentally try to test other things.
 * They can then do is_cons(expr) ? match(..) : void 0
 */
export function match_binop(op: Sym, expr: Cons, $: ExtensionEnv): { lhs: U, rhs: U } | undefined {
    const car_expr = expr.car;
    if (is_sym(car_expr) && op.equals(car_expr)) {
        const cdr_expr = expr.cdr;
        if (is_cons(cdr_expr)) {
            const car_cdr_expr = cdr_expr.car;
            const cdr_cdr_expr = cdr_expr.cdr;
            if (is_cons(cdr_cdr_expr)) {
                const args_cdr_cdr_expr = args(cdr_cdr_expr, $);
                if (args_cdr_cdr_expr.length === 1) {
                    return { lhs: car_cdr_expr, rhs: args_cdr_cdr_expr[0] };
                }
            }
        }
    }
    return void 0;
}
