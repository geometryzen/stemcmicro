import { cadnr } from "../../calculators/cadnr";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { guess } from "../../guess";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { cdddr } from "../../tree/helpers";
import { Cons, is_cons, is_nil, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { factor, factor_again } from "./factor";

export const FACTOR = native_sym(Native.factor);

/**
 * Factor a polynomial or integer.
 */
export function Eval_factor(expr: Cons, $: ExtensionEnv): U {
    const arg1 = $.valueOf(cadnr(expr, 1));
    const arg2 = $.valueOf(cadnr(expr, 2));
    const X = is_nil(arg2) ? guess(arg1) : arg2;
    let temp = factor(arg1, X, $);

    // more factoring?
    const p1 = cdddr(expr);
    if (is_cons(p1)) {
        temp = [...p1].reduce((acc: U, p: U) => factor_again(acc, $.valueOf(p), $), temp);
    }
    return temp;
}

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('factor', FACTOR, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = Eval_factor(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const factor_varargs = new Builder();
