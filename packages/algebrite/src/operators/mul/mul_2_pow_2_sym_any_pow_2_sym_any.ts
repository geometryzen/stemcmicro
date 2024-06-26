import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "@stemcmicro/hashing";
import { items_to_cons } from "../../makeList";
import { EXP } from "../../runtime/constants";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { GUARD } from "../helpers/GUARD";
import { is_pow_2_any_any } from "../pow/is_pow_2_any_any";

type LHS = Cons2<Sym, U, U>;
type RHS = Cons2<Sym, U, U>;
type EXP = Cons2<Sym, LHS, RHS>;

function cross(lhs: LHS, rhs: RHS, exp: EXP, $: ExtensionEnv): boolean {
    const is_factoring = $.isFactoring();
    if (is_factoring) {
        const k1 = lhs.rhs;
        const k2 = rhs.rhs;
        const k1_equals_k2 = k1.equals(k2);
        // console.lg(`k1_equals_k2=${k1_equals_k2}`);
        // console.lg(`k1=${k1}`);
        // console.lg(`k2=${k2}`);
        if (k1_equals_k2) {
            // console.lg(`lhs=${lhs}, rhs=${rhs}`);
            const x = lhs.lhs;
            const x_is_scalar = $.isscalar(x);
            // console.lg(`x=${x}`);
            // console.lg(`x_is_scalar=${x_is_scalar}`);
            const y = rhs.lhs;
            // console.lg(`y=${y}`);
            const y_is_scalar = $.isscalar(y);
            // console.lg(`y_is_scalar=${y_is_scalar}`);
            return k1_equals_k2 && x_is_scalar && y_is_scalar;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

const guardL: GUARD<U, LHS> = and(is_cons, is_pow_2_any_any);
const guardR: GUARD<U, RHS> = and(is_cons, is_pow_2_any_any);

/**
 * (x ** k) * (y ** k) =>  (x * y) ** k, provided x and y commute (scalars).
 * Don't do this!
 */
class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_pow_2_sym_any_pow_2_sym_any", MATH_MUL, guardL, guardR, cross);
        this.#hash = hash_binop_cons_cons(MATH_MUL, MATH_POW, MATH_POW);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, exp: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const x = lhs.lhs;
        const y = rhs.lhs;
        const k = lhs.rhs;
        const xy = $.valueOf(items_to_cons(opr, x, y));
        const retval = $.valueOf(items_to_cons(MATH_POW, xy, k));
        // console.lg(`retval=${retval}`);
        return [TFLAG_DIFF, retval];
    }
}

export const mul_2_pow_2_sym_any_pow_2_sym_any = mkbuilder<EXP>(Op);
