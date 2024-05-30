import { Cons, U } from "math-expression-tree";
import { Extension, ExtensionBuilder, ExtensionEnv, PHASE_FLAGS_EXPANDING_UNION_FACTORING, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { COEFF } from "../../runtime/constants";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { eval_coeff } from "./coeff";

class Builder implements ExtensionBuilder<U> {
    create(): Extension<U> {
        return new Op();
    }
}

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    readonly phases = PHASE_FLAGS_EXPANDING_UNION_FACTORING;
    constructor() {
        super("coeff", COEFF);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_coeff(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const coeff_varargs = new Builder();
