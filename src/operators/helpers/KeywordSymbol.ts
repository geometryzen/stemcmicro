/* eslint-disable @typescript-eslint/no-unused-vars */
import { assert_sym, is_sym, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { is_native, Native } from "math-expression-native";
import { cons, Cons, nil, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionEnv, FEATURE, TFLAGS } from "../../env/ExtensionEnv";
import { ProgrammingError } from "../../programming/ProgrammingError";

/**
 * 
 */
export abstract class AbstractKeywordExtension implements Extension<Sym> {
    readonly #keyword: Sym;
    constructor(keyword: Sym, readonly config: Readonly<EnvConfig>) {
        this.#keyword = assert_sym(keyword);
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    binL(expr: Sym, opr: Sym, rhs: U, env: ExprContext): U {
        return nil;
    }
    binR(expr: Sym, opr: Sym, lhs: U, env: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(expr: Sym, opr: Sym, argList: Cons, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    test(expr: Sym, opr: Sym, env: ExprContext): boolean {
        if (is_native(opr, Native.iszero)) {
            return false;
        }
        throw new Error(`AbstractKeywordExtension.test ${expr} ${opr} method not implemented.`);
    }
    abstract readonly hash: string;
    abstract readonly name: string;
    keyword(): Sym {
        return this.#keyword;
    }
    iscons(): boolean {
        return false;
    }
    operator(): never {
        throw new ProgrammingError();
    }
    isKind(expr: U, $: ExtensionEnv): expr is Sym {
        if (is_sym(expr)) {
            return expr.equalsSym(this.#keyword);
        }
        return false;
    }
    subst(expr: Sym, oldExpr: U, newExpr: U, $: Pick<ExprContext, 'handlerFor'>): U {
        throw new Error("Keyword.subst Symbol Method not implemented.");
    }
    toHumanString(expr: Sym, $: ExprContext): string {
        return expr.key();
    }
    toInfixString(expr: Sym, $: ExprContext): string {
        return expr.key();
    }
    toLatexString(expr: Sym, $: ExprContext): string {
        throw new Error("Keyword.toLatexString Symbol Method not implemented.");
    }
    toListString(expr: Sym, $: ExprContext): string {
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