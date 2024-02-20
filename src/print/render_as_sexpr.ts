import { ExprContext } from "math-expression-context";
import { car, cdr, is_atom, is_cons, nil, U } from "math-expression-tree";
import { PrintConfig } from "./print";

/**
 * The standard way of serializing to s-expr format.
 * @param expr The expression to be rendered.
 * @param $ The extension environment.
 */
export function render_as_sexpr(expr: U, $: PrintConfig): string {
    if (is_cons(expr)) {
        let str = '';
        str += '(';
        str += render_as_sexpr(car(expr), $);
        expr = cdr(expr);
        while (is_cons(expr)) {
            str += ' ';
            str += render_as_sexpr(car(expr), $);
            expr = cdr(expr);
        }
        if (expr !== nil) {
            str += ' . ';
            str += render_as_sexpr(expr, $);
        }
        str += ')';
        return str;
    }
    else if (is_atom(expr)) {
        const handler = $.handlerFor(expr);
        // FIXME: casting
        return handler.toListString(expr, $ as unknown as ExprContext);
    }
    else if (expr.isnil) {
        const handler = $.handlerFor(expr);
        // FIXME: casting
        return handler.toListString(expr, $ as unknown as ExprContext);
    }
    else {
        throw new Error();
    }
}
