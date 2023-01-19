/* eslint-disable @typescript-eslint/no-unused-vars */
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
    breaker?: boolean | undefined;
    hash?: string | undefined;
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    isImag(expr: U): boolean {
        // We don't really know.
        return false;
        // throw new Error("UnknownOperator.isImag Method not implemented.");
    }
    isKind(expr: U): boolean {
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
        throw new Error("UnknownOperator.isZero Method not implemented.");
    }
    subst(expr: U, oldExpr: U, newExpr: U): U {
        throw new Error("UnknownOperator.subst Method not implemented.");
    }
    toInfixString(expr: U): string {
        throw new Error("UnknownOperator.toInfixString Method not implemented.");
    }
    toLatexString(expr: U): string {
        throw new Error("UnknownOperator.toLatexString Method not implemented.");
    }
    toListString(expr: U): string {
        throw new Error("UnknownOperator.toListString Method not implemented.");
    }
    transform(expr: U): [number, U] {
        throw new Error("UnknownOperator. Method not implemented.");
    }
    valueOf(expr: U): U {
        throw new Error("UnknownOperator. Method not implemented.");
    }

}