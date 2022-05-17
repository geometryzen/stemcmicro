import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { GUARD } from "../helpers/GUARD";
import { is_opr_2_any_rhs } from "../helpers/is_opr_2_any_rhs";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = Sym;
type LHS = BCons<Sym, LL, LR>;
type RL = U;
type RR = Sym;
type RHS = BCons<Sym, RL, RR>;
type EXP = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        const v1 = lhs.rhs;
        const v2 = rhs.rhs;
        if ($.treatAsVector(v1) && $.treatAsVector(v2)) {
            return compare_sym_sym(v1, v2) > 0;
        }
        else {
            return false;
        }
    };
}

const guardL: GUARD<U, LHS> = and(is_cons, is_opr_2_any_rhs(MATH_MUL, is_sym));
const guardR: GUARD<U, LHS> = and(is_cons, is_opr_2_any_rhs(MATH_MUL, is_sym));

/**
 * Ordering of terms is governed by the blades.
 * (p * VectorZ) + (q * VectorA) => (q * VectorA) + (p * VectorZ)
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_mul_2_any_vector_mul_2_any_vector', MATH_ADD, guardL, guardR, cross($), $);
        this.hash = hash_binop_cons_cons(MATH_ADD, MATH_MUL, MATH_MUL);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const retval = $.valueOf(makeList(opr, rhs, lhs));
        return [CHANGED, retval];
    }
}

export const add_2_mul_2_any_vector_mul_2_any_vector = new Builder();
