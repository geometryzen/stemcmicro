import { Imu, is_imu } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, SIGN_GT, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_SYM } from "@stemcmicro/hashing";
import { items_to_cons } from "../../makeList";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

type LHS = Sym;
type RHS = Imu;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * Sym * Imu may be ordered consistently using compare_factors.
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_sym_imu", MATH_MUL, is_sym, is_imu);
        this.#hash = hash_binop_atom_cons(MATH_MUL, HASH_SYM, MATH_POW);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
        switch ($.compareFn(opr)(lhs, rhs)) {
            case SIGN_GT: {
                return [TFLAG_DIFF, $.valueOf(items_to_cons(opr, rhs, lhs))];
            }
            default: {
                return [TFLAG_NONE, orig];
            }
        }
    }
}

export const mul_2_sym_imu = mkbuilder<EXP>(Op);
