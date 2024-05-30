import { Imu, is_flt, is_imu } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_IMU } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";

type LHS = Flt;
type RHS = Imu;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * Flt * Imu
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Flt", "Imu"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_flt_imu", MATH_MUL, is_flt, is_imu);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_FLT, HASH_IMU);
    }
    get hash(): string {
        return this.#hash;
    }
    // TODO
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        if (lhs.isZero()) {
            return [TFLAG_DIFF, lhs];
        }
        if (lhs.isOne()) {
            // Even though one is the identity element for multiplication, we have to keep
            // the factor of 1.0 to know that we are using floats.
            return [TFLAG_NONE, expr];
        }
        return [TFLAG_HALT, expr];
    }
}

export const mul_2_flt_imu = mkbuilder(Op);
