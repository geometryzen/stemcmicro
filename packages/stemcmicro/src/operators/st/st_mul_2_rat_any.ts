import { is_rat, Rat, Sym } from "math-expression-atoms";
import { Cons1, Cons2, is_cons, items_to_cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionEnv, mkbuilder, MODE_EXPANDING, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_unaop_cons } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { and } from "../helpers/and";
import { Function1 } from "../helpers/Function1";
import { GUARD } from "../helpers/GUARD";
import { is_any } from "../helpers/is_any";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";
import { MATH_STANDARD_PART } from "./MATH_STANDARD_PART";

type AL = Rat;
type AR = U;
type ARG = Cons2<Sym, AL, AR>;
type EXP = Cons1<Sym, ARG>;

const guardA: GUARD<U, ARG> = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, is_rat, is_any));

/**
 * st(k*X) => k*st(X)
 */
class Op extends Function1<ARG> implements Extension<EXP> {
    readonly #hash: string;
    readonly phases = MODE_EXPANDING;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("st_mul_2_rat_any", MATH_STANDARD_PART, guardA);
        this.#hash = hash_unaop_cons(MATH_STANDARD_PART, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, exp: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const k = arg.lhs;
        const X = arg.rhs;
        const p1 = $.valueOf(items_to_cons(opr, X));
        const p2 = $.valueOf(items_to_cons(arg.opr, k, p1));
        return [TFLAG_DIFF, p2];
    }
}

export const st_mul_2_rat_any = mkbuilder<EXP>(Op);
