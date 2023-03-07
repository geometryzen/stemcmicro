/* eslint-disable @typescript-eslint/no-unused-vars */
import { render_as_sexpr } from "../print/render_as_sexpr";
import { U } from "../tree/tree";
import { ExtensionEnv, FEATURE, Operator } from "./ExtensionEnv";

export class UnknownOperator implements Operator<U> {
    name: string;
    /**
     * 
     * @param expr An expression, probably user-defined.
     * @param $ The extension environment.
     */
    constructor(private readonly expr: U, private readonly $: ExtensionEnv) {
        this.name = "unknown";
    }
    key?: string | undefined;
    hash?: string | undefined;
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    isImag(expr: U): boolean {
        // We don't really know.
        return false;
        // throw new Error("UnknownOperator.isImag Method not implemented.");
    }
    isKind(expr: U): expr is U {
        throw new Error("UnknownOperator.isKind Method not implemented.");
    }
    isMinusOne(expr: U): boolean {
        throw new Error("UnknownOperator.isMinusOne Method not implemented.");
    }
    isOne(expr: U): boolean {
        return false;
        // throw new Error("UnknownOperator.isOne Method not implemented.");
    }
    isReal(expr: U): boolean {
        return false;
        // throw new Error("UnknownOperator.isReal Method not implemented.");
    }
    isScalar(expr: U): boolean {
        throw new Error("UnknownOperator.isScalar Method not implemented.");
    }
    isVector(expr: U): boolean {
        throw new Error("UnknownOperator.isVector Method not implemented.");
    }
    isZero(expr: U): boolean {
        const repr = render_as_sexpr(expr, this.$);
        throw new Error(`UnknownOperator.isZero ${repr} Method not implemented.`);
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
    transform(expr: U): [number, U] {
        throw new Error("UnknownOperator. Method not implemented.");
    }
    valueOf(expr: U): U {
        throw new Error("UnknownOperator. Method not implemented.");
    }
}