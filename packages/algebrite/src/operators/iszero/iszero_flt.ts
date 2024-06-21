import { Boo, Flt, is_flt, Rat, Sym } from "@stemcmicro/atoms";
import { predicate_return_value } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons1, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_FLT, hash_unaop_atom } from "@stemcmicro/hashing";
import { Function1 } from "../helpers/Function1";

type ARG = Flt;
type EXP = Cons1<Sym, ARG>;

function eval_iszero_flt(expr: EXP, $: Pick<ExtensionEnv, "getDirective">): U {
    const arg = expr.arg;
    try {
        return iszero_flt(arg, $);
    } finally {
        arg.release();
    }
}

function iszero_flt(arg: Flt, $: Pick<ExtensionEnv, "getDirective">): Boo | Rat {
    return predicate_return_value(arg.isZero(), $);
}

class Op extends Function1<Flt> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("iszero_flt", native_sym(Native.iszero), is_flt);
        this.#hash = hash_unaop_atom(this.opr, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: EXP, $: ExtensionEnv): U {
        return eval_iszero_flt(expr, $);
    }
    transform1(opr: Sym, arg: ARG, exp: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, iszero_flt(arg, $)];
    }
}

export const iszero_flt_builder = mkbuilder<EXP>(Op);
