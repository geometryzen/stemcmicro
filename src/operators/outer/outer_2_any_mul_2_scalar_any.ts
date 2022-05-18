import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_OUTER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, makeList, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_mul_2_scalar_any } from "../mul/is_mul_2_scalar_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * x ^ (a * y) => a * (x ^ y)
 */
class Op extends Function2<U, BCons<Sym, U, U>> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('outer_2_any_mul_2_scalar_any', MATH_OUTER, is_any, is_mul_2_scalar_any($), $);
    }
    transform2(opr: Sym, lhs: U, rhs: BCons<Sym, U, U>): [TFLAGS, U] {
        const x = lhs;
        const a = rhs.lhs;
        const y = rhs.rhs;
        const xy = makeList(opr, x, y);
        const retval = makeList(rhs.opr, a, xy);
        return [CHANGED, retval];
    }
}

export const outer_2_any_mul_2_scalar_any = new Builder();
