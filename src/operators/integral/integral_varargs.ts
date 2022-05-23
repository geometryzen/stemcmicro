import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, STABLE } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { INTEGRAL } from "../../runtime/constants";
import { Cons, U } from "../../tree/tree";
import { FunctionOperator } from "../helpers/FunctionOperator";
import { Eval_integral } from "./integral_helpers";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionOperator implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('integral_varargs', INTEGRAL, $);
        this.hash = hash_nonop_cons(INTEGRAL);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = Eval_integral(expr, $);
        const changed = ~retval.equals(expr);
        return [changed ? CHANGED : STABLE, retval];
    }
}

export const integral_varargs = new Builder();
