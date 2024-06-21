import { Imu, is_imu, one, Sym } from "@stemcmicro/atoms";
import { Cons2, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_IMU } from "@stemcmicro/hashing";
import { MATH_INNER } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

type LHS = Imu;
type RHS = Imu;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * i | i => conj(i) * i => -i * i => 1
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("inner_2_imu_imu", MATH_INNER, is_imu, is_imu);
        this.#hash = hash_binop_atom_atom(MATH_INNER, HASH_IMU, HASH_IMU);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [TFLAG_DIFF, one];
    }
}

export const inner_2_imu_imu = mkbuilder<EXP>(Op);
