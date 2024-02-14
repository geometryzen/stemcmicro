import { Cons, U } from "math-expression-tree";
import { ExtensionEnv, make_extension_builder, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { eval_expand } from "../../expand";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { EXPAND } from "../../runtime/constants";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor() {
        super('expand', EXPAND);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_expand(expr, $);
        const flag = retval.equals(expr) ? TFLAG_NONE : TFLAG_DIFF;
        return [flag, retval];
    }
}

export const expand_extension = make_extension_builder<Cons>(Op);
