import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { flt, Flt } from "../../tree/flt/Flt";
import { is_flt } from "../../tree/flt/is_flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new CeilingFlt($);
    }
}

class CeilingFlt extends Function1<Flt> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('ceiling_flt', new Sym('ceiling'), is_flt, $);
    }
    transform1(opr: Sym, arg: Flt): [TFLAGS, U] {
        return [TFLAG_DIFF, flt(Math.ceil(arg.d))];
    }
}

export const ceiling_flt = new Builder();
