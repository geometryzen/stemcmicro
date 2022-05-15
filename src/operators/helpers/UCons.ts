import { Cons, U } from "../../tree/tree";

export interface UCons<O extends U, A extends U> extends Cons {
    opr: O;
    arg: A;
}
