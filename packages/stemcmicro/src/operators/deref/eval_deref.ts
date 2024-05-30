import { assert_cell, Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

type ARG = U;
type EXP = Cons1<Sym, ARG>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function eval_deref(expr: EXP, $: ExtensionEnv): U {
    const arg = expr.arg;
    try {
        const value = $.valueOf(arg);
        try {
            const atom = assert_cell(value);
            return atom.deref();
        } finally {
            value.release();
        }
    } finally {
        arg.release();
    }
}

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("deref", native_sym(Native.deref), is_any);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: EXP, $: ExtensionEnv): [number, U] {
        const retval = eval_deref(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        throw new Error("TODO");
    }
}

export const deref_builder = mkbuilder<EXP>(Op);
