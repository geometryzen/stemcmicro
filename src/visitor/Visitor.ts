import { Boo, Flt, Keyword, Map, Rat, Str, Sym, Tensor } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";

/**
 * TODO: This probably should recognize all atoms known to Extensibe Data Notation?
 */
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