import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_unaop_cons } from "../../hashing/hash_info";
import { SINH } from "../../runtime/constants";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function1 } from "../helpers/Function1";
import { is_opr_2_any_rhs } from "../helpers/is_opr_2_any_rhs";
import { UCons } from "../helpers/UCons";
import { is_imu } from "../imu/is_imu";
import { MATH_SIN } from "./MATH_SIN";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type AL = U;
type AR = U;
type ARG = BCons<Sym, AL, AR>;
type EXP = UCons<Sym, ARG>;

/**
 * sin(X * i) => sinh(X) * i 
 */
class Op extends Function1<ARG> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('sin_mul_2_any_imu', MATH_SIN, and(is_cons, is_opr_2_any_rhs(MATH_MUL, is_imu)), $);
        this.#hash = hash_unaop_cons(MATH_SIN, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
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

export const sin_mul_2_any_imu = new Builder();
