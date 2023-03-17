import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1X } from "../helpers/Function1X";
import { UCons } from "../helpers/UCons";
import { is_sym } from "../sym/is_sym";

export const abs = native_sym(Native.abs);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function cross($: ExtensionEnv) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function (arg: Sym): boolean {
        return true;
    };
}

/**
 * abs(x) => (sqrt (expt x 2))
 */
class Op extends Function1X<Sym> implements Operator<UCons<Sym, Sym>> {
    constructor($: ExtensionEnv) {
        super('abs_sym', abs, is_sym, cross($), $);
    }
    transform1(opr: Sym, x: Sym, origExpr: UCons<Sym, Sym>): [TFLAGS, U] {
        // We'll be satisfied with using this operator to evaluate the symbol for now.
        // const $ = this.$;
        /*
        if ($.isExpanding()) {
            if ($.is_real(x)) {
                return [TFLAG_DIFF, $.power($.power(x, two), half)];
            }
        }
        */
        return [TFLAG_NONE, origExpr];
    }
}

export const abs_sym = new Builder();
