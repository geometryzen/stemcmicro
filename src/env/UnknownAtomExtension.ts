/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Atom, Cons, U } from "math-expression-tree";
import { Extension, ExtensionEnv, FEATURE } from "./ExtensionEnv";

export class UnknownAtomExtension<A extends Atom> implements Extension<A> {
    constructor(atom: A) {

    }
    get hash(): string {
        throw new Error("Method not implemented.");
    }
    get name(): string {
        throw new Error("Method not implemented.");
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    iscons(): this is Extension<Cons> {
        throw new Error("Method not implemented.");
    }
    operator(): Sym {
        throw new Error("Method not implemented.");
    }
    isKind(expr: U, $: ExtensionEnv): boolean {
        throw new Error("Method not implemented.");
    }
    toHumanString(expr: A, $: ExprContext): string {
        throw new Error("Method not implemented.");
    }
    toInfixString(expr: A, $: ExprContext): string {
        throw new Error("Method not implemented.");
    }
    toLatexString(expr: A, $: ExprContext): string {
        throw new Error("Method not implemented.");
    }
    toListString(expr: A, $: ExprContext): string {
        throw new Error("Method not implemented.");
    }
    evaluate(opr: A, argList: Cons, $: ExtensionEnv): [number, U] {
        throw new Error("Method not implemented.");
    }
    transform(expr: A, $: ExtensionEnv): [number, U] {
        throw new Error("Method not implemented.");
    }
    valueOf(expr: A, $: ExtensionEnv): U {
        throw new Error("Method not implemented.");
    }
    binL(lhs: A, opr: Sym, rhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    binR(rhs: A, opr: Sym, lhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    dispatch(expr: A, opr: Sym, argList: Cons, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    subst(expr: A, oldExpr: U, newExpr: U, env: Pick<ExprContext, "handlerFor">): U {
        throw new Error("Method not implemented.");
    }
    test(expr: A, opr: Sym, env: ExprContext): boolean {
        throw new Error("Method not implemented.");
    }
}