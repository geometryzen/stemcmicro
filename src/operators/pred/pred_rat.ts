import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new PredRat($);
    }
}

class PredRat extends Function1<Rat> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('pred_rat', new Sym('pred'), is_rat, $);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [CHANGED, arg.pred()];
    }
}

export const pred_rat = new Builder();
