import { count_factors } from "../../calculators/count_factors";
import { remove_factors } from "../../calculators/remove_factors";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { is_imu } from "../imu/is_imu";
import { CompositeOperator } from "../helpers/CompositeOperator";

const RE = native_sym(Native.real);
const MUL = native_sym(Native.multiply);
const IM = native_sym(Native.imag);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * im(i*z) => re(z)
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(IM, MUL, $);
    }
    isKind(expr: U): expr is Cons1<Sym, Cons> {
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
        const re_z = this.$.valueOf(items_to_cons(RE, z));
        return [TFLAG_DIFF, re_z];
    }
}

export const imag_mul_i_times_any = new Builder();
