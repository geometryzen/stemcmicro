import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { guess } from "../../guess";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { cdddr } from "../../tree/helpers";
import { Cons, is_cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { factor, factor_again } from "./factor";

export const FACTOR = native_sym(Native.factor);

/**
 * Factor a polynomial or integer.
 * (factor P X) or (factor P X Y)
 */
export function Eval_factor(expr: Cons, $: ExtensionEnv): U {
    const P = $.valueOf(expr.item1);
    const arg2 = $.valueOf(expr.item2);
    const X = arg2.isnil ? guess(P) : arg2;
    const factors = factor(P, X, $);

    // more factoring?
    const Y = cdddr(expr);
    if (is_cons(Y)) {
        return [...Y].reduce((acc: U, p: U) => factor_again(acc, $.valueOf(p), $), factors);
    }
    else {
        return factors;
    }
}

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('factor', FACTOR, $);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = Eval_factor(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const factor_varargs = new Builder();
