import { Directive, ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { two, zero } from "../../tree/rat/Rat";
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
        const $ = this.$;
        const props = $.getSymbolProps(x);
        if (props.positive) {
            return [TFLAG_DIFF, x];
        }
        if (props.negative) {
            return [TFLAG_DIFF, $.negate(x)];
        }
        if (props.zero) {
            return [TFLAG_DIFF, zero];
        }
        if (props.real) {
            if ($.getDirective(Directive.expanding)) {
                return [TFLAG_DIFF, $.sqrt($.power(x, two))];
            }
        }
        return [TFLAG_NONE, origExpr];
    }
}

export const abs_sym = new Builder();
