import { CostTable } from "../../env/CostTable";
import { changedFlag, CHANGED, ExtensionEnv, NOFLAGS, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, makeList, U } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";
import { FunctionVarArgs } from "./FunctionVarArgs";
import { GUARD } from "./GUARD";
import { UCons } from "./UCons";

export abstract class Function1<T extends U> extends FunctionVarArgs {
    constructor(name: string, opr: Sym, private readonly guard: GUARD<U, T>, $: ExtensionEnv) {
        super(name, opr, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cost(expr: UCons<Sym, T>, costs: CostTable, depth: number): number {
        const $ = this.$;
        const childDepth = depth + 1;
        return $.cost(expr.opr, childDepth) + $.cost(expr.arg, childDepth);
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
    transform(expr: U): [TFLAGS, U] {
        const m = this.match(expr);
        if (m) {
            const $ = this.$;
            const [flags, arg] = $.transform(m.arg);
            if (changedFlag(flags)) {
                return [CHANGED, $.valueOf(makeList(m.opr, arg))];
            }
            else {
                return this.transform1(m.opr, m.arg, m);
            }
        }
        return [NOFLAGS, expr];
    }
    abstract transform1(opr: Sym, arg: T, expr: UCons<Sym, T>): [TFLAGS, U];
}