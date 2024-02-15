import { multiply_num_num } from "../../calculators/mul/multiply_num_num";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_RAT } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Num } from "../../tree/num/Num";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";
import { is_mul_2_num_any } from "./is_mul_2_num_any";

type LL = Num;
type LR = U;
type LHS = Cons2<Sym, LL, LR>;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (Rat1 * X) * Rat2 => (Rat1 * Rat2) * X
 * 
 * More fundamentally,
 * 
 * (Rat1 * X) * Rat2 => Rat1 * (X * Rat2) => Rat1 * (Rat2 * X) => (Rat1 * Rat2) * X
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('mul_2_mul_2_num_any_rat', MATH_MUL, and(is_cons, is_mul_2_num_any), is_rat);
        this.#hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const num1 = lhs.lhs;
        const X = lhs.rhs;
        const num2 = rhs;
        return [TFLAG_DIFF, items_to_cons(MATH_MUL, X, multiply_num_num(num1, num2))];
    }
}

export const mul_2_mul_2_num_any_rat = mkbuilder<EXP>(Op);
