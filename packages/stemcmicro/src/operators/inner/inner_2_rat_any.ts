import { is_rat, Rat, Sym, zero } from "@stemcmicro/atoms";
import { Cons2, items_to_cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

type LHS = Rat;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * The assumption is that the expr has not been evaluated.
 */
function eval_inner_2_rat_any(expr: EXP, $: ExtensionEnv): U {
    const lhs = expr.lhs;
    const rhs = expr.rhs;
    try {
        const valueR = $.valueOf(rhs);
        try {
            return inner_2_rat_any(lhs, rhs, $);
        } finally {
            valueR.release();
        }
    } finally {
        lhs.release();
        rhs.release();
    }
}

/**
 * The assumption is that lhs and rhs have been evaluated.
 */
function inner_2_rat_any(lhs: Rat, rhs: U, $: ExtensionEnv): U {
    if (lhs.isZero()) {
        zero.addRef();
        return zero;
    } else if (lhs.isOne()) {
        rhs.addRef();
        // No need to evaluate because by assumption it already has been.
        return rhs;
    } else {
        const transformed = items_to_cons(MATH_MUL, lhs, rhs);
        try {
            return $.valueOf(transformed);
        } finally {
            transformed.release();
        }
    }
}

/**
 *
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("inner_2_rat_any", MATH_INNER, is_rat, is_any);
        this.#hash = hash_binop_atom_atom(MATH_INNER, HASH_RAT, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: EXP, $: ExtensionEnv) {
        return eval_inner_2_rat_any(expr, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const retval = eval_inner_2_rat_any(orig, $);
        // We know that the expression will always be transformed.
        // Should we assert this as a postcondition (with a flag to optimize)?
        return [TFLAG_DIFF, retval];
    }
}

export const inner_2_rat_any_builder = mkbuilder<EXP>(Op);
