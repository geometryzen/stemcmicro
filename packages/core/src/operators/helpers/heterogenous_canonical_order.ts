import { Extension, ExtensionBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { items_to_cons } from "../../makeList";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "./Cons2";
import { Function2 } from "./Function2";
import { GUARD } from "./GUARD";

class Builder<L extends U, R extends U> implements ExtensionBuilder<Cons2<Sym, L, R>> {
    constructor(
        private readonly name: string,
        private readonly hash: string,
        private readonly opr: Sym,
        private readonly guardL: GUARD<U, L>,
        private readonly guardR: GUARD<U, R>
    ) {
        // Nothing to see here.
    }
    create(): Extension<Cons2<Sym, L, R>> {
        return new FlipOperator(this.name, this.hash, this.opr, this.guardL, this.guardR);
    }
}

class FlipOperator<L extends U, R extends U> extends Function2<L, R> {
    readonly #hash: string;
    constructor(
        public readonly name: string,
        hash: string,
        opr: Sym,
        guardL: GUARD<U, L>,
        guardR: GUARD<U, R>
    ) {
        super(name, opr, guardL, guardR);
        this.#hash = hash;
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: L, rhs: R): [TFLAGS, U] {
        return [TFLAG_DIFF, items_to_cons(opr, rhs, lhs)];
    }
}

export function heterogenous_canonical_order<L extends U, R extends U>(name: string, hash: string, opr: Sym, guardR: GUARD<U, R>, guardL: GUARD<U, L>): Builder<L, R> {
    return new Builder(name, hash, opr, guardL, guardR);
}
