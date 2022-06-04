/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExtensionEnv, Operator, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";

export abstract class KeywordOperator implements Operator<Sym> {
    constructor(private readonly keyword: Sym, protected readonly $: ExtensionEnv) {
        // Nothing to see here.
    }
    abstract readonly name: string;
    isImag(expr: Sym): boolean {
        throw new Error("Keyword.isImag Symbol Method not implemented.");
    }
    isKind(expr: U): boolean {
        if (is_sym(expr)) {
            return expr.equalsSym(this.keyword);
        }
        return false;
    }
    isMinusOne(expr: Sym): boolean {
        throw new Error("Keyword.isMinusOne Symbol Method not implemented.");
    }
    isOne(expr: Sym): boolean {
        throw new Error("Keyword.isOne Symbol Method not implemented.");
    }
    isReal(expr: Sym): boolean {
        throw new Error("Keyword.isReal Symbol Method not implemented.");
    }
    isScalar(expr: Sym): boolean {
        throw new Error("Keyword.isScalar Symbol Method not implemented.");
    }
    isVector(expr: Sym): boolean {
        throw new Error("Keyword.isVector Symbol Method not implemented.");
    }
    isZero(expr: Sym): boolean {
        throw new Error("Keyword.isZero Symbol Method not implemented.");
    }
    subst(expr: Sym, oldExpr: U, newExpr: U): U {
        throw new Error("Keyword.subst Symbol Method not implemented.");
    }
    toInfixString(expr: Sym): string {
        throw new Error("Keyword.toInfixString Symbol Method not implemented.");
    }
    toListString(expr: Sym): string {
        return this.keyword.key();
    }
    transform(expr: U): [TFLAGS, U] {
        throw new Error("Keyword.transform Symbol Method not implemented.");
    }
    valueOf(expr: Sym): U {
        throw new Error("Keyword.valueOf Symbol Method not implemented.");
    }
}