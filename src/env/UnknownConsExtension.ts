/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Cons, U } from "../tree/tree";
import { Extension, ExtensionEnv, FEATURE } from "./ExtensionEnv";

export class UnknownConsExtension implements Extension<Cons> {
    name: string;
    constructor(private readonly $: ExtensionEnv) {
        this.name = "unknown";
    }
    binL(expr: Cons, opr: Sym, rhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    binR(expr: Cons, opr: Sym, lhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(expr: Cons, opr: Sym, argList: Cons, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    test(expr: Cons, opr: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    key?: string | undefined;
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    iscons(): true {
        return true;
    }
    operator(): Sym {
        throw new Error();
    }
    get hash(): string {
        throw new Error("UnknownConsExtension.hash Method not implemented.");
    }
    isKind(expr: Cons): expr is Cons {
        throw new Error("UnknownConsExtension.isKind Method not implemented.");
    }
    subst(expr: U, oldExpr: U, newExpr: U): U {
        throw new Error("UnknownConsExtension.subst Method not implemented.");
    }
    toHumanString(expr: U): string {
        throw new Error(`${expr.toString()} is not defined.`);
    }
    toInfixString(expr: U): string {
        throw new Error(`${expr.toString()} is not defined.`);
    }
    toLatexString(expr: U): string {
        throw new Error(`${expr.toString()} is not defined.`);
    }
    toListString(expr: Cons): string {
        const $ = this.$;
        const items: U[] = [...expr];
        const ss = items.map((item) => $.toSExprString(item));
        return `(${ss.join(' ')})`;
    }
    evaluate(expr: U, argList: Cons): [number, U] {
        throw new Error("UnknownConsExtension. Method not implemented.");
    }
    transform(expr: U): [number, U] {
        throw new Error("UnknownConsExtension. Method not implemented.");
    }
    valueOf(expr: U): U {
        throw new Error("UnknownConsExtension. Method not implemented.");
    }
}