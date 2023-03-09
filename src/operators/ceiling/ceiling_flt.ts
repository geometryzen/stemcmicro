import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Flt, create_flt } from "../../tree/flt/Flt";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Function1 } from "../helpers/Function1";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new CeilingFlt($);
    }
}

class CeilingFlt extends Function1<Flt> {
    constructor($: ExtensionEnv) {
        super('ceiling_flt', create_sym('ceiling'), is_flt, $);
    }
    transform1(opr: Sym, arg: Flt): [TFLAGS, U] {
        return [TFLAG_DIFF, create_flt(Math.ceil(arg.d))];
    }
}

export const ceiling_flt = new Builder();
