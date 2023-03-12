import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { ARCTAN } from "../../runtime/constants";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { UCons } from "../helpers/UCons";
import { AbstractChain } from "../isreal/AbstractChain";
import { is_rat } from "../rat/is_rat";

const imag = native_sym(Native.imag);
// const log = native_sym(Native.log);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends AbstractChain {
    constructor($: ExtensionEnv) {
        super(imag, ARCTAN, $);
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
        return [TFLAG_DIFF, zero];
    }
}

export const imag_arctan_rat = new Builder();
