import { Rat } from "@stemcmicro/atoms";
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
import { is_any } from "../helpers/is_any";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";

type LL = U;
type LRL = Sym;
type LRR = Rat;
type LR = Cons2<Sym, LRL, LRR>;
type LHS = Cons2<Sym, LL, LR>;
type RL = Sym;
type RR = Rat;
type RHS = Cons2<Sym, RL, RR>;
type EXP = Cons2<Sym, LHS, RHS>;

function cross(lhs: LHS, rhs: RHS): boolean {
    const x1: LRL = lhs.rhs.lhs;
    const x2: RL = rhs.lhs;
    return x1.equalsSym(x2);
}

const guardLL: GUARD<U, LL> = is_any;
const guardLR: GUARD<U, LR> = and(is_cons, is_opr_2_lhs_rhs(MATH_POW, is_sym, is_rat));

const guardL: GUARD<U, LHS> = and(is_cons, is_opr_2_lhs_rhs(MATH_MUL, guardLL, guardLR));
const guardR: GUARD<U, RHS> = and(is_cons, is_opr_2_lhs_rhs(MATH_POW, is_sym, is_rat));

/**
 * This is the asymmetric version of a factoring distributive law resulting from LHS associativity of multiplication.
 * (A * (x **  a)) *  (x ** b)  =>  A * (x **  (a +   b))
 *      (x op1 a) op2 (x op1 b) =>       x op1 (a op2 b)
 */
class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_mul_2_any_pow_2_xxx_any_pow_2_xxx_any", MATH_MUL, guardL, guardR, cross);
        this.#hash = hash_binop_cons_cons(MATH_MUL, MATH_MUL, MATH_POW);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, exp: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const A: U = lhs.lhs;
        const x: LRL = lhs.rhs.lhs;
        const a: LRR = lhs.rhs.rhs;
        const b: RR = rhs.rhs;
        const p1 = $.valueOf(items_to_cons(MATH_ADD, a, b));
        const p2 = $.valueOf(items_to_cons(MATH_POW, x, p1));
        const p3 = $.valueOf(items_to_cons(opr, A, p2));
        return [TFLAG_DIFF, p3];
    }
}

export const mul_2_mul_2_any_pow_2_xxx_any_pow_2_xxx_any = mkbuilder<EXP>(Op);
