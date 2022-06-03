import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new FloatSym($);
    }
}

class FloatSym extends Function1<Sym> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('float_sym', new Sym('float'), is_sym, $);
    }
    transform1(opr: Sym, arg: Sym, expr: UCons<Sym, Sym>): [TFLAGS, U] {
        const $ = this.$;
        if ($.treatAsReal(arg)) {
            return [TFLAG_DIFF, arg];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const float_sym = new Builder();
