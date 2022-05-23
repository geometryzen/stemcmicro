import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { NUMBER } from "../../runtime/constants";
import { cadr } from "../../tree/helpers";
import { one, Rat, zero } from "../../tree/rat/Rat";
import { Cons, U } from "../../tree/tree";
import { is_flt } from "../flt/FltExtension";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { is_rat } from "../rat/RatExtension";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * Evaluates (number ...) expressions.
 */
function Eval_number(expr: Cons, $: ExtensionEnv): Rat {
    const p1 = $.valueOf(cadr(expr));
    return is_rat(p1) || is_flt(p1) ? one : zero;
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('number', NUMBER, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = Eval_number(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const number_fn = new Builder();
