import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { PREDICATE_IS_REAL, REAL } from "../../runtime/constants";
import { booT } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { AbstractChain } from "./AbstractChain";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}


/**
 * isreal(real(z)) is always true because real(z) always return a real number.
 */
class Op extends AbstractChain {
    constructor($: ExtensionEnv) {
        super(PREDICATE_IS_REAL, REAL, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, add: Cons): [TFLAGS, U] {
        return [TFLAG_DIFF, booT];
    }
}

export const is_real_real = new Builder();
