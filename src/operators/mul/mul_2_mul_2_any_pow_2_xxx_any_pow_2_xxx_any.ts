
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_ADD, MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { is_rat } from "../rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { GUARD } from "../helpers/GUARD";
import { is_any } from "../helpers/is_any";
import { is_opr_2_lhs_rhs } from "../helpers/is_opr_2_lhs_rhs";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LRL = Sym;
type LRR = Rat;
type LR = BCons<Sym, LRL, LRR>;
type LHS = BCons<Sym, LL, LR>;
type RL = Sym;
type RR = Rat;
type RHS = BCons<Sym, RL, RR>;
type EXP = BCons<Sym, LHS, RHS>;

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
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_pow_2_xxx_any_pow_2_xxx_any', MATH_MUL, guardL, guardR, cross, $);
        this.hash = hash_binop_cons_cons(MATH_MUL, MATH_MUL, MATH_POW);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
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

export const mul_2_mul_2_any_pow_2_xxx_any_pow_2_xxx_any = new Builder();
