import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Flt } from "../../tree/flt/Flt";
import { is_flt } from "../../tree/flt/is_flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new FloatFlt($);
    }
}

class FloatFlt extends Function1<Flt> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('float_flt', new Sym('float'), is_flt, $);
    }
    transform1(opr: Sym, arg: Flt): [TFLAGS, U] {
        return [CHANGED, arg];
    }
}

export const float_flt = new Builder();
