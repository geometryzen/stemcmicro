import { Cons } from "math-expression-tree";

export function is_nonop(expr: Cons): boolean {
    return expr.length === 1;
}
