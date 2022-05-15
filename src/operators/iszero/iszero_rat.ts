import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { False, True } from "../../tree/boo/Boo";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";

class ExpRatBuilder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsZeroRat($);
    }
}

const ISZERO = new Sym('iszero');

class IsZeroRat extends Function1<Rat> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('iszero_rat', ISZERO, is_rat, $);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [CHANGED, arg.isZero() ? True : False];
    }
}

export const iszero_rat = new ExpRatBuilder();
