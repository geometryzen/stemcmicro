import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { yyfloat } from "./float";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new FloatCons($);
    }
}

class FloatCons extends Function1<Cons> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('float_cons', new Sym('float'), is_cons, $);
    }
    transform1(opr: Sym, arg: Cons, expr: UCons<Sym, Cons>): [TFLAGS, U] {
        return [CHANGED, yyfloat(expr, this.$)];
    }
}

export const float_cons = new Builder();
