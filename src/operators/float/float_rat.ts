import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { flt } from "../../tree/flt/Flt";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new FloatRat($);
    }
}

class FloatRat extends Function1<Rat> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('float_rat', new Sym('float'), is_rat, $);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [CHANGED, flt(arg.toNumber(), arg.pos, arg.end)];
    }
}

export const float_rat = new Builder();
