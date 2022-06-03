import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function1<Rat> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('abs_rat', new Sym('abs'), is_rat, $);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, arg.abs()];
    }
}

export const abs_rat = new Builder();
