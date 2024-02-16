import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, MODE_EXPANDING, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_unaop_cons } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons1 } from "../helpers/Cons1";
import { Cons2 } from "../helpers/Cons2";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { is_opr_2_lhs_any } from "../helpers/is_opr_2_lhs_any";
import { MATH_SIN } from "../sin/MATH_SIN";
import { MATH_COS } from "./MATH_COS";

type AL = U;
type AR = U;
type ARG = Cons2<Sym, AL, AR>;
type EXP = Cons1<Sym, ARG>;

/**
 * cos(a+b) => cos(a)*cos(b)-sin(a)*sin(b) 
 */
class Op extends Function1<ARG> {
    readonly #hash: string;
    readonly phases = MODE_EXPANDING;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('cos_add_2_any_any', MATH_COS, and(is_cons, is_opr_2_lhs_any(MATH_ADD, is_any)));
        this.#hash = hash_unaop_cons(MATH_COS, MATH_ADD);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, exp: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const a = arg.lhs;
        const b = arg.rhs;
        const cosA = $.valueOf(items_to_cons(MATH_COS, a));
        const cosB = $.valueOf(items_to_cons(MATH_COS, b));
        const sinA = $.valueOf(items_to_cons(MATH_SIN, a));
        const sinB = $.valueOf(items_to_cons(MATH_SIN, b));
        const cacb = $.valueOf(items_to_cons(MATH_MUL, cosA, cosB));
        const sasb = $.valueOf(items_to_cons(MATH_MUL, sinA, sinB));
        const retval = $.valueOf(items_to_cons(MATH_ADD, cacb, $.negate(sasb)));
        return [TFLAG_DIFF, retval];
    }
}

export const cos_add_2_any_any = mkbuilder(Op);
