import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { erfc } from "./erfc";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { ERFC } from "../../runtime/constants";
import { wrap_as_flt } from "../../tree/flt/Flt";
import { cadr } from "../../tree/helpers";
import { one } from "../../tree/rat/Rat";
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
        super('erfc', ERFC, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = yerfc($.valueOf(cadr(expr)), $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

function yerfc(p1: U, $: ExtensionEnv): U {
    if (is_flt(p1)) {
        const d = erfc(p1.d);
        return wrap_as_flt(d);
    }

    if ($.isZero(p1)) {
        return one;
    }

    return items_to_cons(ERFC, p1);
}

export const erfc_varargs = new Builder();
