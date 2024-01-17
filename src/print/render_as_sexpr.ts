import { car, cdr, is_atom, is_cons, is_nil, nil, U } from "math-expression-tree";
import { ExtensionEnv } from "../env/ExtensionEnv";

/**
 * The standard way of serializing to s-expr format.
 * @param expr The expression to be rendered.
 * @param $ The extension environment.
 */
export function render_as_sexpr(expr: U, $: ExtensionEnv): string {
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
        return $.toSExprString(expr);
    }
    else if (is_nil(expr)) {
        return $.toSExprString(expr);
    }
    else {
        throw new Error();
    }
}
