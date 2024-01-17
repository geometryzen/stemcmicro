import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { hilbert } from "../../hilbert";
import { HILBERT } from "../../runtime/constants";
import { cadr } from "../../tree/helpers";
import { Cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}
export function Eval_hilbert(p1: U, $: ExtensionEnv): U {
    return hilbert($.valueOf(cadr(p1)), $);
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = [];
    constructor($: ExtensionEnv) {
        super('hilbert', HILBERT, $);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = Eval_hilbert(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const hilbert_varargs = new Builder();
