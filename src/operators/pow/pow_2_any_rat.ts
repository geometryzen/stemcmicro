
import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_POW } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { one, Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<U, Rat> implements Operator<Cons> {
    // readonly hash;
    constructor($: ExtensionEnv) {
        super('pow_2_any_rat', MATH_POW, is_any, is_rat, $);
    }
    transform2(opr: Sym, base: U, expo: Rat, expr: BCons<Sym, U, Rat>): [TFLAGS, U] {
        if (expo.isZero()) {
            return [CHANGED, one];
        }
        else if (expo.isOne()) {
            return [CHANGED, base];
        }
        else {
            return [NOFLAGS, expr];
        }
    }
}

export const pow_2_any_rat = new Builder();
