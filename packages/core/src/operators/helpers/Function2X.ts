import { Sym } from "@stemcmicro/atoms";
import { Cons2, items_to_cons, U } from "@stemcmicro/tree";
import { diffFlag, ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Function2 } from "./Function2";
import { GUARD } from "./GUARD";

/**
 * In addition to predicates for left and right, provided a cross predicate.
 */
export abstract class Function2X<L extends U, R extends U> extends Function2<L, R> {
    constructor(
        name: string,
        opr: Sym,
        guardL: GUARD<U, L>,
        guardR: GUARD<U, R>,
        private readonly cross: (lhs: L, rhs: R, expr: Cons2<Sym, L, R>, $: ExtensionEnv) => boolean
    ) {
        super(name, opr, guardL, guardR);
    }
    match(expr: U, $: ExtensionEnv): Cons2<Sym, L, R> | undefined {
        const m = super.match(expr, $);
        if (m) {
            if (this.cross(m.lhs, m.rhs, m, $)) {
                return m;
            }
        }
        return void 0;
    }
    transform(expr: U, $: ExtensionEnv): [TFLAGS, U] {
        const m = this.match(expr, $);
        if (m) {
            const [flagsL, lhs] = $.transform(m.lhs);
            const [flagsR, rhs] = $.transform(m.rhs);
            if (diffFlag(flagsL) || diffFlag(flagsR)) {
                return [TFLAG_DIFF, $.valueOf(items_to_cons(m.opr, lhs, rhs))];
            } else {
                // Delegate to the function that must be implemented by the derived, concrete, class.
                return this.transform2(m.opr, m.lhs, m.rhs, m, $);
            }
        }
        return [TFLAG_NONE, expr];
    }
}
