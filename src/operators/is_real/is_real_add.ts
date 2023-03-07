import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { MATH_ADD } from "../../runtime/ns_math";
import { booF, booT } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { AbstractPredicateCons } from "./AbstractPredicateCons";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealAdd($);
    }
}

class IsRealAdd extends AbstractPredicateCons {
    constructor($: ExtensionEnv) {
        super(MATH_ADD, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, add: Cons): [TFLAGS, U] {
        const $ = this.$;
        if ([...add.argList].every(function (arg) {
            return $.isReal(arg);
        })) {
            return [TFLAG_DIFF, booT];
        }
        else {
            return [TFLAG_DIFF, booF];
        }
    }
}

export const is_real_add = new Builder();
