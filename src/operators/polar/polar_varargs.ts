import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { Eval_polar } from "../../polar";
import { POLAR } from "../../runtime/constants";
import { Cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('polar', POLAR, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        if ($.isExpanding()) {
            const retval = Eval_polar(expr, $);
            const changed = !retval.equals(expr);
            return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
        }
        else {
            // TODO: Not quite right because we would like to evaluate the arguments.
            return [TFLAG_NONE, expr];
        }
    }
}

export const polar_varargs = new Builder();
