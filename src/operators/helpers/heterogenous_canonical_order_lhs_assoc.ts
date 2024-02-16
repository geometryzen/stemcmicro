import { Extension, ExtensionBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "./and";
import { Cons2 } from "./Cons2";
import { Function2 } from "./Function2";
import { GUARD } from "./GUARD";
import { is_any } from "./is_any";
import { is_opr_2_lhs_rhs } from "./is_opr_2_lhs_rhs";

class Builder<L extends U, R extends U> implements ExtensionBuilder<Cons2<Sym, Cons2<Sym, U, L>, R>> {
    constructor(private readonly name: string, private readonly hash: string, private readonly sym: Sym, private readonly guardL: GUARD<U, L>, private readonly guardR: GUARD<U, R>) {
        // Nothing to see here.
    }
    create(): Extension<Cons2<Sym, Cons2<Sym, U, L>, R>> {
        return new Op(this.name, this.hash, this.sym, this.guardL, this.guardR);
    }
}

/**
 * (X * Z) * A => (X * A) * Z
 */
class Op<L extends U, R extends U> extends Function2<Cons2<Sym, U, L>, R> {
    readonly #hash: string;
    constructor(public readonly name: string, hash: string, sym: Sym, guardL: GUARD<U, L>, guardR: GUARD<U, R>) {
        super(name, sym, and(is_cons, is_opr_2_lhs_rhs(sym, is_any, guardL)), guardR);
        this.#hash = hash;
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Cons2<Sym, U, L>, rhs: R): [TFLAGS, U] {
        const X = lhs.lhs;
        const Z = lhs.rhs;
        const A = rhs;
        return [TFLAG_DIFF, items_to_cons(opr, items_to_cons(lhs.opr, X, A), Z)];
    }
}

/**
 * (X op R) op L => (X op L) op R
 */
export function heterogenous_canonical_order_lhs_assoc<L extends U, R extends U>(name: string, hash: string, op: Sym, guardR: GUARD<U, R>, guardL: GUARD<U, L>) {
    return new Builder(name, hash, op, guardL, guardR);
}
