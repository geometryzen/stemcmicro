import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Rat } from "../../tree/rat/Rat";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_rat } from "../rat/rat_extension";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new CeilingRat($);
    }
}

class CeilingRat extends Function1<Rat> {
    constructor($: ExtensionEnv) {
        super('ceiling_rat', create_sym('ceiling'), is_rat, $);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, arg.ceiling()];
    }
}

export const ceiling_rat = new Builder();
