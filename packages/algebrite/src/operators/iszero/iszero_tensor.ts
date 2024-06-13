import { Boo, is_tensor, Rat, Sym, Tensor } from "@stemcmicro/atoms";
import { predicate_return_value } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons1, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_TENSOR, hash_unaop_atom } from "../../hashing/hash_info";
import { Function1 } from "../helpers/Function1";

type ARG = Tensor;
type EXP = Cons1<Sym, ARG>;

function eval_iszero_tensor(expr: EXP, $: Pick<ExtensionEnv, "getDirective" | "iszero">): U {
    // console.lg("eval_iszero_tensor", `${expr}`);
    const arg = expr.arg;
    try {
        return iszero_tensor(arg, $);
    } finally {
        arg.release();
    }
}

function iszero_tensor(arg: Tensor, $: Pick<ExtensionEnv, "getDirective" | "iszero">): Boo | Rat {
    // console.lg("iszero_tensor", `${arg}`);
    const n = arg.nelem;
    for (let i = 0; i < n; i++) {
        if (!$.iszero(arg.elems[i])) {
            return predicate_return_value(false, $);
        }
    }
    return predicate_return_value(true, $);
}

class Op extends Function1<Tensor> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("iszero_tensor", native_sym(Native.iszero), is_tensor);
        this.#hash = hash_unaop_atom(this.opr, HASH_TENSOR);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: EXP, $: ExtensionEnv): U {
        return eval_iszero_tensor(expr, $);
    }
    transform1(opr: Sym, arg: ARG, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, iszero_tensor(arg, $)];
    }
}

export const iszero_tensor_builder = mkbuilder(Op);
