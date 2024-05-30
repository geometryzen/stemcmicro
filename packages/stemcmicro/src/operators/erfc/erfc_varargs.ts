import { create_flt, is_flt, one } from "math-expression-atoms";
import { Cons, items_to_cons, U } from "math-expression-tree";
import { ExtensionEnv, mkbuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { ERFC } from "../../runtime/constants";
import { cadr } from "../../tree/helpers";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { erfc } from "./erfc";

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor() {
        super("erfc", ERFC);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = yerfc($.valueOf(cadr(expr)), $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

function yerfc(p1: U, $: ExtensionEnv): U {
    if (is_flt(p1)) {
        const d = erfc(p1.d);
        return create_flt(d);
    }

    if ($.iszero(p1)) {
        return one;
    }

    return items_to_cons(ERFC, p1);
}

export const erfc_varargs = mkbuilder(Op);
