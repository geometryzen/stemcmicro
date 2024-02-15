import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_unaop_cons } from "../../hashing/hash_info";
import { SINH } from "../../runtime/constants";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons1 } from "../helpers/Cons1";
import { Cons2 } from "../helpers/Cons2";
import { Function1 } from "../helpers/Function1";
import { is_opr_2_any_rhs } from "../helpers/is_opr_2_any_rhs";
import { is_imu } from "../imu/is_imu";
import { MATH_SIN } from "./MATH_SIN";

type AL = U;
type AR = U;
type ARG = Cons2<Sym, AL, AR>;
type EXP = Cons1<Sym, ARG>;

/**
 * sin(X * i) => sinh(X) * i 
 */
class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('sin_mul_2_any_imu', MATH_SIN, and(is_cons, is_opr_2_any_rhs(MATH_MUL, is_imu)));
        this.#hash = hash_unaop_cons(MATH_SIN, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const X = arg.lhs;
        const imu = arg.rhs;
        if ($.isExpanding()) {
            const sinh_X = $.valueOf(items_to_cons(SINH, X));
            const retval = $.valueOf(items_to_cons(MATH_MUL, sinh_X, imu));
            return [TFLAG_DIFF, retval];
        }
        return [TFLAG_HALT, expr];
    }
}

export const sin_mul_2_any_imu = mkbuilder<EXP>(Op);
