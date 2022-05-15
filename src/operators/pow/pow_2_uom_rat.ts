import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_POW } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { QQ } from "../../tree/uom/QQ";
import { Uom } from "../../tree/uom/Uom";
import { Function2 } from "../helpers/Function2";
import { is_uom } from "../uom/UomExtension";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Uom, Rat> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('pow_2_uom_rat', MATH_POW, is_uom, is_rat, $);
    }
    transform2(opr: Sym, lhs: Uom, rhs: Rat): [TFLAGS, U] {
        const expo = QQ.valueOf(rhs.numer().toNumber(), rhs.denom().toNumber());
        return [CHANGED, lhs.pow(expo)];
    }
}

export const pow_2_uom_rat = new Builder();
