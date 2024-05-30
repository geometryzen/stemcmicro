import { Imu, is_imu, one, Sym } from "@stemcmicro/atoms";
import { items_to_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_IMU } from "../../hashing/hash_info";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

type LHS = U;
type RHS = Imu;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * X | i => (1 | X) * i
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor() {
        super("inner_2_any_imu", MATH_INNER, is_any, is_imu);
        this.#hash = hash_binop_atom_atom(MATH_INNER, HASH_ANY, HASH_IMU);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const X = lhs;
        const i = rhs;
        const inrP = $.valueOf(items_to_cons(opr, one, X));
        const retval = $.valueOf(items_to_cons(MATH_MUL, inrP, i));
        return [TFLAG_DIFF, retval];
    }
}

export const inner_2_any_imu = mkbuilder<EXP>(Op);
