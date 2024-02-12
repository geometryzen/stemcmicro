import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { QUOTE } from "../../runtime/constants";
import { Cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { assert_U } from "../helpers/is_any";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}
// quote definition
export function eval_quote(expr: Cons): U {
    assert_U(expr, "eval_quote(expr)", "expr");
    return expr.arg;
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('quote', QUOTE, $);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: Cons): U {
        return eval_quote(expr);
    }
    transform(expr: Cons): [number, U] {
        const retval = this.valueOf(expr);
        return [TFLAG_HALT, retval];
    }
}

export const quote_varargs = new Builder();
