import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { piAsDouble } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { is_pi } from "../pi/is_pi";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new FloatSymPi($);
    }
}

class FloatSymPi extends Function1<Sym> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('float_sym_pi', new Sym('float'), and(is_sym, is_pi), $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Sym, expr: UCons<Sym, Sym>): [TFLAGS, U] {
        return [TFLAG_DIFF, piAsDouble];
    }
}

export const float_sym_pi = new Builder();
