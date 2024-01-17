import { ExtensionEnv, MODE_FACTORING, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { MATH_ADD, MATH_POW } from "../../runtime/ns_math";
import { one, Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { MATH_COS } from "../cos/MATH_COS";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_opr_1_any } from "../helpers/is_opr_1_any";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";
import { UCons } from "../helpers/UCons";
import { is_rat } from "../rat/is_rat";
import { MATH_SIN } from "../sin/MATH_SIN";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = UCons<Sym, U>;
type LR = Rat;
type LHS = BCons<Sym, LL, LR>
type RL = UCons<Sym, U>;
type RR = Rat;
type RHS = BCons<Sym, RL, RR>
type EXP = BCons<Sym, LHS, RHS>;

const guardL = and(is_cons, is_opr_2_lhs_rhs(MATH_POW, and(is_cons, is_opr_1_any(MATH_COS)), is_rat));
const guardR = and(is_cons, is_opr_2_lhs_rhs(MATH_POW, and(is_cons, is_opr_1_any(MATH_SIN)), is_rat));

function cross(lhs: LHS, rhs: RHS): boolean {
    const x1 = lhs.lhs.arg;
    const numL = lhs.rhs;
    const x2 = rhs.lhs.arg;
    const numR = rhs.rhs;
    return x1.equals(x2) && numL.isTwo() && numR.isTwo();
}

/**
 * (add (pow (cos x) 2) (pow (sin x) 2)) => 1
 * cos(x)**2+sin(x)**2 => 1
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    readonly phases = MODE_FACTORING;
    constructor($: ExtensionEnv) {
        super('add_2_pow_2_cos_rat_pow_2_sin_rat', MATH_ADD, guardL, guardR, cross, $);
        this.#hash = hash_binop_cons_cons(MATH_ADD, MATH_POW, MATH_POW);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        return [TFLAG_DIFF, one];
    }
}

export const add_2_pow_2_cos_rat_pow_2_sin_rat = new Builder();
