import { Sym } from "math-expression-atoms";

export interface EigenmathWriteScope {
    defineUserSymbol(sym: Sym): void;
}
