import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_unaop_cons } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Num } from "../../tree/num/Num";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function1 } from "../helpers/Function1";
import { is_opr_2_lhs_any } from "../helpers/is_opr_2_lhs_any";
import { UCons } from "../helpers/UCons";
import { is_num } from "../num/is_num";
import { MATH_CONJ } from "./MATH_CONJ";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type AL = Num;
type AR = U;
type ARG = BCons<Sym, AL, AR>;
type EXP = UCons<Sym, ARG>;

/**
 * conj(Num * X) => Num * conj(X) 
 */
class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('conj_mul_2_num_any', MATH_CONJ, and(is_cons, is_opr_2_lhs_any(MATH_MUL, is_num)), $);
        this.hash = hash_unaop_cons(MATH_CONJ, MATH_MUL);
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const L: Num = arg.lhs;
        const R: U = arg.rhs;
        if ($.isExpanding()) {
            const conj_R = $.valueOf(items_to_cons(MATH_CONJ, R));
            const retval = makeList(MATH_MUL, L, conj_R);
            return [TFLAG_DIFF, retval];
        }
        return [TFLAG_HALT, expr];
    }
}

export const conj_mul_2_num_any = new Builder();
