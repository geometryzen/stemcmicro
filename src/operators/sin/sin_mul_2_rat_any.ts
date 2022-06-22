import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_unaop_cons } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function1 } from "../helpers/Function1";
import { is_opr_2_lhs_any } from "../helpers/is_opr_2_lhs_any";
import { UCons } from "../helpers/UCons";
import { is_rat } from "../rat/is_rat";
import { transform_sin } from "./transform_sin";
import { MATH_SIN } from "./MATH_SIN";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type AL = Rat;
type AR = U;
type ARG = BCons<Sym, AL, AR>;
type EXP = UCons<Sym, ARG>;

/**
 * sin((-1 * k) * X) => -1 * sin(k * X) 
 */
class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('sin_mul_2_rat_any', MATH_SIN, and(is_cons, is_opr_2_lhs_any(MATH_MUL, is_rat)), $);
        this.hash = hash_unaop_cons(MATH_SIN, MATH_MUL);
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const k = arg.lhs;
        const X = arg.rhs;
        if (k.isNegative()) {
            const kX = $.valueOf(items_to_cons(MATH_MUL, k.abs(), X));
            const sin_kX = $.valueOf(items_to_cons(MATH_SIN, kX));
            const minus_sin_kX = $.negate(sin_kX);
            return [TFLAG_DIFF, minus_sin_kX];
        }
        return transform_sin(arg, expr, $);
    }
}

export const sin_mul_2_rat_any = new Builder();
