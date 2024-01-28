import { Cons, U } from "math-expression-tree";
import { Cons1 } from "./Cons1";

export interface Cons3<O extends U, A extends U, B extends U, C extends U> extends Cons {
    head: O;
    opr: O;
    lhs: A;
    rhs: B;
    base: A;
    expo: B;
    argList: Cons1<B, C>
}
