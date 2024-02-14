
import { Imu, is_imu, is_rat } from "math-expression-atoms";
import { Cons2, items_to_cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, make_extension_builder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_INNER, MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Function2 } from "../helpers/Function2";

type LHS = Imu;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * i | Rat => conj(i) * Rat => -i * Rat
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('inner_2_imu_rat', MATH_INNER, is_imu, is_rat);
        this.#hash = hash_binop_cons_atom(MATH_INNER, MATH_POW, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, $.negate(items_to_cons(MATH_MUL.clone(opr.pos, opr.end), lhs, rhs))];
    }
}

export const inner_2_imu_rat = make_extension_builder<EXP>(Op);
