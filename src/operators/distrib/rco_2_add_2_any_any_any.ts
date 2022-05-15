import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD, MATH_RCO } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * (a + b) >> c => (a >> c) + (b >> c)
 */
class Op extends Function2<BCons<Sym, U, U>, U> implements Operator<Cons> {
    readonly breaker = true;
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('rco_2_add_2_any_any_any', MATH_RCO, and(is_cons, is_opr_2_any_any(MATH_ADD)), is_any, $);
        this.hash = `(>> (+) U)`;
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, U>, rhs: U): [TFLAGS, U] {
        const $ = this.$;
        const a = lhs.lhs;
        const b = lhs.rhs;
        const c = rhs;
        const ac = $.valueOf(makeList(opr, a, c));
        const bc = $.valueOf(makeList(opr, b, c));
        const retval = $.valueOf(makeList(lhs.opr, ac, bc));
        return [CHANGED, retval];
    }
}

export const rco_2_add_2_any_any_any = new Builder();
