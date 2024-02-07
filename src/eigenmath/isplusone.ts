import { U } from "math-expression-tree";
import { isequaln } from "./isequaln";

export function isplusone(expr: U): boolean {
    return isequaln(expr, 1);
}
