
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { MATH_CONJ } from "../conj/MATH_CONJ";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op(MATH_INNER, MATH_MUL, $);
    }
}

type LHS = BCons<Sym, U, U>;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>

function cross($: ExtensionEnv) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function (lhs: LHS, rhs: RHS): boolean {
        const a = lhs.lhs;
        // const x = lhs.rhs;
        // const y = rhs;
        return $.isScalar(a);// && $.isVector(x) && $.isVector(y);
    };
}

//
// This operator lacks generality because it literally means that the LHS is a multiplication
// operation with the RHS being a vector. It doesn't handle the nested case (((scalar * a1) * a2) * ...) 
//

/**
 * (a * x) | y => conj(a) * (x | y)
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    constructor(domOp: Sym, subOp: Sym, $: ExtensionEnv) {
        super('inner_2_mul_2_scalar_vector_vector', domOp, and(is_cons, is_opr_2_any_any(subOp)), is_any, cross($), $);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const a = lhs.lhs;
        const x = lhs.rhs;
        const y = rhs;
        const xy = $.valueOf(makeList(opr, x, y));
        const ca = $.valueOf(makeList(MATH_CONJ, a));
        const retval = $.valueOf(makeList(lhs.opr, ca, xy));
        return [CHANGED, retval];
    }
}

export const inner_2_mul_2_scalar_vector_vector = new Builder();
