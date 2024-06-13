import { Cons, U } from "@stemcmicro/tree";
import { ExtensionEnv, mkbuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { LAGUERRE } from "../../runtime/constants";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { eval_laguerre } from "./laguerre";

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor() {
        super("laguerre", LAGUERRE);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_laguerre(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const laguerre_varargs = mkbuilder<Cons>(Op);
