import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";
import { UCons } from "../helpers/UCons";
import { is_rat } from "../rat/is_rat";

const ARCTAN = native_sym(Native.arctan);
const REAL = native_sym(Native.real);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(REAL, ARCTAN, $);
    }
    isKind(expr: U): expr is UCons<Sym, Cons> {
        if (super.isKind(expr)) {
            const innerExpr = expr.argList.head;
            const x = innerExpr.argList.head;
            return is_rat(x);
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons): [TFLAGS, U] {
        // We know that x is a Rat, so it is real.
        // arctan is real if x is real.
        return [TFLAG_DIFF, innerExpr];
    }
}

export const real_arctan_rat = new Builder();
