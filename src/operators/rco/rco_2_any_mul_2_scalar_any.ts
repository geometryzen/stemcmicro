import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_RCO } from "../../runtime/ns_math";
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
 * x >> (a * y) => a * (x >> y)
 */
class Op extends Function2<U, BCons<Sym, U, U>> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('rco_2_any_mul_2_scalar_any', MATH_RCO, is_any, is_mul_2_scalar_any($), $);
        this.hash = `(>> U (*))`;
    }
    transform2(opr: Sym, lhs: U, rhs: BCons<Sym, U, U>): [TFLAGS, U] {
        const $ = this.$;
        const x = lhs;
        const a = rhs.lhs;
        const y = rhs.rhs;
        const xy = $.valueOf(makeList(opr, x, y));
        const retval = $.valueOf(makeList(rhs.opr, a, xy));
        return [CHANGED, retval];
    }
}

export const rco_2_any_mul_2_scalar_any = new Builder();
