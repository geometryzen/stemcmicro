import { Sym } from "@stemcmicro/atoms";
import { CompareFn, ExprContext, ExprHandler } from "@stemcmicro/context";
import { ProgramControl, ProgramEnv } from "@stemcmicro/stack";
import { Cons, Shareable, U } from "@stemcmicro/tree";

/**
 *
 */
export class ExprContextFromProgram implements ExprContext {
    #refCount = 1;
    constructor(
        readonly env: ProgramEnv,
        readonly ctrl: ProgramControl
    ) {
        this.env.addRef();
    }
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            this.env.release();
        }
    }
    hasState(key: string): boolean {
        return this.env.hasState(key);
    }
    getState(key: string): Shareable {
        return this.env.getState(key);
    }
    setState(key: string, value: Shareable): void {
        this.env.setState(key, value);
    }
    clearBindings(): void {
        this.env.clearBindings();
    }
    compareFn(opr: Sym): CompareFn {
        return this.ctrl.compareFn(opr);
    }
    getDirective(directive: number): number {
        return this.ctrl.getDirective(directive);
    }
    pushDirective(directive: number, value: number): void {
        this.ctrl.pushDirective(directive, value);
    }
    popDirective(): void {
        this.ctrl.popDirective();
    }
    handlerFor<T extends U>(expr: T): ExprHandler<T> {
        return this.env.handlerFor(expr);
    }
    hasBinding(opr: Sym, target: Cons): boolean {
        return this.env.hasBinding(opr, target);
    }
    getBinding(opr: Sym, target: Cons): U {
        return this.env.getBinding(opr, target);
    }
    setBinding(opr: Sym, binding: U): void {
        this.env.setBinding(opr, binding);
    }
    hasUserFunction(name: Sym): boolean {
        return this.env.hasUserFunction(name);
    }
    getUserFunction(name: Sym): U {
        return this.env.getUserFunction(name);
    }
    setUserFunction(name: Sym, userfunc: U): void {
        this.env.setUserFunction(name, userfunc);
    }
    defineUserSymbol(name: Sym): void {
        this.env.defineUserSymbol(name);
    }
    valueOf(expr: U): U {
        return this.env.valueOf(expr);
    }
    getSymbolPrintName(sym: Sym): string {
        return this.ctrl.getSymbolPrintName(sym);
    }
}
