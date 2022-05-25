import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { QUOTE } from "../../runtime/constants";
import { cadr } from "../../tree/helpers";
import { Cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}
// quote definition
export function Eval_quote(p1: Cons): U {
    return cadr(p1);
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('quote', QUOTE, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const retval = Eval_quote(expr);
        return [TFLAG_HALT, retval];
    }
}

export const quote_varargs = new Builder();
