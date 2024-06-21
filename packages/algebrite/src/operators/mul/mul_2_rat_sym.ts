import { is_rat, is_sym, Rat, Sym, zero } from "@stemcmicro/atoms";
import { Cons2, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "@stemcmicro/hashing";
import { MATH_MUL } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

type LHS = Rat;
type RHS = Sym;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (* Rat Sym) => (* Rat Sym) STABLE
 *             => 0 if Rat is zero
 *             => Sym if Rat is one
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_rat_sym", MATH_MUL, is_rat, is_sym);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_RAT, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    isKind(expr: U, $: ExtensionEnv): expr is EXP {
        if (super.isKind(expr, $)) {
            const lhs = expr.lhs;
            return lhs.isZero() || lhs.isOne();
        } else {
            return false;
        }
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        if (lhs.isZero()) {
            return [TFLAG_DIFF, zero];
        }
        if (lhs.isOne()) {
            return [TFLAG_DIFF, rhs];
        }
        return [TFLAG_HALT, expr];
    }
}

export const mul_2_rat_sym = mkbuilder<EXP>(Op);
