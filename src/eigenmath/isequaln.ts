import { U } from "math-expression-tree";
import { isequalq } from "./isequalq";

export function isequaln(p: U, n: number): boolean {
    return isequalq(p, n, 1);
}
