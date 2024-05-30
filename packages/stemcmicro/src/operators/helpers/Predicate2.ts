import { Boo, booF, booT, one, Rat, Sym, zero } from "@stemcmicro/atoms";
import { Cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Function2 } from "./Function2";
import { GUARD } from "./GUARD";

export abstract class Predicate2<L extends U, R extends U> extends Function2<L, R> {
    protected readonly predT: Boo | Rat;
    protected readonly predF: Boo | Rat;
    constructor(
        name: string,
        opr: Sym,
        guardL: GUARD<U, L>,
        guardR: GUARD<U, R>,
        readonly config: Readonly<EnvConfig>
    ) {
        super(name, opr, guardL, guardR);
        this.predT = config.useIntegersForPredicates ? one : booT;
        this.predF = config.useIntegersForPredicates ? zero : booF;
    }
    asPredicateValue(x: boolean): Boo | Rat {
        return x ? this.predT : this.predF;
    }
    transform2(opr: Sym, lhs: L, rhs: R, expr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, this.asPredicateValue(this.compute(lhs, rhs, $))];
    }
    abstract compute(lhs: L, rhs: R, $: ExtensionEnv): boolean;
}
