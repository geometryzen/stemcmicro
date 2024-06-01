import { Cons, U } from "@stemcmicro/tree";
import { eval_dirac } from "../../dirac";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { DIRAC } from "../../runtime/constants";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("dirac", DIRAC);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_dirac(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const dirac_varargs = mkbuilder(Op);
