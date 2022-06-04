import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD, MATH_OUTER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
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
 * (a + b) ^ c => a ^ c + b ^ c
 */
class Op extends Function2<BCons<Sym, U, U>, U> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('outer_2_add_2_any_any_any', MATH_OUTER, and(is_cons, is_add_2_any_any), is_any, $);
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, U>, rhs: U): [TFLAGS, U] {
        const a = lhs.lhs;
        const b = lhs.rhs;
        const c = rhs;
        const ac = items_to_cons(MATH_OUTER, a, c);
        const bc = items_to_cons(MATH_OUTER, b, c);
        const retval = items_to_cons(MATH_ADD, ac, bc);
        return [TFLAG_DIFF, retval];
    }
}

export const outer_2_add_2_any_any_any = new Builder();
