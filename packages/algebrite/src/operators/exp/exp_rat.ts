import { is_rat, one, Rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "@stemcmicro/hashing";
import { MATH_E } from "../../runtime/ns_math";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";

class ExpRat extends Function1<Rat> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("exp_rat", create_sym("exp"), is_rat);
        this.#hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: Rat, exp: Cons, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name);
        if (arg.isZero()) {
            return [TFLAG_DIFF, one];
        }
        if (arg.isOne()) {
            return [TFLAG_DIFF, MATH_E];
        }
        return [TFLAG_DIFF, $.power(MATH_E, arg)];
    }
}

export const exp_rat = mkbuilder(ExpRat);
