import { U } from "../tree/tree";

export interface PrintEnvPrinter {
    toInfixString(expr: U): string;
    release(): void;
}

export interface PrintEnv {
    operatorFor(expr: U): PrintEnvPrinter;
}
