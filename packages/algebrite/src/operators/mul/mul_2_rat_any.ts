import { Rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_RAT } from "@stemcmicro/hashing";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_rat } from "../rat/is_rat";

type LHS = Rat;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

//
// TODO: We can choose whether to get reuse by extending classes or by containing functions, or both.
//
function multiply_rat_any(lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
    if (lhs.isZero()) {
        return [TFLAG_DIFF, lhs];
    } else if (lhs.isOne()) {
        return [TFLAG_DIFF, rhs];
    }
    // TODO: It's important for this to be NOFLAGS rather than STABLE.
    // e.g. Rat*(Blade*Uom) will not be processed further.
    return [TFLAG_NONE, expr];
}

/**
 * Rat * X
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_rat_any", MATH_MUL, is_rat, is_any);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_RAT, HASH_ANY);
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
        return multiply_rat_any(lhs, rhs, expr);
    }
}

export const mul_2_rat_any = mkbuilder(Op);
