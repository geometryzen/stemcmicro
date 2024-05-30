import { imu, Imu, is_imu, is_rat, negOne, one, Rat, Sym } from "@stemcmicro/atoms";
import { Cons2, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_IMU, HASH_RAT } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { half } from "../../tree/rat/Rat";
import { Function2 } from "../helpers/Function2";

type LHS = Imu;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("pow_2_imu_rat", MATH_POW, is_imu, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_POW, HASH_IMU, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Imu, rhs: Rat, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        if (rhs.isEven()) {
            const n = rhs.mul(half);
            if (n.isEven()) {
                return [TFLAG_DIFF, one];
            } else {
                return [TFLAG_DIFF, negOne];
            }
        } else if (rhs.isOdd()) {
            const n = rhs.succ().mul(half);
            if (n.isEven()) {
                return [TFLAG_DIFF, $.negate(imu)];
            } else {
                return [TFLAG_DIFF, imu];
            }
        } else {
            // We've dealt with all the integer cases.
            // We are now getting into roots of i.
            return [TFLAG_NONE, expr];
        }
    }
}

export const pow_2_imu_rat = mkbuilder<EXP>(Op);
