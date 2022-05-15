import { Cons, U } from "../../tree/tree";

export interface BCons<O extends U, L extends U, R extends U> extends Cons {
    opr: O;
    lhs: L;
    rhs: R;
}
