import { Cons, U } from "@stemcmicro/tree";
import { Extension, ExtensionEnv, mkbuilder, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "@stemcmicro/hashing";
import { HERMITE } from "../../runtime/constants";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { eval_hermite } from "./eval_hermite";

class Op extends FunctionVarArgs<Cons> implements Extension<Cons> {
    readonly #hash: string;
    constructor() {
        super("hermite", HERMITE);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        if ($.isExpanding()) {
            const retval = eval_hermite(expr, $);
            const changed = !retval.equals(expr);
            return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
        } else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const hermite_varargs = mkbuilder<Cons>(Op);
