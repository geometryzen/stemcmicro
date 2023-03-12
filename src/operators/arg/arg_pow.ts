import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { AbstractChain } from "../isreal/AbstractChain";
import { compute_theta_from_base_and_expo } from "../real/compute_theta_from_base_and_expo";

const arg = native_sym(Native.arg);
const pow = native_sym(Native.pow);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * 
 */
class Op extends AbstractChain {
    constructor($: ExtensionEnv) {
        super(arg, pow, $);
    }
    transform1(opr: Sym, innerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        const base = innerExpr.lhs;
        const expo = innerExpr.rhs;
        const theta = compute_theta_from_base_and_expo(base, expo, $);
        return [TFLAG_DIFF, theta];
    }
}

export const arg_pow = new Builder();
