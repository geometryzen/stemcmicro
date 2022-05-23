import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, STABLE } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { NOT } from "../../runtime/constants";
import { Eval_not } from "../../test";
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
        super('not', NOT, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = Eval_not(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? CHANGED : STABLE, retval];
    }
}

export const not_fn = new Builder();
