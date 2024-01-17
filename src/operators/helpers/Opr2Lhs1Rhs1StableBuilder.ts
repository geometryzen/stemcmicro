import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_HALT, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "./and";
import { BCons } from "./BCons";
import { Function2 } from "./Function2";
import { is_opr_1_any } from "./is_opr_1_any";
import { UCons } from "./UCons";

export class Opr2Lhs1Rhs1StableBuilder implements OperatorBuilder<Cons> {
    constructor(public readonly opr: Sym, public readonly lhs: Sym, public readonly rhs: Sym) {
        // Nothing to see here.
    }
    create($: ExtensionEnv): Operator<Cons> {
        return new Op(this.opr, this.lhs, this.rhs, $);
    }
}

type LHS = UCons<Sym, U>;
type RHS = UCons<Sym, U>;
type EXPR = BCons<Sym, LHS, RHS>;

/**
 * (opr (lhs) (rhs)) is not changed
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly #hash: string;
    constructor(opr: Sym, lhs: Sym, rhs: Sym, $: ExtensionEnv) {
        super(`${opr.key()}_2_${lhs.key()}_1_any_${rhs.key()}_1_any`, opr, and(is_cons, is_opr_1_any(lhs)), and(is_cons, is_opr_1_any(rhs)), $);
        this.#hash = hash_binop_cons_cons(opr, lhs, rhs);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXPR): [TFLAGS, U] {
        return [TFLAG_HALT, orig];
    }
}
