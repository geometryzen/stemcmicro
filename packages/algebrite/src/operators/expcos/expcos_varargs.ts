import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "@stemcmicro/hashing";
import { EXPCOS } from "../../runtime/constants";
import { cadr } from "../../tree/helpers";
import { Cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { expcos } from "./expcos";

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("expcos", EXPCOS);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        if ($.isExpanding()) {
            const arg = $.valueOf(cadr(expr));
            const retval = expcos(arg, $);
            const changed = !retval.equals(expr);
            return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
        } else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const expcos_varargs = mkbuilder(Op);
