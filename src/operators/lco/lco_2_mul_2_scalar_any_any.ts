import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_LCO } from "../../runtime/ns_math";
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
 * (a * x) << y => a * (x << y)
 */
class Op extends Function2<BCons<Sym, U, U>, U> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('lco_2_mul_2_scalar_any_any', MATH_LCO, is_mul_2_scalar_any($), is_any, $);
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, U>, rhs: U): [TFLAGS, U] {
        const a = lhs.lhs;
        const x = lhs.rhs;
        const y = rhs;
        const xy = makeList(opr, x, y);
        const axy = makeList(lhs.opr, a, xy);
        return [TFLAG_DIFF, axy];
    }
}

export const lco_2_mul_2_scalar_any_any = new Builder();
