import { ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Ceiling($);
    }
}

class Ceiling extends Function1<U> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('ceiling_any', new Sym('ceiling'), is_any, $);
    }
    transform1(opr: Sym, arg: U, expr: UCons<Sym, U>): [TFLAGS, U] {
        return [NOFLAGS, expr];
    }
}

export const ceiling_any = new Builder();
