import { Boo, booF, booT, one, Rat, Sym, zero } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { CompositeOperator } from "./CompositeOperator";

export abstract class CompositePredicate extends CompositeOperator {
    protected readonly predT: Boo | Rat;
    protected readonly predF: Boo | Rat;
    constructor(
        outerOpr: Sym,
        innerOpr: Sym,
        readonly config: Readonly<EnvConfig>
    ) {
        super(outerOpr, innerOpr);
        this.predT = config.useIntegersForPredicates ? one : booT;
        this.predF = config.useIntegersForPredicates ? zero : booF;
    }
    asPredicateValue(x: boolean): Boo | Rat {
        return x ? this.predT : this.predF;
    }
    transform1(opr: Sym, inner: Cons, outer: Cons, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, this.asPredicateValue(this.compute(inner, $))];
    }
    abstract compute(inner: Cons, $: ExtensionEnv): boolean;
}
