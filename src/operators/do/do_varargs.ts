import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { DO } from "../../runtime/constants";
import { Cons, U } from "../../tree/tree";
import { Eval_do } from "../cons/ConsExtension";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('do', DO, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = Eval_do(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const do_varargs = new Builder();
