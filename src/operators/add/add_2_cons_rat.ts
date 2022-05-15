
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_ADD } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

export const add_2_cons_rat = new Builder();

/**
 * Cons + Rat => Rat + Cons
 */
class Op extends Function2<Cons, Rat> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_cons_rat', MATH_ADD, is_cons, is_rat, $);
        this.hash = `(+ U Rat)`;
    }
    transform2(opr: Sym, lhs: Cons, rhs: Rat): [TFLAGS, U] {
        if (rhs.isZero()) {
            return [CHANGED, lhs];
        }
        else {
            const $ = this.$;
            return [CHANGED, $.valueOf(makeList(opr, rhs, lhs))];
        }
    }
}
