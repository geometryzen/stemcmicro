import { Sym } from "@stemcmicro/atoms";
import { ExprHandler } from "@stemcmicro/context";
import { Cons, Shareable, U } from "@stemcmicro/tree";
import { ProgramStack } from "./ProgramStack";

export interface ProgramEnv extends Shareable {
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
    valueOf(expr: U, stack?: Pick<ProgramStack, "push">): U;
    hasState(key: string): boolean;
    getState(key: string): Shareable;
    setState(key: string, value: Shareable): void;
}
