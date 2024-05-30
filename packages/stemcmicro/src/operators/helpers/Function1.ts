import { is_sym, Sym } from "math-expression-atoms";
import { Cons, Cons1, is_cons, items_to_cons, U } from "math-expression-tree";
import { ExtensionEnv, FEATURE, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { FunctionVarArgs } from "./FunctionVarArgs";
import { GUARD } from "./GUARD";

export abstract class Function1<T extends U> extends FunctionVarArgs<Cons1<Sym, T>> {
    constructor(
        name: string,
        opr: Sym,
        private readonly guard: GUARD<U, T>
    ) {
        super(name, opr);
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(expr: Cons1<Sym, T>, opr: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    isKind(expr: U, $: ExtensionEnv): expr is Cons1<Sym, T> {
        return !!this.match(expr, $);
    }
    match(expr: U, $: ExtensionEnv): Cons1<Sym, T> | undefined {
        if (is_cons(expr) && expr.length === 2) {
            const opr = expr.opr;
            const arg = expr.item(1);
            if (is_sym(opr) && this.opr.equalsSym(opr) && this.guard(arg, $)) {
                return expr as Cons1<Sym, T>;
            } else {
                return void 0;
            }
        } else {
            return void 0;
        }
    }
    transform(expr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const m = this.match(expr, $);
        if (m) {
            const arg = $.valueOf(m.arg);
            if (!arg.equals(m.arg)) {
                return [TFLAG_DIFF, $.valueOf(items_to_cons(m.opr, arg))];
            } else {
                return this.transform1(m.opr, m.arg, m, $);
            }
        }
        return [TFLAG_NONE, expr];
    }
    /**
     * This abstract function is only called if there is no change in the arg following evaluation.
     * @param opr The operator symbol typed according to the matches that have been made.
     * @param arg The unevaluated arg typed according to the matches that have been made.
     * @param expr The original expression typed according to the matches that have been made.
     */
    abstract transform1(opr: Sym, arg: T, expr: Cons1<Sym, T>, $: ExtensionEnv): [TFLAGS, U];
}
