import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { yyfloat } from "./float";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = Cons;
type EXP = UCons<Sym, ARG>;

class Op extends Function1<ARG> implements Operator<EXP> {
    constructor($: ExtensionEnv) {
        super('float_cons', new Sym('float'), is_cons, $);
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        // yyfloat may simply give up and return the original expression.
        const retval = yyfloat(expr, this.$);

        return [retval.equals(expr) ? TFLAG_NONE : TFLAG_DIFF, retval];
    }
}

export const float_cons = new Builder();
