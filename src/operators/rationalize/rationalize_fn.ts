import { ExtensionEnv, Operator, OperatorBuilder, PHASE_EXPLICATE, PHASE_FLAGS_ALL, PHASE_IMPLICATE, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { RATIONALIZE } from "../../runtime/constants";
import { Cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { Eval_rationalize } from "./rationalize";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    readonly phases = PHASE_FLAGS_ALL & (~PHASE_IMPLICATE) & (~PHASE_EXPLICATE);
    constructor($: ExtensionEnv) {
        super('rationalize', RATIONALIZE, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = Eval_rationalize(expr, $);
        // console.lg(`rationalize() => ${print_expr(retval, $)}`);
        const flags = TFLAG_HALT | (!retval.equals(expr) ? TFLAG_DIFF : TFLAG_NONE);
        return [flags, retval];
    }
}

export const rationalize_fn = new Builder();
