import { Sym } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { LOG } from "../../runtime/constants";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function1<U> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('log_any', LOG, is_any, $);
        this.#hash = hash_unaop_atom(LOG, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: U, orig: Cons): [TFLAGS, U] {
        return [TFLAG_NONE, orig];
    }
}

export const log_varargs = new Builder();
