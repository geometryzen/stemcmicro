import { is_flt, is_rat, one, Rat, zero } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { NUMBER } from "../../runtime/constants";
import { cadr } from "../../tree/helpers";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

/**
 * Evaluates (number ...) expressions.
 */
function eval_number(expr: Cons, $: ExtensionEnv): Rat {
    const p1 = $.valueOf(cadr(expr));
    return is_rat(p1) || is_flt(p1) ? one : zero;
}

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('number', NUMBER);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_number(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const number_fn = mkbuilder(Op);
