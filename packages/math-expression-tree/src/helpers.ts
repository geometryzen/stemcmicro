import { Cons, U } from "./tree";

export interface Cons0<O extends U> extends Cons {
    head: O;
    opr: O;
    item0: O;
}

export interface Cons1<O extends U, A extends U> extends Cons0<O> {
    arg: A;
    base: A;
    lhs: A;
    argList: Cons0<A>;
    item1: A;
}

export interface Cons2<O extends U, A extends U, B extends U> extends Cons1<O, A> {
    rhs: B;
    expo: B;
    argList: Cons1<A, B>;
    item2: B;
}

export interface Cons3<O extends U, A extends U, B extends U, C extends U> extends Cons2<O, A, B> {
    argList: Cons2<A, B, C>;
    item3: C;
}

export interface Cons4<O extends U, A extends U, B extends U, C extends U, D extends U> extends Cons3<O, A, B, C> {
    argList: Cons3<A, B, C, D>;
    item4: D;
}
