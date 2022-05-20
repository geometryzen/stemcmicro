import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { MATH_MUL, MATH_RCO } from "../../runtime/ns_math";
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
 * (a * x) >> y => a * (x >> y)
 */
class Op extends Function2<BCons<Sym, U, U>, U> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('rco_2_mul_2_scalar_any_any', MATH_RCO, is_mul_2_scalar_any($), is_any, $);
        this.hash = hash_binop_cons_atom(MATH_RCO, MATH_MUL, HASH_ANY);
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, U>, rhs: U): [TFLAGS, U] {
        const $ = this.$;
        const a = lhs.lhs;
        const x = lhs.rhs;
        const y = rhs;
        const xy = $.valueOf(makeList(opr, x, y));
        const axy = $.valueOf(makeList(lhs.opr, a, xy));
        return [CHANGED, axy];
    }
}

export const rco_2_mul_2_scalar_any_any = new Builder();
