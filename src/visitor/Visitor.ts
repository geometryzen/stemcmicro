import { Boo, Flt, Rat, Str, Sym, Tensor } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { Dictionary } from "../clojurescript/atoms/Dictionary";

export interface Visitor {
    beginCons(expr: Cons): void;
    endCons(expr: Cons): void;
    beginTensor(tensor: Tensor): void;
    endTensor(tensor: Tensor): void;
    beginMap(map: Dictionary): void;
    endMap(map: Dictionary): void;
    boo(boo: Boo): void;
    sym(sym: Sym): void;
    rat(rat: Rat): void;
    str(str: Str): void;
    flt(flt: Flt): void;
    atom(atom: U): void;
    nil(expr: U): void;
}