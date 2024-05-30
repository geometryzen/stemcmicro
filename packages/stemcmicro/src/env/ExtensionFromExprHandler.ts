/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sym } from "math-expression-atoms";
import { ExprContext, ExprHandler } from "math-expression-context";
import { Atom, Cons, U } from "math-expression-tree";
import { Extension, ExtensionEnv, FEATURE } from "./ExtensionEnv";

/**
 *
 */
export class ExtensionFromExprHandler<T extends Atom> implements ExprHandler<T>, Extension<T> {
    constructor(readonly handler: ExprHandler<T>) {}
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
    subst(expr: T, oldExpr: U, newExpr: U, $: Pick<ExprContext, "handlerFor">): U {
        throw new Error("Method not implemented.");
    }
    toHumanString(expr: T, $: ExprContext): string {
        throw new Error("Method not implemented.");
    }
    toInfixString(expr: T, $: ExprContext): string {
        throw new Error("Method not implemented.");
    }
    toLatexString(expr: T, $: ExprContext): string {
        throw new Error("Method not implemented.");
    }
    toListString(expr: T, $: ExprContext): string {
        throw new Error("Method not implemented.");
    }
    evaluate(opr: T, argList: Cons, $: ExtensionEnv): [number, U] {
        throw new Error("Method not implemented.");
    }
    transform(expr: T, $: ExtensionEnv): [number, U] {
        throw new Error("Method not implemented.");
    }
    valueOf(expr: T, $: ExtensionEnv): U {
        throw new Error("Method not implemented.");
    }
    test(atom: T, opr: Sym, env: ExprContext): boolean {
        return this.handler.test(atom, opr, env);
    }
    binL(lhs: T, opr: Sym, rhs: U, env: ExprContext): U {
        return this.handler.binL(lhs, opr, rhs, env);
    }
    binR(rhs: T, opr: Sym, lhs: U, env: ExprContext): U {
        return this.handler.binR(rhs, opr, lhs, env);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: T, opr: Sym, argList: Cons, env: ExprContext): U {
        return this.handler.dispatch(target, opr, argList, env);
    }
}
