import { Sym } from "math-expression-atoms";
import { CompareFn, ExprContext, ExprHandler } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { Cons, is_atom, U } from "math-expression-tree";
import { ProgramEnv } from "./ProgramEnv";

class IsZeroExprContext implements ExprContext {
    constructor(readonly env: Pick<ProgramEnv, 'hasState' | 'getState' | 'setState' | 'handlerFor'>) {

    }
    hasState(key: string): boolean {
        return this.env.hasState(key);
    }
    getState(key: string): unknown {
        return this.env.getState(key);
    }
    setState(key: string, value: unknown): void {
        this.env.setState(key, value);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getSymbolPrintName(sym: Sym): string {
        throw new Error("Method not implemented.");
    }
    handlerFor<T extends U>(expr: T): ExprHandler<T> {
        return this.env.handlerFor(expr);
    }
    clearBindings(): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    compareFn(opr: Sym): CompareFn {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    executeProlog(script: string[]): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasBinding(opr: Sym, target: Cons): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getBinding(opr: Sym, target: Cons): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setBinding(opr: Sym, binding: U): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasUserFunction(name: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUserFunction(name: Sym): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setUserFunction(name: Sym, usrfunc: U): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defineUserSymbol(name: Sym): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getDirective(directive: number): number {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pushDirective(directive: number, value: number): void {
        throw new Error("Method not implemented.");
    }
    popDirective(): void {
        throw new Error("Method not implemented.");
    }

}

/**
 * Works for expr being Rat, Flt, or Tensor.
 */
export function iszero(atom: U, env: Pick<ProgramEnv, 'getState' | 'handlerFor' | 'hasState' | 'setState'>): boolean {
    if (is_atom(atom)) {
        const handler = env.handlerFor(atom);
        return handler.test(atom, native_sym(Native.iszero), new IsZeroExprContext(env));
    }
    else {
        return false;
    }
}
