import { Cons, U } from "../../tree/tree";
import { UCons } from "./UCons";

export interface BCons<O extends U, L extends U, R extends U> extends Cons {
    head: O;
    opr: O;
    lhs: L;
    rhs: R;
    argList: UCons<L, R>
}
