import { car, cdr, is_cons, nil, U } from "math-expression-tree";
import { ExtensionEnv } from "../env/ExtensionEnv";

/**
 * The standard way of serializing to s-expr format.
 * @param expr The expression to be rendered.
 * @param $ The extension environment.
 */
export function render_as_sexpr(expr: U, $: ExtensionEnv): string {
    // console.lg(`render_as_sexpr ${JSON.stringify(expr)}`);
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
    return $.toSExprString(expr);
}
