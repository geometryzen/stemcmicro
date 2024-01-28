import { Cons, U } from "math-expression-tree";

export interface Cons1<O extends U, A extends U> extends Cons {
    head: O;
    opr: O;
    arg: A;
    argList: ConsN<A>
}

export interface ConsN<O extends U> extends Cons {
    head: O;
    opr: O;
    argList: Cons;
}
