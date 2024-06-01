import { Hyp, is_hyp, Sym } from "@stemcmicro/atoms";
import { Cons1, Cons2, is_cons, items_to_cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionEnv, mkbuilder, MODE_EXPANDING, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_unaop_cons } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { and } from "../helpers/and";
import { Function1 } from "../helpers/Function1";
import { GUARD } from "../helpers/GUARD";
import { is_any } from "../helpers/is_any";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";
import { MATH_STANDARD_PART } from "./MATH_STANDARD_PART";

type AL = U;
type AR = Hyp;
type ARG = Cons2<Sym, AL, AR>;
type EXP = Cons1<Sym, ARG>;

const guardA: GUARD<U, ARG> = and(is_cons, is_opr_2_lhs_rhs(MATH_ADD, is_any, is_hyp));

/**
 * st(a+Hyp) => st(a)
 */
class Op extends Function1<ARG> implements Extension<EXP> {
    readonly #hash: string;
    readonly phases = MODE_EXPANDING;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("st_add_2_any_hyp", MATH_STANDARD_PART, guardA);
        this.#hash = hash_unaop_cons(MATH_STANDARD_PART, MATH_ADD);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, exp: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const a = arg.lhs;
        const retval = $.valueOf(items_to_cons(MATH_STANDARD_PART, a));
        return [TFLAG_DIFF, retval];
    }
}

export const st_add_2_any_hyp = mkbuilder(Op);
