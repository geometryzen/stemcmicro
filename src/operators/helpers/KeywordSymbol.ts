/* eslint-disable @typescript-eslint/no-unused-vars */
import { assert_sym } from "math-expression-atoms";
import { ExtensionEnv, FEATURE, Operator, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { cons, Cons, U } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";

/**
 * 
 */
export abstract class AbstractKeywordOperator implements Operator<Sym> {
    readonly #keyword: Sym;
    constructor(keyword: Sym, protected readonly $: ExtensionEnv) {
        this.#keyword = assert_sym(keyword);
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    test(expr: Sym, opr: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    abstract readonly hash: string;
    abstract readonly name: string;
    keyword(): Sym {
        return this.#keyword;
    }
    iscons(): boolean {
        return false;
    }
    operator(): Sym {
        throw new Error();
    }
    isKind(expr: U): expr is Sym {
        if (is_sym(expr)) {
            return expr.equalsSym(this.#keyword);
        }
        return false;
    }
    subst(expr: Sym, oldExpr: U, newExpr: U): U {
        throw new Error("Keyword.subst Symbol Method not implemented.");
    }
    toInfixString(expr: Sym): string {
        return expr.key();
    }
    toLatexString(expr: Sym): string {
        throw new Error("Keyword.toLatexString Symbol Method not implemented.");
    }
    toListString(expr: Sym): string {
        return this.#keyword.key();
    }
    evaluate(expr: U, argList: Cons): [TFLAGS, U] {
        // TODO: expr should be the same as the keyword.
        return this.transform(cons(expr, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        throw new Error("Keyword.transform Symbol Method not implemented.");
    }
    valueOf(expr: Sym): U {
        throw new Error(`Keyword.valueOf(${expr.key()}) Symbol Method not implemented.`);
    }
}