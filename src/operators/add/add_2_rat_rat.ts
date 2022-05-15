
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Rat + Rat => Rat
 */
class Op extends Function2<Rat, Rat> implements Operator<Cons> {
    readonly breaker = true;
    constructor($: ExtensionEnv) {
        super('add_2_rat_rat', MATH_ADD, is_rat, is_rat, $);
    }
    transform2(opr: Sym, lhs: Rat, rhs: Rat): [TFLAGS, U] {
        return [CHANGED, lhs.add(rhs)];
    }
}

export const add_2_rat_rat = new Builder();
