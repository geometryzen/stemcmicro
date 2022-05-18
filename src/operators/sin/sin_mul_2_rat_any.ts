import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, STABLE, TFLAGS } from "../../env/ExtensionEnv";
import { hash_unaop_cons } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function1 } from "../helpers/Function1";
import { is_opr_2_lhs_any } from "../helpers/is_opr_2_lhs_any";
import { UCons } from "../helpers/UCons";
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
            const A = $.valueOf(makeList(MATH_MUL, k.abs(), X));
            const B = $.valueOf(makeList(MATH_SIN, A));
            const C = $.negate(B);
            return [CHANGED, C];
        }
        return [STABLE, expr];
    }
}

export const sin_mul_2_rat_any = new Builder();
