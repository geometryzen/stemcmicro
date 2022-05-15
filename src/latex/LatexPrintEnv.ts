import { U } from "../tree/tree";

export interface LatexPrinter {
    toInfixString(expr: U): string;
}

export interface LatexPrintEnv {
    operatorFor(expr: U): LatexPrinter;
}
