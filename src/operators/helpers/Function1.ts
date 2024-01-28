import { ExtensionEnv, Operator, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";
import { FunctionVarArgs } from "./FunctionVarArgs";
import { GUARD } from "./GUARD";
import { Cons1 } from "./Cons1";

export abstract class Function1<T extends U> extends FunctionVarArgs implements Operator<Cons1<Sym, T>> {
    constructor(name: string, opr: Sym, private readonly guard: GUARD<U, T>, $: ExtensionEnv) {
        super(name, opr, $);
    }
    isKind(expr: U): expr is Cons1<Sym, T> {
        return !!this.match(expr);
    }
    match(expr: U): Cons1<Sym, T> | undefined {
        if (is_cons(expr) && expr.length === 2) {
            const opr = expr.opr;
            const arg = expr.item(1);
            if (is_sym(opr) && this.opr.equalsSym(opr) && this.guard(arg)) {
                return expr as Cons1<Sym, T>;
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    transform(expr: Cons): [TFLAGS, U] {
        const m = this.match(expr);
        if (m) {
            const $ = this.$;
            const arg = $.valueOf(m.arg);
            if (!arg.equals(m.arg)) {
                return [TFLAG_DIFF, $.valueOf(items_to_cons(m.opr, arg))];
            }
            else {
                return this.transform1(m.opr, m.arg, m);
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
    abstract transform1(opr: Sym, arg: T, expr: Cons1<Sym, T>): [TFLAGS, U];
}