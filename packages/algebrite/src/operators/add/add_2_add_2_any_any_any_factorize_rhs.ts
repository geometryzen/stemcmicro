import { one } from "@stemcmicro/atoms";
import { do_factorize_rhs } from "../../calculators/factorize/do_factorize_rhs";
import { is_factorize_rhs } from "../../calculators/factorize/is_factorize_rhs";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "@stemcmicro/hashing";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";
import { is_add_2_any_any } from "./is_add_2_any_any";

type LHS = Cons2<Sym, U, U>;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

function cross(lhs: LHS, rhs: RHS): boolean {
    // A problem with this is that we have performed the tree transformation either twice
    // if is successful, or partially if it fails.
    return is_factorize_rhs(lhs.rhs, rhs);
}

/**
 * (X + Y) + Z => (X + m * A) + n * A => X + (m + n) * A, where Y = m * A, and Z = n * A.
 */
class Op extends Function2X<LHS, RHS> implements Extension<EXP> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_add_2_any_any_any_factorize_rhs", MATH_ADD, and(is_cons, is_add_2_any_any), is_any, cross);
        this.#hash = hash_binop_cons_atom(MATH_ADD, MATH_ADD, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
        if ($.isExpanding()) {
            const X = lhs.lhs;
            const Y = lhs.rhs;
            const Z = rhs;
            const mnA = do_factorize_rhs(Y, Z, one, orig, $)[1];
            return [TFLAG_DIFF, $.valueOf(items_to_cons(MATH_ADD, X, mnA))];
        } else {
            return [TFLAG_NONE, orig];
        }
    }
}

export const add_2_add_2_any_any_any_factorize_rhs = mkbuilder(Op);
