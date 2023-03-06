import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Ceiling($);
    }
}

type ARG = Cons;

class Ceiling extends Function1<ARG> {
    constructor($: ExtensionEnv) {
        super('ceiling_cons', create_sym('ceiling'), is_cons, $);
    }
    transform1(opr: Sym, arg: U, expr: UCons<Sym, U>): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
    }
}

export const ceiling_cons = new Builder();
