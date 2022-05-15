import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_E } from "../../runtime/ns_math";
import { one, Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_rat } from "../rat/RatExtension";

class ExpRatBuilder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ExpRat($);
    }
}

class ExpRat extends Function1<Rat> implements Operator<U> {
    readonly breaker = true;
    constructor($: ExtensionEnv) {
        super('exp_rat', new Sym('exp'), is_rat, $);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        if (arg.isZero()) {
            return [CHANGED, one];
        }
        if (arg.isOne()) {
            return [CHANGED, MATH_E];
        }
        return [CHANGED, this.$.power(MATH_E, arg)];
    }
}

export const exp_rat = new ExpRatBuilder();
