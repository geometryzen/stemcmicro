import { Cons, U } from "../../tree/tree";

export interface UCons<O extends U, A extends U> extends Cons {
    head: O;
    opr: O;
    arg: A;
    argList: NCons<A>
}

export interface NCons<O extends U> extends Cons {
    head: O;
    opr: O;
    argList: Cons;
}
