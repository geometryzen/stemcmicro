import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Flt, wrap_as_flt } from "../../tree/flt/Flt";
import { is_flt } from "../flt/is_flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { MATH_EXP } from "./MATH_EXP";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ExpFlt($);
    }
}

class ExpFlt extends Function1<Flt> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('exp_flt', MATH_EXP, is_flt, $);
    }
    transform1(opr: Sym, arg: Flt): [TFLAGS, U] {
        return [TFLAG_DIFF, wrap_as_flt(Math.exp(arg.toNumber()))];
    }
}

export const exp_flt = new Builder();
