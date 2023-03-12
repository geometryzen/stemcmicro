import { count_factors } from "../../calculators/count_factors";
import { remove_factors } from "../../calculators/remove_factors";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { UCons } from "../helpers/UCons";
import { is_imu } from "../imu/is_imu";
import { AbstractChain } from "../isreal/AbstractChain";

const real = native_sym(Native.real);
const multiply = native_sym(Native.multiply);
const imag = native_sym(Native.imag);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * real(i*z) => -imag(z)
 */
class Op extends AbstractChain {
    constructor($: ExtensionEnv) {
        super(real, multiply, $);
    }
    isKind(expr: U): expr is UCons<Sym, Cons> {
        if (super.isKind(expr)) {
            const innerExpr = expr.argList.head;
            return count_factors(innerExpr, is_imu) === 1;
        }
        else {
            return false;
        }
    }
    transform1(opr: Sym, innerExpr: Cons): [TFLAGS, U] {
        const z = remove_factors(innerExpr, is_imu);
        const im_z = this.$.valueOf(items_to_cons(imag, z));
        const neg_im_z = this.$.negate(im_z);
        return [TFLAG_DIFF, neg_im_z];
    }
}

export const real_mul = new Builder();
