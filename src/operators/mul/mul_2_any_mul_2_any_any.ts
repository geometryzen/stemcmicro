import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * a * (b * c) => (a * b) * c 
 */
class Op extends Function2<U, BCons<Sym, U, U>> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('mul_2_any_mul_2_any_any', MATH_MUL, is_any, and(is_cons, is_mul_2_any_any), $);
    }
    transform2(opr: Sym, lhs: U, rhs: BCons<Sym, U, U>, orig: BCons<Sym, U, BCons<Sym, U, U>>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isAssocL(MATH_MUL)) {
            const a = lhs;
            const b = rhs.lhs;
            const c = rhs.rhs;
            const ab = makeList(opr, a, b);
            return [CHANGED, makeList(rhs.opr, ab, c)];
        }
        return [NOFLAGS, orig];
    }
}

export const mul_2_any_mul_2_any_any = new Builder();
