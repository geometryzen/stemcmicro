import { Cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "@stemcmicro/hashing";
import { FACTORIAL } from "../../runtime/constants";
import { cadr } from "../../tree/helpers";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { factorial } from "./factorial";

function eval_factorial(p1: Cons, $: ExtensionEnv): U {
    return factorial($.valueOf(cadr(p1)));
}

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("factorial", FACTORIAL);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_factorial(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const factorial_varargs = mkbuilder(Op);
