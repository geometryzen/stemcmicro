import { Imu, is_imu, is_rat, Rat, Sym } from "math-expression-atoms";
import { items_to_cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_IMU, HASH_RAT } from "../../hashing/hash_info";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

type LHS = Rat;
type RHS = Imu;

/**
 * Rat | i => Rat * i
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('inner_2_rat_imu', MATH_INNER, is_rat, is_imu);
        this.#hash = hash_binop_atom_atom(MATH_INNER, HASH_RAT, HASH_IMU);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [TFLAG_DIFF, items_to_cons(MATH_MUL.clone(opr.pos, opr.end), lhs, rhs)];
    }
}

export const inner_2_rat_imu = mkbuilder(Op);
