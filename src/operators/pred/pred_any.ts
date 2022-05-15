import { ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Pred($);
    }
}

class Pred extends Function1<U> implements Operator<Cons> {
    readonly name = 'pred_any';
    constructor($: ExtensionEnv) {
        super('pred_any', new Sym('pred'), is_any, $);
    }
    transform1(opr: Sym, arg: U, expr: UCons<Sym, U>): [TFLAGS, U] {
        return [NOFLAGS, expr];
    }
}

export const pred_any = new Builder();
