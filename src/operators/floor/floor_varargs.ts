import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Eval_floor } from "../../floor";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { FLOOR } from "../../runtime/constants";
import { Cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('floor', FLOOR, $);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = Eval_floor(expr, $);
        return [TFLAG_DIFF, retval];
    }
}

export const floor_varargs = new Builder();
