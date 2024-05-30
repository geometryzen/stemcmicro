import { U } from "math-expression-tree";
import { isequaln } from "./isequaln";

export function isminusone(p: U): boolean {
    // Optimize by avoiding object creation...
    /*
    if (is_rat(p)) {
        return p.isMinusOne();
    }
    */
    const retval = isequaln(p, -1);
    return retval;
}
