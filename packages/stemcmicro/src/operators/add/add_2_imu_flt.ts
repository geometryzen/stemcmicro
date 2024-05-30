import { Flt, Imu, is_flt, is_imu, Sym } from "math-expression-atoms";
import { Cons2, items_to_cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { FEATURE, mkbuilder, PHASE_FLAGS_EXPANDING_UNION_FACTORING, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_FLT } from "../../hashing/hash_info";
import { MATH_ADD, MATH_POW } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

type LHS = Imu;
type RHS = Flt;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * Imu + Flt => Flt + Imu
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly phases = PHASE_FLAGS_EXPANDING_UNION_FACTORING;
    readonly dependencies: FEATURE[] = ["Flt", "Imu"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_imu_flt", MATH_ADD, is_imu, is_flt);
        // TODO: This looks like it is assuming the structure of imu.
        this.#hash = hash_binop_cons_atom(MATH_ADD, MATH_POW, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [TFLAG_DIFF, items_to_cons(opr, rhs, lhs)];
    }
}

export const add_2_imu_flt = mkbuilder<EXP>(Op);
