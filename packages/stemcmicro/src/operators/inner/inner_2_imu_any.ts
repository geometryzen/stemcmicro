import { Imu, is_imu, one, Sym } from "@stemcmicro/atoms";
import { Cons2, items_to_cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_IMU } from "../../hashing/hash_info";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

type LHS = Imu;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * i | X => conj(i) * (1 | X) => -i * (1|X)
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("inner_2_imu_any", MATH_INNER, is_imu, is_any);
        this.#hash = hash_binop_atom_atom(MATH_INNER, HASH_IMU, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const i = lhs;
        const X = rhs;
        const negI = $.negate(i);
        const inrP = $.valueOf(items_to_cons(opr, one, X));
        const retval = $.valueOf(items_to_cons(MATH_MUL, negI, inrP));
        return [TFLAG_DIFF, retval];
    }
}

export const inner_2_imu_any = mkbuilder<EXP>(Op);
