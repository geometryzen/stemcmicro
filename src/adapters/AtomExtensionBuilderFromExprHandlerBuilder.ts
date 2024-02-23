/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sym } from "math-expression-atoms";
import { ExprContext, ExprHandler } from "math-expression-context";
import { Atom, Cons, is_atom, U } from "math-expression-tree";
import { ExprHandlerBuilder } from "../api/api";
import { EnvConfig } from "../env/EnvConfig";
import { Extension, ExtensionBuilder, ExtensionEnv } from "../env/ExtensionEnv";
import { ProgrammingError } from "../programming/ProgrammingError";

class AtomExtensionFromExprHandler<T extends Atom> implements Extension<T> {
    readonly #type: string;
    readonly #guard: (expr: Atom) => boolean;
    constructor(readonly handler: ExprHandler<T>, type: string, guard: (expr: Atom) => boolean) {
        this.#type = type;
        this.#guard = guard;
    }
    get hash(): string {
        return this.#type;
    }
    get name(): string {
        return this.#type;
    }
    iscons(): this is Extension<Cons> {
        return false;
    }
    operator(): never {
        throw new ProgrammingError();
    }
    isKind(expr: U): boolean {
        if (is_atom(expr)) {
            return this.#guard(expr);
        }
        else {
            return false;
        }
    }
    toHumanString(expr: T, $: ExprContext): string {
        throw new Error("toHumanString method not implemented.");
    }
    toInfixString(expr: T, $: ExprContext): string {
        throw new Error("toInfixString method not implemented.");
    }
    toLatexString(expr: T, $: ExprContext): string {
        throw new Error("toLatexString method not implemented.");
    }
    toListString(expr: T, $: ExprContext): string {
        throw new Error("toListString method not implemented.");
    }
    evaluate(opr: T, argList: Cons, $: ExtensionEnv): [number, U] {
        throw new Error("evaluate method not implemented.");
    }
    transform(expr: T, $: ExtensionEnv): [number, U] {
        throw new Error("transform method not implemented.");
    }
    valueOf(expr: T, $: ExtensionEnv): U {
        throw new Error("valueOf method not implemented.");
    }
    binL(lhs: T, opr: Sym, rhs: U, env: ExprContext): U {
        throw new Error("bunL method not implemented.");
    }
    binR(rhs: T, opr: Sym, lhs: U, env: ExprContext): U {
        throw new Error("binR method not implemented.");
    }
    dispatch(expr: T, opr: Sym, argList: Cons, env: ExprContext): U {
        throw new Error("dispatch method not implemented.");
    }
    subst(expr: T, oldExpr: U, newExpr: U, env: Pick<ExprContext, "handlerFor">): U {
        throw new Error("subst method not implemented.");
    }
    test(expr: T, opr: Sym, env: ExprContext): boolean {
        throw new Error("test method not implemented.");
    }
}

export class AtomExtensionBuilderFromExprHandlerBuilder<T extends Atom> implements ExtensionBuilder<T> {
    constructor(readonly builder: ExprHandlerBuilder<T>, readonly type: string, readonly guard: (expr: Atom) => boolean) {

    }
    create(config: Readonly<EnvConfig>): Extension<T> {
        return new AtomExtensionFromExprHandler(this.builder.create(), this.type, this.guard);
    }

}