/* eslint-disable @typescript-eslint/no-unused-vars */
import { RatExtension } from "@stemcmicro/algebrite";
import { is_rat, is_sym, Sym } from "@stemcmicro/atoms";
import { CompareFn, ExprHandler } from "@stemcmicro/context";
import { compare_terms } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, Shareable, U } from "@stemcmicro/tree";
import { Scope, Thing } from "./Stepper";

const ADD = native_sym(Native.add);

export class DerivedScope implements Scope {
    #bindings: Map<string, U> = new Map();
    #usrfuncs: Map<Sym, U> = new Map();
    constructor(
        readonly parentEnv: Scope,
        readonly strict: boolean,
        readonly thing: Thing
    ) {}
    hasBinding(opr: Sym, target: Cons): boolean {
        throw new Error("Method not implemented.");
    }
    getBinding(opr: Sym, target: Cons): U {
        throw new Error("Method not implemented.");
    }
    setBinding(opr: Sym, binding: U): void {
        this.#bindings.set(opr.key(), binding);
    }
    hasUserFunction(name: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    getUserFunction(name: Sym): U {
        throw new Error("Method not implemented.");
    }
    setUserFunction(name: Sym, usrfunc: U): void {
        this.#usrfuncs.set(name, usrfunc);
    }
    valueOf(expr: U): U {
        if (is_rat(expr)) {
            return expr;
        }
        if (is_sym(expr)) {
            if (this.#bindings.has(expr.key())) {
                return this.#bindings.get(expr.key());
            }
        }
        throw new Error(`valueOf(${expr}) DerivedEnv.valueOf Method not implemented.`);
    }
    clearBindings(): void {
        throw new Error("Method not implemented.");
    }
    compareFn(opr: Sym): CompareFn {
        if (ADD.equalsSym(opr)) {
            return compare_terms;
        }
        throw new Error(`compareFn(${opr}) Method not implemented.`);
    }
    handlerFor<T extends U>(expr: T): ExprHandler<T> {
        if (is_rat(expr)) {
            return new RatExtension() as unknown as ExprHandler<T>;
        }
        throw new Error(`handlerFor(${expr} Method not implemented.`);
    }
    defineUserSymbol(name: Sym): void {
        throw new Error("Method not implemented.");
    }
    getDirective(directive: number): number {
        throw new Error("Method not implemented.");
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
        return this.parentEnv.evaluate(opr, ...args);
    }
    hasBinding(sym: Sym, target: Cons): boolean {
        throw new Error("Method not implemented.");
    }
    getBinding(sym: Sym, target: Cons): U {
        throw new Error("Method not implemented.");
    }
    setBinding(sym: Sym, binding: U): void {
        this.#bindings.set(sym.key(), binding);
        // throw new Error(`DerivedEnv.setBinding ${sym} ${binding} Method not implemented.`);
    }
    hasUserFunction(sym: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    getUserFunction(sym: Sym): U {
        throw new Error("Method not implemented.");
    }
    setUserFunction(sym: Sym, usrfunc: U): void {
        this.#usrfuncs.set(sym, usrfunc);
        // throw new Error(`DerivedEnv.setUserFunction ${sym} ${usrfunc} Method not implemented.`);
    }
    */
}
