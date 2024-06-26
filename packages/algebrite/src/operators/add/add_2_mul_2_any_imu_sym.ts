import { Imu, is_imu } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "@stemcmicro/hashing";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { binswap } from "../helpers/binswap";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";
import { is_sym } from "../sym/is_sym";

type LL = U;
type LR = Imu;
type LHS = Cons2<Sym, LL, LR>;
type RHS = Sym;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (y * i) + x => x + (y * i)
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_mul_2_any_imu_sym", MATH_ADD, and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, is_any, is_imu)), is_sym);
        this.#hash = hash_binop_cons_atom(MATH_ADD, MATH_MUL, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        return [TFLAG_DIFF, binswap(orig)];
    }
}

export const add_2_mul_2_any_imu_sym = mkbuilder(Op);
