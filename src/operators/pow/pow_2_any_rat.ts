
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { MATH_POW } from "../../runtime/ns_math";
import { one, Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_rat } from "../rat/is_rat";

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
    transform2(opr: Sym, base: U, expo: Rat, expr: Cons2<Sym, U, Rat>): [TFLAGS, U] {
        // console.lg(this.name);
        if (expo.isZero()) {
            return [TFLAG_DIFF, one];
        }
        else if (expo.isOne()) {
            return [TFLAG_DIFF, base];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const pow_2_any_rat = new Builder();
