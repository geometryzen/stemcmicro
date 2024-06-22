/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Cons, U } from "@stemcmicro/tree";
import { Extension, FEATURE } from "./ExtensionEnv";

export class UnknownConsExtension implements Extension<Cons> {
    name: string;
    constructor() {
        // console.lg("constructor UnknownConsExtension(): UnknownConsExtension");
        this.name = "unknown";
    }
    binL(expr: Cons, opr: Sym, rhs: U, env: ExprContext): U {
        throw new Error("UnknownConsExtension.binL");
    }
    binR(expr: Cons, opr: Sym, lhs: U, env: ExprContext): U {
        throw new Error("UnknownConsExtension.binR");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(expr: Cons, opr: Sym, argList: Cons, env: ExprContext): U {
        throw new Error("UnknownConsExtension.dispatch");
    }
    test(expr: Cons, opr: Sym): boolean {
        throw new Error("UnknownConsExtension.test");
    }
    key?: string | undefined;
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    iscons(): this is UnknownConsExtension {
        return true;
    }
    operator(): Sym {
        throw new Error();
    }
    get hash(): string {
        throw new Error("UnknownConsExtension.hash");
    }
    isKind(expr: Cons): expr is Cons {
        throw new Error("UnknownConsExtension.isKind");
    }
    subst(expr: U, oldExpr: U, newExpr: U): U {
        throw new Error("UnknownConsExtension.subst");
    }
    toHumanString(expr: U): string {
        throw new Error("UnknownConsExtension.toHumanString");
    }
    toInfixString(expr: U): string {
        throw new Error("UnknownConsExtension.toInfixtring");
    }
    toLatexString(expr: U): string {
        throw new Error("UnknownConsExtension.toLatexString");
    }
    toListString(expr: Cons, env: ExprContext): string {
        throw new Error("UnknownConsExtension.toListString");
    }
    evaluate(expr: U, argList: Cons): [number, U] {
        throw new Error("UnknownConsExtension.evaluate");
    }
    transform(expr: U): [number, U] {
        throw new Error("UnknownConsExtension.transform");
    }
    valueOf(expr: U): U {
        throw new Error("UnknownConsExtension.valueOf");
    }
}
