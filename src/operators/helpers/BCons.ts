import { Cons, U } from "math-expression-tree";
import { UCons } from "./UCons";

export interface BCons<O extends U, L extends U, R extends U> extends Cons {
    head: O;
    opr: O;
    lhs: L;
    rhs: R;
    base: L;
    expo: R;
    argList: UCons<L, R>
}
