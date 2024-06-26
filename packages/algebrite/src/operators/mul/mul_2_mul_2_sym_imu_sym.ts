import { Imu, is_imu } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, SIGN_GT, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "@stemcmicro/hashing";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";
import { is_sym } from "../sym/is_sym";

type LL = Sym;
type LR = Imu;
type LHS = Cons2<Sym, LL, LR>;
type RHS = Sym;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (a * i) * b => (a * b) * i
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_mul_2_sym_imu_sym", MATH_MUL, and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, is_sym, is_imu)), is_sym);
        this.#hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const a = lhs.lhs;
        const i = lhs.rhs;
        const b = rhs;
        switch ($.compareFn(opr)(i, b)) {
            case SIGN_GT: {
                const ab = $.valueOf(items_to_cons(opr, a, b));
                const abi = $.valueOf(items_to_cons(MATH_MUL, ab, i));
                // console.lg(`${this.name} ${print_expr(orig, $)} ==> ${print_expr(Xia, $)}`);
                return [TFLAG_DIFF, abi];
            }
            default: {
                return [TFLAG_NONE, orig];
            }
        }
    }
}

export const mul_2_mul_2_sym_imu_sym = mkbuilder<EXP>(Op);
