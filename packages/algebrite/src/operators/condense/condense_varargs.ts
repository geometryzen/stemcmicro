import { Cons, U } from "@stemcmicro/tree";
import { eval_condense } from "../../condense";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, MODE_EXPANDING, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "@stemcmicro/hashing";
import { CONDENSE } from "../../runtime/constants";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    readonly phases = MODE_EXPANDING;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("condense", CONDENSE);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_condense(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const condense_varargs = mkbuilder<Cons>(Op);
