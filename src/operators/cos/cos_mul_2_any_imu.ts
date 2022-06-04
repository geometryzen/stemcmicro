import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_unaop_cons } from "../../hashing/hash_info";
import { COSH } from "../../runtime/constants";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function1 } from "../helpers/Function1";
import { is_opr_2_any_rhs } from "../helpers/is_opr_2_any_rhs";
import { UCons } from "../helpers/UCons";
import { is_imu } from "../imu/is_imu";
import { MATH_COS } from "./MATH_COS";

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
 * cos(X * i) => cosh(X) 
 */
class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('cos_mul_2_any_imu', MATH_COS, and(is_cons, is_opr_2_any_rhs(MATH_MUL, is_imu)), $);
        this.hash = hash_unaop_cons(MATH_COS, MATH_MUL);
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const X = arg.lhs;
        if ($.isExpanding()) {
            const cosh_X = $.valueOf(items_to_cons(COSH, X));
            return [TFLAG_DIFF, cosh_X];
        }
        return [TFLAG_HALT, expr];
    }
}

export const cos_mul_2_any_imu = new Builder();
