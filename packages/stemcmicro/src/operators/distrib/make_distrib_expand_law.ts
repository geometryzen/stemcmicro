import { Sym } from "@stemcmicro/atoms";
import { Cons } from "@stemcmicro/tree";
import { Extension, ExtensionBuilder } from "../../env/ExtensionEnv";
import { DistributiveLawExpandLeft } from "./DistributiveLawExpandLeft";
import { DistributiveLawExpandRight } from "./DistributiveLawExpandRight";

class BuilderDistributiveLawExpandLeft implements ExtensionBuilder<Cons> {
    constructor(
        readonly upper: Sym,
        readonly lower: Sym
    ) {}
    create(): Extension<Cons> {
        return new DistributiveLawExpandLeft(this.upper, this.lower);
    }
}

class BuilderDistributiveLawExpandRight implements ExtensionBuilder<Cons> {
    constructor(
        readonly upper: Sym,
        readonly lower: Sym
    ) {}
    create(): Extension<Cons> {
        return new DistributiveLawExpandRight(this.upper, this.lower);
    }
}

export function make_lhs_distrib_expand_law(upper: Sym, lower: Sym): ExtensionBuilder<Cons> {
    return new BuilderDistributiveLawExpandLeft(upper, lower);
}

export function make_rhs_distrib_expand_law(upper: Sym, lower: Sym): ExtensionBuilder<Cons> {
    return new BuilderDistributiveLawExpandRight(upper, lower);
}
