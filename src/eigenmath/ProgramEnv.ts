import { Sym } from "math-expression-atoms";
import { ExprHandler } from "math-expression-context";
import { Cons, U } from "math-expression-tree";
import { ProgramStack } from "./ProgramStack";

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
    handlerFor<T extends U>(expr: T): ExprHandler<T>;
    /**
     * If a stack is provided, the computed value is pushed onto the stack and nil is returned. 
     */
    valueOf(expr: U, stack?: Pick<ProgramStack, 'push'>): U;
}
