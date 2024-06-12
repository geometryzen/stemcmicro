import { create_flt, is_flt, zero } from "@stemcmicro/atoms";
import { is_negative } from "@stemcmicro/helpers";
import { Cons, items_to_cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { ERF } from "../../runtime/constants";
import { cadr } from "../../tree/helpers";
import { erfc } from "../erfc/erfc";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("erf", ERF);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = yerf($.valueOf(cadr(expr)), $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

function yerf(p1: U, $: ExtensionEnv): U {
    if (is_flt(p1)) {
        return create_flt(1.0 - erfc(p1.d));
    }

    if ($.iszero(p1)) {
        return zero;
    }

    if (is_negative(p1)) {
        return $.negate(items_to_cons(ERF, $.negate(p1)));
    }

    return items_to_cons(ERF, p1);
}

export const erf_varargs = mkbuilder(Op);
