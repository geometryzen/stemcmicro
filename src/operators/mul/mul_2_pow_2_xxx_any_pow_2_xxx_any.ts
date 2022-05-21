
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { GUARD } from "../helpers/GUARD";
import { is_pow_2_sym_any } from "../pow/is_pow_2_sym_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, Sym, U>;
type RHS = BCons<Sym, Sym, U>;
type EXP = BCons<Sym, LHS, RHS>;

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
 * (x ** a) * (x ** b) =>  x ** (a + b) 
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_pow_2_xxx_any_pow_2_xxx_any', MATH_MUL, guardL, guardR, cross, $);
        this.hash = hash_binop_cons_cons(MATH_MUL, MATH_POW, MATH_POW);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const sym = lhs.lhs;
        const a = lhs.rhs;
        const b = rhs.rhs;
        const expo = $.valueOf(makeList(MATH_ADD, a, b));
        const D = $.valueOf(makeList(MATH_POW, sym, expo));
        return [CHANGED, D];
    }
}

export const mul_2_pow_2_xxx_any_pow_2_xxx_any = new Builder();
