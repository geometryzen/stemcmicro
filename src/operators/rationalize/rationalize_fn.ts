import { ExtensionEnv, MODE_FLAGS_ALL, Operator, OperatorBuilder, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { Eval_rationalize } from "./rationalize";

export const RATIONALIZE = native_sym(Native.rationalize);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly #hash: string;
    readonly phases = MODE_FLAGS_ALL;
    constructor($: ExtensionEnv) {
        super('rationalize', RATIONALIZE, $);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = Eval_rationalize(expr, $);
        // console.lg(`rationalize() => ${print_expr(retval, $)}`);
        const flags = retval.equals(expr) ? TFLAG_NONE : TFLAG_HALT;
        return [flags, retval];
    }
}

export const rationalize_fn = new Builder();
