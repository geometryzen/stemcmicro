import { Boo, Flt, Rat, Str, Sym, Tensor } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { Keyword } from "../clojurescript/atoms/Keyword";
import { Map } from "../clojurescript/atoms/Map";

export interface Visitor {
    beginCons(expr: Cons): void;
    endCons(expr: Cons): void;
    beginTensor(tensor: Tensor): void;
    endTensor(tensor: Tensor): void;
    beginMap(map: Map): void;
    endMap(map: Map): void;
    boo(boo: Boo): void;
    keyword(keyword: Keyword): void;
    sym(sym: Sym): void;
    rat(rat: Rat): void;
    str(str: Str): void;
    flt(flt: Flt): void;
    atom(atom: U): void;
    nil(expr: U): void;
}