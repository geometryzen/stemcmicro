import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_ADD, MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { GUARD } from "../helpers/GUARD";
import { is_pow_2_sym_any } from "../pow/is_pow_2_sym_any";

type LHS = Cons2<Sym, Sym, U>;
type RHS = Cons2<Sym, Sym, U>;
type EXP = Cons2<Sym, LHS, RHS>;

function cross(lhs: LHS, rhs: RHS): boolean {
    const s1 = lhs.lhs;
    const s2 = rhs.lhs;
    return s1.equalsSym(s2);
}

const guardL: GUARD<U, LHS> = and(is_cons, is_pow_2_sym_any);
const guardR: GUARD<U, RHS> = and(is_cons, is_pow_2_sym_any);

/**
 * This is a symmetric distributive law in the factoring direction.
 * Interestingly, this example involves three operators.
 * Note that there must be other pattern matchers for left and right-associated expressions.
 * We should also know when we allow this to run because it could cause looping if expansion is in effect.
 *
 * (x ** a) * (x ** b) =>  x ** (a + b)
 */
class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_pow_2_xxx_any_pow_2_xxx_any", MATH_MUL, guardL, guardR, cross);
        this.#hash = hash_binop_cons_cons(MATH_MUL, MATH_POW, MATH_POW);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, exp: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const sym = lhs.lhs;
        const a = lhs.rhs;
        const b = rhs.rhs;
        const expo = $.valueOf(items_to_cons(MATH_ADD, a, b));
        const D = $.valueOf(items_to_cons(MATH_POW, sym, expo));
        return [TFLAG_DIFF, D];
    }
}

export const mul_2_pow_2_xxx_any_pow_2_xxx_any = mkbuilder<EXP>(Op);
