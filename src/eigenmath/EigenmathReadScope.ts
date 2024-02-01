import { Sym } from "math-expression-atoms";

export interface EigenmathReadScope {
    hasBinding(sym: Sym): boolean;
    hasUserFunction(sym: Sym): boolean;
}
