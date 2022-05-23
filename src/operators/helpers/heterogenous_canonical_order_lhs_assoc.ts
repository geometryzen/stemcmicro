import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, makeList, U } from "../../tree/tree";
import { and } from "./and";
import { BCons } from "./BCons";
import { Function2 } from "./Function2";
import { GUARD } from "./GUARD";
import { is_any } from "./is_any";
import { is_opr_2_lhs_rhs } from "./is_opr_2_lhs_rhs";

class Builder<L extends U, R extends U> implements OperatorBuilder<BCons<Sym, BCons<Sym, U, L>, R>> {
    constructor(private readonly name: string, private readonly hash: string, private readonly sym: Sym, private readonly guardL: GUARD<U, L>, private readonly guardR: GUARD<U, R>) {
        // Nothing to see here.
    }
    create($: ExtensionEnv): Operator<BCons<Sym, BCons<Sym, U, L>, R>> {
        return new Op(this.name, this.hash, this.sym, this.guardL, this.guardR, $);
    }
}

/**
 * (X * Z) * A => (X * A) * Z
 */
class Op<L extends U, R extends U> extends Function2<BCons<Sym, U, L>, R> implements Operator<BCons<Sym, BCons<Sym, U, L>, R>> {
    constructor(public readonly name: string, public readonly hash: string, sym: Sym, guardL: GUARD<U, L>, guardR: GUARD<U, R>, $: ExtensionEnv) {
        super(name, sym, and(is_cons, is_opr_2_lhs_rhs(sym, is_any, guardL)), guardR, $);
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, L>, rhs: R): [TFLAGS, U] {
        const X = lhs.lhs;
        const Z = lhs.rhs;
        const A = rhs;
        return [TFLAG_DIFF, makeList(opr, makeList(lhs.opr, X, A), Z)];
    }
}

/**
 * (X op R) op L => (X op L) op R
 */
export function heterogenous_canonical_order_lhs_assoc<L extends U, R extends U>(name: string, hash: string, op: Sym, guardR: GUARD<U, R>, guardL: GUARD<U, L>) {
    return new Builder(name, hash, op, guardL, guardR);
}
