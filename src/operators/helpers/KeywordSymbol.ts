/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExtensionEnv, Operator, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { cons, Cons, U } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";

/**
 * Base class for symbols that are keywords.
 */
export abstract class KeywordOperator implements Operator<Sym> {
    constructor(protected readonly keyword: Sym, protected readonly $: ExtensionEnv) {
        // Nothing to see here.
    }
    abstract readonly name: string;
    isKind(expr: U): expr is Sym {
        if (is_sym(expr)) {
            return expr.equalsSym(this.keyword);
        }
        return false;
    }
    subst(expr: Sym, oldExpr: U, newExpr: U): U {
        throw new Error("Keyword.subst Symbol Method not implemented.");
    }
    toInfixString(expr: Sym): string {
        return expr.text;
    }
    toLatexString(expr: Sym): string {
        throw new Error("Keyword.toLatexString Symbol Method not implemented.");
    }
    toListString(expr: Sym): string {
        return this.keyword.key();
    }
    evaluate(expr: U, argList: Cons): [TFLAGS, U] {
        // TODO: expr should be the same as the keyword.
        return this.transform(cons(expr, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        throw new Error("Keyword.transform Symbol Method not implemented.");
    }
    valueOf(expr: Sym): U {
        throw new Error("Keyword.valueOf Symbol Method not implemented.");
    }
}