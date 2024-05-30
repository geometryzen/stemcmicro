import { Cons, is_cons } from "@stemcmicro/tree";

export function arity(expr: Cons): number {
    const cdr_expr = expr.cdr;
    if (is_cons(cdr_expr)) {
        const cdr_cdr_expr = cdr_expr.cdr;
        if (is_cons(cdr_cdr_expr)) {
            return 1 + arity(cdr_cdr_expr);
        }
        throw new Error(``);
    } else {
        return 1;
    }
}
