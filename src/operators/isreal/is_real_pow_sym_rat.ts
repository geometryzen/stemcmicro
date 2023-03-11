import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { booF } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { UCons } from "../helpers/UCons";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";
import { AbstractChain } from "./AbstractChain";

const POW = native_sym(Native.pow);
const IS_REAL = native_sym(Native.is_real);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * isreal(z) <=> iszero(imag(z))
 */
class Op extends AbstractChain {
    constructor($: ExtensionEnv) {
        super(IS_REAL, POW, $);
    }
    isKind(expr: U): expr is UCons<Sym, Cons> {
        if (super.isKind(expr)) {
            // console.lg("expr", expr.toString());
            const pow = expr.argList.head;
            // console.lg("pow", pow.toString());
            const base = pow.lhs;
            const expo = pow.rhs;
            return is_sym(base) && is_rat(expo);
            // return true;
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, pow: Cons, expr: UCons<Sym, Cons>): [TFLAGS, U] {
        // const base = assert_sym(pow.lhs);
        // const expo = assert_rat(pow.rhs);
        // const numer = expo.numer();
        // const denom = expo.denom();
        // We can improve on this...
        return [TFLAG_DIFF, booF];
    }
}

export const is_real_pow_sym_rat = new Builder();
