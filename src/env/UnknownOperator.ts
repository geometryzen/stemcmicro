/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sym } from "math-expression-atoms";
import { Cons, U } from "../tree/tree";
import { ExtensionEnv, FEATURE, Operator } from "./ExtensionEnv";

export class UnknownConsOperator implements Operator<Cons> {
    name: string;
    constructor(private readonly $: ExtensionEnv) {
        this.name = "unknown";
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
        throw new Error("UnknownOperator.hash Method not implemented.");
    }
    isKind(expr: Cons): expr is Cons {
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
    toListString(expr: Cons): string {
        const $ = this.$;
        const items: U[] = [...expr];
        const ss = items.map((item) => $.toSExprString(item));
        return `(${ss.join(' ')})`;
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