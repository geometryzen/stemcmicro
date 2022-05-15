import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_POW } from "../../runtime/ns_math";
import { flt, Flt } from "../../tree/flt/Flt";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { is_flt } from "../flt/FltExtension";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/RatExtension";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Flt, Rat> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('pow_2_flt_rat', MATH_POW, is_flt, is_rat, $);
    }
    isScalar(): boolean {
        return true;
    }
    isVector(): boolean {
        return false;
    }
    transform2(opr: Sym, lhs: Flt, rhs: Rat): [TFLAGS, U] {
        return [CHANGED, flt(Math.pow(lhs.d, rhs.toNumber()))];
    }
}

export const pow_2_flt_rat = new Builder();
