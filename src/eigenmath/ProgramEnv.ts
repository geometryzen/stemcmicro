import { Sym } from "math-expression-atoms";
import { U } from "math-expression-tree";

export interface ProgramEnv {
    clearBindings(): void;
    executeProlog(script: string[]): void;
    getBinding(name: Sym): U;
    getUserFunction(name: Sym): U;
    hasBinding(name: Sym): boolean;
    hasUserFunction(name: Sym): boolean;
    defineUserSymbol(name: Sym): void;
    setBinding(name: Sym, binding: U): void;
    setUserFunction(name: Sym, userfunc: U): void;
}
