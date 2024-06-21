import { Rat, zero } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_HYP, HASH_RAT } from "@stemcmicro/hashing";
import { items_to_cons } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Hyp } from "../../tree/hyp/Hyp";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_hyp } from "../hyp/is_hyp";
import { is_rat } from "../rat/is_rat";

type LHS = Hyp;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (* Hyp Rat) => (* Rat Hyp)
 *             => 0 if Rat is zero
 *             => Sym if Rat is one
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_hyp_rat", MATH_MUL, is_hyp, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_HYP, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        // If the base class binds the symbol to something else then none of this code below will be called.
        // Therefore, you can consider that this code only applies to unbound symbols.
        if (rhs.isZero()) {
            return [TFLAG_DIFF, zero];
        }
        if (rhs.isOne()) {
            return [TFLAG_DIFF, lhs];
        }
        return [TFLAG_DIFF, items_to_cons(opr, rhs, lhs)];
    }
}

export const mul_2_hyp_rat = mkbuilder<EXP>(Op);
