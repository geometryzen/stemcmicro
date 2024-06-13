import { ExprContext } from "@stemcmicro/context";
import { str_to_string } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { car, cdr, is_atom, is_cons, nil, U } from "@stemcmicro/tree";
import { PrintConfig } from "./print";

/**
 * The standard way of serializing to s-expr format.
 * @param expr The expression to be rendered.
 * @param $ The extension environment.
 */
export function render_as_sexpr(expr: U, $: PrintConfig): string {
    if (is_cons(expr)) {
        let str = "";
        str += "(";
        str += render_as_sexpr(car(expr), $);
        expr = cdr(expr);
        while (is_cons(expr)) {
            str += " ";
            str += render_as_sexpr(car(expr), $);
            expr = cdr(expr);
        }
        if (expr !== nil) {
            str += " . ";
            str += render_as_sexpr(expr, $);
        }
        str += ")";
        return str;
    } else if (is_atom(expr)) {
        const handler = $.handlerFor(expr);
        // FIXME: casting
        const retval = handler.dispatch(expr, native_sym(Native.sexpr), nil, $ as unknown as ExprContext);
        try {
            return str_to_string(retval);
        } finally {
            retval.release();
        }
    } else if (expr.isnil) {
        const handler = $.handlerFor(expr);
        // FIXME: casting
        return str_to_string(handler.dispatch(expr, native_sym(Native.sexpr), nil, $ as unknown as ExprContext));
    } else {
        throw new Error();
    }
}
