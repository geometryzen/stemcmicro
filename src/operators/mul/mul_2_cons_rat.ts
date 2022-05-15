
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_MUL } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Cons * Rat => Rat * Cons
 */
class Op extends Function2<Cons, Rat> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_cons_rat', MATH_MUL, is_cons, is_rat, $);
        this.hash = `(* U Rat)`;
    }
    transform2(opr: Sym, lhs: Cons, rhs: Rat): [TFLAGS, U] {
        const $ = this.$;
        if (rhs.isZero()) {
            return [CHANGED, rhs];
        }
        else if (rhs.isOne()) {
            return [CHANGED, lhs];
        }
        else {
            return [CHANGED, $.valueOf(makeList(opr, rhs, lhs))];
        }
    }
}

export const mul_2_cons_rat = new Builder();
