import { is_rat } from "@stemcmicro/atoms";
import { is_base_of_natural_logarithm } from "@stemcmicro/helpers";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";
import { is_mul_2_rat_sym } from "../mul/is_mul_2_rat_sym";

type LL = Sym;
type LR = Cons2<Sym, Rat, Sym>;
type LHS = Cons2<Sym, LL, LR>;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

const guardL = and(is_cons, is_opr_2_lhs_rhs(MATH_POW, is_base_of_natural_logarithm, and(is_cons, is_mul_2_rat_sym)));
const guardR = is_rat;

function cross(lhs: LHS, rhs: RHS): boolean {
    const m = lhs.rhs.lhs;
    const n = rhs;
    return m.isTwo() && n.isHalf();
}

/**
 * (pow (pow e (* 2 x)) 1/2) => (pow e x)
 */
class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("pow_2_pow_2_e_any_rat", MATH_POW, guardL, guardR, cross);
        this.#hash = hash_binop_cons_atom(this.opr, MATH_POW, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const x = lhs.rhs.rhs;
        const e = lhs.lhs;
        const retval = $.valueOf(items_to_cons(MATH_POW, e, x));
        return [TFLAG_DIFF, retval];
    }
}

export const pow_2_pow_2_e_any_rat = mkbuilder<EXP>(Op);
