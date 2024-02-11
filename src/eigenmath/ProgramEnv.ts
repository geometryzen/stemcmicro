import { Sym } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";

export interface ProgramEnv {
    clearBindings(): void;
    executeProlog(script: string[]): void;
    getBinding(opr: Sym, target: Cons): U;
    getUserFunction(name: Sym): U;
    hasBinding(opr: Sym, target: Cons): boolean;
    hasUserFunction(name: Sym): boolean;
    setBinding(opr: Sym, binding: U): void;
    setUserFunction(name: Sym, userfunc: U): void;
    defineUserSymbol(name: Sym): void;
}
