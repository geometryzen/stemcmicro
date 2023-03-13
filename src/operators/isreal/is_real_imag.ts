import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { IMAG, PREDICATE_IS_REAL } from "../../runtime/constants";
import { booT } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealImag($);
    }
}

/**
 * isreal(imag(z)) is always true because imag(z) always return a real number.
 */
class IsRealImag extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(PREDICATE_IS_REAL, IMAG, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, add: Cons): [TFLAGS, U] {
        return [TFLAG_DIFF, booT];
    }
}

export const is_real_imag = new Builder();
