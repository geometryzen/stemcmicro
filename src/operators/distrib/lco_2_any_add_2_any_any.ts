import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD, MATH_LCO } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { is_add_2_any_any } from "../add/is_add_2_any_any";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * a << (b + c) => (a << b) + (a >> c)
 */
class Op extends Function2<U, BCons<Sym, U, U>> implements Operator<Cons> {
    readonly name = 'lco_2_add_2_any_any_any';
    constructor($: ExtensionEnv) {
        super('lco_2_add_2_any_any_any', MATH_LCO, is_any, and(is_cons, is_add_2_any_any), $);
    }
    transform2(opr: Sym, lhs: U, rhs: BCons<Sym, U, U>): [TFLAGS, U] {
        const a = lhs;
        const b = rhs.lhs;
        const c = rhs.rhs;
        const ab = makeList(MATH_LCO, a, b);
        const ac = makeList(MATH_LCO, a, c);
        const retval = makeList(MATH_ADD, ab, ac);
        return [TFLAG_DIFF, retval];
    }
}

export const lco_2_any_add_2_any_any = new Builder();
