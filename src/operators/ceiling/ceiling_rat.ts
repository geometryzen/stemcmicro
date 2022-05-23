import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_rat } from "../rat/RatExtension";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new CeilingRat($);
    }
}

class CeilingRat extends Function1<Rat> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('ceiling_rat', new Sym('ceiling'), is_rat, $);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, arg.ceiling()];
    }
}

export const ceiling_rat = new Builder();
