import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { MATH_POW } from "../../runtime/ns_math";
import { half, two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { items_to_cons, U } from "../../tree/tree";
import { Function1X } from "../helpers/Function1X";
import { UCons } from "../helpers/UCons";
import { is_sym } from "../sym/is_sym";

export const abs = native_sym(Native.abs);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}


function cross($: ExtensionEnv) {
    return function (arg: Sym): boolean {
        return $.is_real(arg) && $.isExpanding();
    };
}

/**
 * abs(x) => (sqrt (expt x 1/2))
 */
class Op extends Function1X<Sym> implements Operator<UCons<Sym, Sym>> {
    constructor($: ExtensionEnv) {
        super('abs_sym_real', abs, is_sym, cross($), $);
    }
    transform1(opr: Sym, x: Sym, origExpr: UCons<Sym, Sym>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isExpanding()) {
            return [TFLAG_DIFF, items_to_cons(MATH_POW, items_to_cons(MATH_POW, x, two), half)];
        }
        return [TFLAG_NONE, origExpr];
    }
}

export const abs_sym_real = new Builder();
