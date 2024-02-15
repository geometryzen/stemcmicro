
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_HYP, HASH_SYM } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Hyp } from "../../tree/hyp/Hyp";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_hyp } from "../hyp/is_hyp";
import { is_sym } from "../sym/is_sym";

type LHS = Hyp;
type RHS = Sym;
type EXP = Cons2<Sym, LHS, RHS>

/**
 * Hyp * Sym => Sym * Hyp
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = [];
    constructor(readonly config: Readonly<EnvConfig>) {
        super('mul_2_hyp_sym', MATH_MUL, is_hyp, is_sym);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_HYP, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, exp: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, $.valueOf(items_to_cons(opr, rhs, lhs))];
    }
}

export const mul_2_hyp_sym = mkbuilder<EXP>(Op);
