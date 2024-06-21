import { Sym } from "@stemcmicro/atoms";
import { Cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "@stemcmicro/hashing";
import { inv } from "../../inv";
import { MATH_INV } from "../../runtime/ns_math";
import { cadr } from "../../tree/helpers";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

type ARG = U;
type EXP = Cons1<Sym, ARG>;

export function eval_inv(expr: Cons, $: ExtensionEnv): U {
    const arg = $.valueOf(cadr(expr));
    return inv(arg, $);
}

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("inv_any", MATH_INV, is_any);
        this.#hash = hash_unaop_atom(MATH_INV, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const retval = inv(arg, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_NONE, retval];
    }
}

export const inv_any = mkbuilder(Op);
