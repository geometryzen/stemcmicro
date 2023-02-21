import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_E } from "../../runtime/ns_math";
import { one, Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_rat } from "../rat/rat_extension";

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
            return [TFLAG_DIFF, one];
        }
        if (arg.isOne()) {
            return [TFLAG_DIFF, MATH_E];
        }
        return [TFLAG_DIFF, this.$.power(MATH_E, arg)];
    }
}

export const exp_rat = new ExpRatBuilder();
