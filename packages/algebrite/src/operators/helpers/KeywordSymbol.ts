/* eslint-disable @typescript-eslint/no-unused-vars */
import { assert_sym, create_sym, is_sym, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { is_native, Native } from "@stemcmicro/native";
import { cons, Cons, nil, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionEnv, TFLAGS } from "../../env/ExtensionEnv";
import { ProgrammingError } from "../../programming/ProgrammingError";

/**
 *
 */
export abstract class AbstractKeywordExtension implements Extension<Sym> {
    readonly #keyword: Sym;
    constructor(
        keyword: Sym,
        readonly config: Readonly<EnvConfig>
    ) {
        this.#keyword = assert_sym(keyword);
    }
    binL(expr: Sym, opr: Sym, rhs: U, env: ExprContext): U {
        return nil;
    }
    binR(expr: Sym, opr: Sym, lhs: U, env: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Sym, opr: Sym, argList: Cons, env: ExprContext): U {
        return diagnostic(Diagnostics.Property_0_does_not_exist_on_type_1, opr, create_sym(target.type));
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
    iscons(): this is Extension<Cons> {
        return false;
    }
    operator(): never {
        throw new ProgrammingError();
    }
    isKind(expr: U): expr is Sym {
        if (is_sym(expr)) {
            return expr.equalsSym(this.#keyword);
        }
        return false;
    }
    subst(expr: Sym, oldExpr: U, newExpr: U, $: Pick<ExprContext, "handlerFor">): U {
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
