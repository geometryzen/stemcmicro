import { Cons, U } from "math-expression-tree";
import { Cons1 } from "./Cons1";

export interface Cons2<O extends U, L extends U, R extends U> extends Cons {
    head: O;
    opr: O;
    lhs: L;
    rhs: R;
    base: L;
    expo: R;
    argList: Cons1<L, R>
}
