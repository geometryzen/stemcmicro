/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Atom, Cons, U } from "math-expression-tree";
import { ProgrammingError } from "../programming/ProgrammingError";
import { Extension, ExtensionEnv, FEATURE, Operator } from "./ExtensionEnv";

export class AtomHandlerExtension<A extends Atom> implements Extension<A> {
    constructor(readonly op: Operator<A>) {
        if (!op) {
            throw new ProgrammingError();
        }
    }
    get hash(): string {
        return this.op.hash;
    }
    get name(): string {
        return this.op.name!;
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
    subst(expr: A, oldExpr: U, newExpr: U, $: ExtensionEnv): U {
        throw new Error("Method not implemented.");
    }
    test(expr: A, opr: Sym, env: ExprContext): boolean {
        try {
            return this.op.test(expr, opr);
        }
        catch (e) {
            throw new ProgrammingError(`${this.op.name} ${expr} ${opr} ${e}`);
        }
    }
    toInfixString(expr: A, $: ExtensionEnv): string {
        throw new Error("Method not implemented.");
    }
    toLatexString(expr: A, $: ExtensionEnv): string {
        throw new Error("Method not implemented.");
    }
    toListString(expr: A, $: ExtensionEnv): string {
        throw new Error("Method not implemented.");
    }
    evaluate(expr: A, argList: Cons, $: ExtensionEnv): [number, U] {
        throw new Error("Method not implemented.");
    }
    transform(expr: A, $: ExtensionEnv): [number, U] {
        throw new Error("Method not implemented.");
    }
    valueOf(expr: A, $: ExtensionEnv): U {
        throw new Error("Method not implemented.");
    }
}