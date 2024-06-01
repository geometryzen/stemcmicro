import { Cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { OR } from "../../runtime/constants";
import { eval_or } from "../../test";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("or", OR);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_or(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const or_varargs = mkbuilder(Op);
