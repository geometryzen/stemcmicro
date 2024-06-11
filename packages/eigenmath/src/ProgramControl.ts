import { Sym } from "@stemcmicro/atoms";
import { CompareFn } from "@stemcmicro/context";

export interface ProgramControl {
    compareFn(opr: Sym): CompareFn;
    getDirective(directive: number): number;
    pushDirective(directive: number, value: number): void;
    popDirective(): void;
    getSymbolPrintName(sym: Sym): string;
}
