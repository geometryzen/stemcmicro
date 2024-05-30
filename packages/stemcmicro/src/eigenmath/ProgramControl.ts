import { Sym } from "math-expression-atoms";
import { CompareFn } from "math-expression-context";

export interface ProgramControl {
    compareFn(opr: Sym): CompareFn;
    getDirective(directive: number): number;
    pushDirective(directive: number, value: number): void;
    popDirective(): void;
    getSymbolPrintName(sym: Sym): string;
}
