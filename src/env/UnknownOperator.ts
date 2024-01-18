/* eslint-disable @typescript-eslint/no-unused-vars */
import { assert_sym, Sym } from "math-expression-atoms";
import { Cons, U } from "../tree/tree";
import { ExtensionEnv, FEATURE, Operator } from "./ExtensionEnv";

export class UnknownConsOperator implements Operator<U> {
    name: string;
    readonly #operator: Sym;
    /**
     * 
     * @param expr An expression, probably user-defined.
     * @param $ The extension environment.
     */
    constructor(expr: Cons, private readonly $: ExtensionEnv) {
        this.name = "unknown";
        this.#operator = assert_sym(expr.opr);
    }
    key?: string | undefined;
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    iscons(): boolean {
        return true;
    }
    operator(): Sym {
        return this.#operator;
    }
    get hash(): string {
        throw new Error("UnknownOperator.hash Method not implemented.");
    }
    isKind(expr: U): expr is U {
        throw new Error("UnknownOperator.isKind Method not implemented.");
    }
    subst(expr: U, oldExpr: U, newExpr: U): U {
        throw new Error("UnknownOperator.subst Method not implemented.");
    }
    toInfixString(expr: U): string {
        throw new Error(`${expr.toString()} is not defined.`);
    }
    toLatexString(expr: U): string {
        throw new Error(`${expr.toString()} is not defined.`);
    }
    toListString(expr: U): string {
        throw new Error(`${expr.toString()} is not defined.`);
    }
    evaluate(expr: U, argList: Cons): [number, U] {
        throw new Error("UnknownOperator. Method not implemented.");
    }
    transform(expr: U): [number, U] {
        throw new Error("UnknownOperator. Method not implemented.");
    }
    valueOf(expr: U): U {
        throw new Error("UnknownOperator. Method not implemented.");
    }
}