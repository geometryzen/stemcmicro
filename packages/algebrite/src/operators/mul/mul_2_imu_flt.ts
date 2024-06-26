import { Imu, is_flt, is_imu } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_IMU } from "@stemcmicro/hashing";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";

type LHS = Imu;
type RHS = Flt;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * Imu * Flt
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Flt", "Imu"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_imu_flt", MATH_MUL, is_imu, is_flt);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_IMU, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    isKind(expr: U, $: ExtensionEnv): expr is EXP {
        if (super.isKind(expr, $)) {
            const rhs = expr.rhs;
            if (rhs.isZero()) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [TFLAG_DIFF, rhs];
    }
}

export const mul_2_imu_flt = mkbuilder<EXP>(Op);
