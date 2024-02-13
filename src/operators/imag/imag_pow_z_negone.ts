import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";
import { Cons1 } from "../helpers/Cons1";
import { is_rat } from "../rat/is_rat";

const POW = native_sym(Native.pow);
const IM = native_sym(Native.imag);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 *
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(IM, POW, $);
    }
    isKind(expr: U): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr)) {
            const innerExpr = expr.argList.head;
            // const base = innerExpr.lhs;
            const expo = innerExpr.expo;
            // TODO: check that the base is complex... 
            return is_rat(expo) && expo.isMinusOne();
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        // console.lg("im(1/z)", $.toInfixString(innerExpr));
        const base = innerExpr.lhs;
        const z = base;
        const z_star = $.conj(z);
        const numer = $.im(z_star);
        const denom = $.multiply(z, z_star);
        const retval = $.divide(numer, denom);
        // console.lg("z_star", this.$.toInfixString(z_star));
        // console.lg("numer", this.$.toInfixString(numer));
        // console.lg("denom", this.$.toInfixString(denom));
        // console.lg("retval", this.$.toInfixString(retval));
        return [TFLAG_DIFF, retval];
    }
}

export const imag_pow_z_negone = new Builder();
