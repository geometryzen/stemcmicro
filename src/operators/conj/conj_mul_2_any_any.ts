import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_unaop_cons } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function1 } from "../helpers/Function1";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";
import { UCons } from "../helpers/UCons";
import { MATH_CONJ } from "./MATH_CONJ";

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
 * conj(a * b) => conj(a) * conj(b), for a,b scalars. 
 */
class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        // TODO; Could the name be replaced by the hash?
        super('conj_mul_2_any_any', MATH_CONJ, and(is_cons, is_opr_2_any_any(MATH_MUL)), $);
        this.hash = hash_unaop_cons(MATH_CONJ, MATH_MUL);
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        // console.lg(`${this.name} arg=>${render_as_infix(arg, this.$)} expr=>${render_as_infix(expr, this.$)}`);
        const $ = this.$;
        const M: Sym = arg.opr;
        const L: AL = arg.lhs;
        const R: AR = arg.rhs;
        // console.lg(`isExpanding=${$.isExpanding()}`);
        if ($.isExpanding()) {
            if ($.isScalar(L) && $.isScalar(R)) {
                const conj_L = $.valueOf(items_to_cons(MATH_CONJ, L));
                const conj_R = $.valueOf(items_to_cons(MATH_CONJ, R));
                const retval = items_to_cons(M, conj_L, conj_R);
                return [TFLAG_DIFF, retval];
            }
            else {
                return [TFLAG_NONE, expr];
            }
        }
        return [TFLAG_HALT, expr];
    }
}

export const conj_mul_2_any_any = new Builder();
