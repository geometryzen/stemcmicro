import { Boo, Flt, Keyword, Map, Rat, Str, Sym, Tag, Tensor } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";

/**
 * TODO: This probably should recognize all atoms known to Extensibe Data Notation?
 */
export interface Visitor {
    atom(atom: U): void;
    beginCons(expr: Cons): void;
    endCons(expr: Cons): void;
    beginTensor(tensor: Tensor): void;
    endTensor(tensor: Tensor): void;
    beginMap(map: Map): void;
    endMap(map: Map): void;
    boo(boo: Boo): void;
    flt(flt: Flt): void;
    keyword(keyword: Keyword): void;
    rat(rat: Rat): void;
    str(str: Str): void;
    sym(sym: Sym): void;
    tag(tag: Tag): void;
    nil(expr: U): void;
}
