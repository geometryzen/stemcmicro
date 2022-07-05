import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { DIVISORS } from "../../runtime/constants";
import { Cons, U } from "../../tree/tree";
import { Eval_divisors } from "../cons/ConsExtension";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('divisors', DIVISORS, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = Eval_divisors(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const divisors_varargs = new Builder();

