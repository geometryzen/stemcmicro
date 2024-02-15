import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { DIM } from "../../runtime/constants";
import { Cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { eval_dim } from "./dim";

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('dim', DIM);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(dimExpr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_dim(dimExpr, $);
        const changed = !retval.equals(dimExpr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const dim_varargs = mkbuilder(Op);
