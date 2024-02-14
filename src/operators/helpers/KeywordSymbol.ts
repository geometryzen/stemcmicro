/* eslint-disable @typescript-eslint/no-unused-vars */
import { assert_sym, is_sym, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { cons, Cons, U } from "math-expression-tree";
import { Extension, ExtensionEnv, FEATURE, TFLAGS } from "../../env/ExtensionEnv";

/**
 * 
 */
export abstract class AbstractKeywordOperator implements Extension<Sym> {
    readonly #keyword: Sym;
    constructor(keyword: Sym) {
        this.#keyword = assert_sym(keyword);
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    test(expr: Sym, opr: Sym, env: ExprContext): boolean {
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
    isKind(expr: U, $: ExtensionEnv): expr is Sym {
        if (is_sym(expr)) {
            return expr.equalsSym(this.#keyword);
        }
        return false;
    }
    subst(expr: Sym, oldExpr: U, newExpr: U, $: Pick<ExtensionEnv, 'extensionFor'>): U {
        throw new Error("Keyword.subst Symbol Method not implemented.");
    }
    toInfixString(expr: Sym, $: ExtensionEnv): string {
        return expr.key();
    }
    toLatexString(expr: Sym, $: ExtensionEnv): string {
        throw new Error("Keyword.toLatexString Symbol Method not implemented.");
    }
    toListString(expr: Sym, $: ExtensionEnv): string {
        return this.#keyword.key();
    }
    evaluate(expr: Sym, argList: Cons, $: ExtensionEnv): [TFLAGS, U] {
        return this.transform(cons(expr, argList), $);
    }
    transform(expr: U, $: ExtensionEnv): [TFLAGS, U] {
        throw new Error("Keyword.transform Symbol Method not implemented.");
    }
    valueOf(expr: Sym, $: ExtensionEnv): U {
        throw new Error(`Keyword.valueOf(${expr.key()}) Symbol Method not implemented.`);
    }
}