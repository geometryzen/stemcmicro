import { ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsZero($);
    }
}

const ISZERO = new Sym('iszero');

class IsZero extends Function1<U> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('iszero_any', ISZERO, is_any, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: U, expr: UCons<Sym, U>): [TFLAGS, U] {
        return [NOFLAGS, expr];
    }
}

export const iszero_any = new Builder();
