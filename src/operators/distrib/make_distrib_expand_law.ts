
import { Sym } from "math-expression-atoms";
import { Cons } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder } from "../../env/ExtensionEnv";
import { DistributiveLawExpandLeft } from "./DistributiveLawExpandLeft";
import { DistributiveLawExpandRight } from "./DistributiveLawExpandRight";

class BuilderDistributiveLawExpandLeft implements OperatorBuilder<Cons> {
    constructor(readonly upper: Sym, readonly lower: Sym) {
    }
    create($: ExtensionEnv): Operator<Cons> {
        return new DistributiveLawExpandLeft($, this.upper, this.lower);
    }
}

class BuilderDistributiveLawExpandRight implements OperatorBuilder<Cons> {
    constructor(readonly upper: Sym, readonly lower: Sym) {
    }
    create($: ExtensionEnv): Operator<Cons> {
        return new DistributiveLawExpandRight($, this.upper, this.lower);
    }
}

export function make_lhs_distrib_expand_law(upper: Sym, lower: Sym): OperatorBuilder<Cons> {
    return new BuilderDistributiveLawExpandLeft(upper, lower);
}

export function make_rhs_distrib_expand_law(upper: Sym, lower: Sym): OperatorBuilder<Cons> {
    return new BuilderDistributiveLawExpandRight(upper, lower);
}
