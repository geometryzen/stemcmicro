import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_mul_2_rat_any } from "../mul/is_mul_2_rat_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross(lhs: BCons<Sym, Rat, U>, rhs: BCons<Sym, Rat, U>): boolean {
    const x1 = lhs.rhs;
    const x2 = rhs.rhs;
    if (x1.equals(x2)) {
        return true;
    }
    return false;
}

/**
 * (p * X) + (q * X) => (p + q) * X
 */
class Op extends Function2X<BCons<Sym, Rat, U>, BCons<Sym, Rat, U>> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('add_2_mul_2_rat_X_mul_2_rat_X', MATH_ADD, and(is_cons, is_mul_2_rat_any), and(is_cons, is_mul_2_rat_any), cross, $);
    }
    transform2(opr: Sym, lhs: BCons<Sym, Rat, U>, rhs: BCons<Sym, Rat, U>): [TFLAGS, U] {
        const p = lhs.lhs;
        const X = lhs.rhs;
        const q = rhs.lhs;
        return [CHANGED, makeList(MATH_MUL, p.add(q), X)];
    }
}

export const add_2_mul_2_rat_X_mul_2_rat_X = new Builder();
