/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sym } from "@stemcmicro/atoms";
import { CompareFn, ExprContext, ExprHandler } from "@stemcmicro/context";
import { Cons, Shareable, U } from "@stemcmicro/tree";
import { Scope, Thing } from "./Stepper";

/**
 * Having both a BaseEnv as well as a DerivedEnv is a relic of using ExtensionEnv.
 */
export class BaseEnv implements Scope {
    // readonly #hash_to_lambda: Map<string, LambdaExpr> = new Map();
    // #coreEnv: ExprContext;
    constructor(
        coreEnv: ExprContext,
        readonly thing: Thing
    ) {
        // this.#coreEnv = coreEnv;
    }
    hasBinding(opr: Sym, target: Cons): boolean {
        throw new Error("Method not implemented.");
    }
    getBinding(opr: Sym, target: Cons): U {
        throw new Error("Method not implemented.");
    }
    setBinding(opr: Sym, binding: U): void {
        throw new Error("Method not implemented.");
    }
    hasUserFunction(name: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    getUserFunction(name: Sym): U {
        throw new Error("Method not implemented.");
    }
    setUserFunction(name: Sym, usrfunc: U): void {
        throw new Error("Method not implemented.");
    }
    valueOf(expr: U): U {
        throw new Error("Method not implemented.");
    }
    clearBindings(): void {
        throw new Error("Method not implemented.");
    }
    compareFn(opr: Sym): CompareFn {
        throw new Error("Method not implemented.");
    }
    handlerFor<T extends U>(expr: T): ExprHandler<T> {
        throw new Error("Method not implemented.");
    }
    defineUserSymbol(name: Sym): void {
        throw new Error("Method not implemented.");
    }
    getDirective(directive: number): number {
        return 0;
    }
    pushDirective(directive: number, value: number): void {
        throw new Error("Method not implemented.");
    }
    popDirective(): void {
        throw new Error("Method not implemented.");
    }
    getSymbolPrintName(sym: Sym): string {
        throw new Error("Method not implemented.");
    }
    hasState(key: string): boolean {
        throw new Error("Method not implemented.");
    }
    getState(key: string): Shareable {
        throw new Error("Method not implemented.");
    }
    setState(key: string, value: Shareable): void {
        throw new Error("Method not implemented.");
    }
    addRef(): void {
        throw new Error("Method not implemented.");
    }
    release(): void {
        throw new Error("Method not implemented.");
    }
    /*
    evaluate(opr: Native, ...args: U[]): U {
        const expr = items_to_cons(native_sym(opr), ...args);
        const hashes: string[] = hash_candidates(native_sym(opr), expr);
        for (const hash of hashes) {
            if (this.#hash_to_lambda.has(hash)) {
                const lambda = this.#hash_to_lambda.get(hash);
                lambda(items_to_cons(...args), this.#coreEnv);
            }
        }
        switch (opr) {
            case Native.add: {
                throw new Error(`BaseEnv.evaluate + ${args} Method not implemented. ${hashes}`);
            }
        }
        throw new Error(`BaseEnv.evaluate ${opr} ${args} Method not implemented.`);
    }
    hasBinding(sym: Sym, target: Cons): boolean {
        throw new Error("Method not implemented.");
    }
    getBinding(sym: Sym, target: Cons): U {
        throw new Error("Method not implemented.");
    }
    setBinding(sym: Sym, binding: U): void {
        throw new Error("Method not implemented.");
    }
    hasUserFunction(sym: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    getUserFunction(sym: Sym): U {
        throw new Error("Method not implemented.");
    }
    setUserFunction(sym: Sym, usrfunc: U): void {
        throw new Error("Method not implemented.");
    }
    valueOf(expr: U): U {
        return this.#coreEnv.valueOf(expr);
    }
    */
}
