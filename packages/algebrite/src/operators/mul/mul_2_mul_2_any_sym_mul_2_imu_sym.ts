import { Rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "@stemcmicro/hashing";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_any_sym } from "./is_mul_2_any_sym";
import { is_mul_2_imu_any } from "./is_mul_2_imu_any";

/**
 * (X * a) * (i * Y) => (X * i) * (a * Y)
 */
class Op extends Function2<Cons2<Sym, U, Sym>, Cons2<Sym, Cons2<Sym, Rat, Rat>, U>> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_mul_2_any_sym_mul_2_imu_sym", MATH_MUL, and(is_cons, is_mul_2_any_sym), and(is_cons, is_mul_2_imu_any));
        this.#hash = hash_binop_cons_cons(MATH_MUL, MATH_MUL, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Cons2<Sym, U, Sym>, rhs: Cons2<Sym, Cons2<Sym, Rat, Rat>, U>, exp: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const X = lhs.lhs;
        const a = lhs.rhs;
        const i = rhs.lhs;
        const Y = rhs.rhs;
        const Xi = $.valueOf(items_to_cons(MATH_MUL, X, i));
        const aY = $.valueOf(items_to_cons(MATH_MUL, a, Y));
        const retval = $.valueOf(items_to_cons(MATH_MUL, Xi, aY));
        return [TFLAG_DIFF, retval];
    }
}

export const mul_2_mul_2_any_sym_mul_2_imu_sym = mkbuilder(Op);
