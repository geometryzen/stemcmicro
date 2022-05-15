
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    constructor() {
        // Nothing to see here.
    }
    create($: ExtensionEnv): Operator<Cons> {
        return new Op('inner_2_vector_mul_2_scalar_vector', MATH_INNER, MATH_MUL, $);
    }
}

type LHS = U;
type RHS = BCons<Sym, U, U>;
type EXP = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function (lhs: LHS, rhs: RHS): boolean {
        // const x = lhs;
        const a = rhs.lhs;
        // const y = rhs.rhs;
        return $.isScalar(a);// && $.isVector(x) && $.isVector(y);
    };
}

class Op extends Function2X<U, RHS> implements Operator<EXP> {
    constructor(public readonly name: string, dominantOp: Sym, subOp: Sym, $: ExtensionEnv) {
        super(name, dominantOp, is_any, and(is_cons, is_opr_2_any_any(subOp)), cross($), $);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const x = lhs;
        const a = rhs.lhs;
        const y = rhs.rhs;
        const xy = $.valueOf(makeList(opr, x, y));
        // TODO: In general we may apply a unary operation to a.
        const retval = $.valueOf(makeList(rhs.opr, a, xy));
        return [CHANGED, retval];
    }
}

/**
 * x | (a * y) => a * (x | y) when x,y are arbitrary vectors, and a is an arbitrary scalar.
 */
export const inner_2_vector_mul_2_scalar_vector = new Builder();
