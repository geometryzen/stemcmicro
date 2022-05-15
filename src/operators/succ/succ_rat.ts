import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new SuccRat($);
    }
}

class SuccRat extends Function1<Rat> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('succ_rat', new Sym('succ'), is_rat, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Rat, expr: UCons<Sym, Rat>): [TFLAGS, U] {
        return [CHANGED, arg.succ()];
    }
}

export const succ_rat = new Builder();
