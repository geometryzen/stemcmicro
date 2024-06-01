import { Boo, booF, booT, one, Rat, Sym, zero } from "@stemcmicro/atoms";
import { Cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Function1 } from "./Function1";
import { GUARD } from "./GUARD";

export abstract class Predicate1<T extends U> extends Function1<T> {
    protected readonly predT: Boo | Rat;
    protected readonly predF: Boo | Rat;
    constructor(
        name: string,
        opr: Sym,
        guard: GUARD<U, T>,
        readonly config: Readonly<EnvConfig>
    ) {
        super(name, opr, guard);
        this.predT = config.useIntegersForPredicates ? one : booT;
        this.predF = config.useIntegersForPredicates ? zero : booF;
    }
    asPredicateValue(x: boolean): Boo | Rat {
        return x ? this.predT : this.predF;
    }
    transform1(opr: Sym, arg: T, expr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, this.asPredicateValue(this.compute(arg, $))];
    }
    abstract compute(arg: T, $: ExtensionEnv): boolean;
}
