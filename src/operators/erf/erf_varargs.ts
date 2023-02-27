import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { erfc } from "../erfc/erfc";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { is_negative } from "../../predicates/is_negative";
import { ERF } from "../../runtime/constants";
import { wrap_as_flt } from "../../tree/flt/Flt";
import { cadr } from "../../tree/helpers";
import { zero } from "../../tree/rat/Rat";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('erf', ERF, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = yerf($.valueOf(cadr(expr)), $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

function yerf(p1: U, $: ExtensionEnv): U {
    if (is_flt(p1)) {
        return wrap_as_flt(1.0 - erfc(p1.d));
    }

    if ($.isZero(p1)) {
        return zero;
    }

    if (is_negative(p1)) {
        return $.negate(items_to_cons(ERF, $.negate(p1)));
    }

    return items_to_cons(ERF, p1);
}

export const erf_varargs = new Builder();
