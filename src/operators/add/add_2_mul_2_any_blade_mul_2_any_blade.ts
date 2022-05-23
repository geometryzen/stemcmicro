import { TFLAG_DIFF, ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { compare_blade_blade, is_blade } from "../blade/BladeExtension";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { GUARD } from "../helpers/GUARD";
import { is_opr_2_any_rhs } from "../helpers/is_opr_2_any_rhs";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = Blade;
type LHS = BCons<Sym, LL, LR>;
type RL = U;
type RR = Blade;
type RHS = BCons<Sym, RL, RR>;
type EXP = BCons<Sym, LHS, RHS>;

function cross(lhs: LHS, rhs: RHS): boolean {
    const x1 = lhs.rhs;
    const x2 = rhs.rhs;
    return compare_blade_blade(x1, x2) > 0;
}

const guardL: GUARD<U, LHS> = and(is_cons, is_opr_2_any_rhs(MATH_MUL, is_blade));
const guardR: GUARD<U, LHS> = and(is_cons, is_opr_2_any_rhs(MATH_MUL, is_blade));

/**
 * Ordering of terms is governed by the blades.
 * (p * BladeZ) + (q * BladeA) => (q * BladeA) + (p * BladeZ)
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Blade'];
    constructor($: ExtensionEnv) {
        super('add_2_mul_2_any_blade_mul_2_any_blade', MATH_ADD, guardL, guardR, cross, $);
        this.hash = hash_binop_cons_cons(MATH_ADD, MATH_MUL, MATH_MUL);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const retval = $.valueOf(makeList(opr, rhs, lhs));
        return [TFLAG_DIFF, retval];
    }
}

export const add_2_mul_2_any_blade_mul_2_any_blade = new Builder();
