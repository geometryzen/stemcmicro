import { ExtensionEnv, Operator, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";
import { FunctionVarArgs } from "./FunctionVarArgs";
import { GUARD } from "./GUARD";
import { UCons } from "./UCons";

export abstract class Function1<T extends U> extends FunctionVarArgs implements Operator<UCons<Sym, T>> {
    constructor(name: string, opr: Sym, private readonly guard: GUARD<U, T>, $: ExtensionEnv) {
        super(name, opr, $);
    }
    isKind(expr: U): expr is UCons<Sym, T> {
        return !!this.match(expr);
    }
    match(expr: U): UCons<Sym, T> | undefined {
        if (is_cons(expr) && expr.length === 2) {
            const opr = expr.opr;
            const arg = expr.item(1);
            if (is_sym(opr) && this.opr.equalsSym(opr) && this.guard(arg)) {
                return expr as UCons<Sym, T>;
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
    abstract transform1(opr: Sym, arg: T, expr: UCons<Sym, T>): [TFLAGS, U];
}