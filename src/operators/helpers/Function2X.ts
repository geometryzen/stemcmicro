import { CHANGED, changedFlag, ExtensionEnv, NOFLAGS, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { makeList, U } from "../../tree/tree";
import { BCons } from "./BCons";
import { Function2 } from "./Function2";
import { GUARD } from "./GUARD";

/**
 * In addition to predicates for left and right, provided a cross predicate.
 */
export abstract class Function2X<L extends U, R extends U> extends Function2<L, R> {
    constructor(name: string, opr: Sym, guardL: GUARD<U, L>, guardR: GUARD<U, R>, private readonly cross: (lhs: L, rhs: R, expr: BCons<Sym, L, R>) => boolean, $: ExtensionEnv) {
        super(name, opr, guardL, guardR, $);
    }
    match(expr: U): BCons<Sym, L, R> | undefined {
        const m = super.match(expr);
        if (m) {
            if (this.cross(m.lhs, m.rhs, m)) {
                return m;
            }
        }
        return void 0;
    }
    transform(expr: U): [TFLAGS, U] {
        const m = this.match(expr);
        if (m) {
            const $ = this.$;
            const [flagsL, lhs] = $.transform(m.lhs);
            const [flagsR, rhs] = $.transform(m.rhs);
            if (changedFlag(flagsL) || changedFlag(flagsR)) {
                return [CHANGED, $.valueOf(makeList(m.opr, lhs, rhs))];
            }
            else {
                // Delegate to the function that must be implemented by the derived, concrete, class.
                return this.transform2(m.opr, m.lhs, m.rhs, m);
            }
        }
        return [NOFLAGS, expr];
    }
}