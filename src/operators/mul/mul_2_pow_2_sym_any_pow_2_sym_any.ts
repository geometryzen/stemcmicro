
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
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

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        const x = lhs.lhs;
        const y = rhs.lhs;
        const k1 = lhs.rhs;
        const k2 = rhs.rhs;
        return $.isFactoring() && k1.equals(k2) && $.isScalar(x) && $.isScalar(y);
    };
}

const guardL: GUARD<U, LHS> = and(is_cons, is_pow_2_sym_any);
const guardR: GUARD<U, RHS> = and(is_cons, is_pow_2_sym_any);

/**
 * (x ** k) * (y ** k) =>  (x * y) ** k, provided x and y commute (scalars). 
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_pow_2_sym_any_pow_2_sym_any', MATH_MUL, guardL, guardR, cross($), $);
        this.hash = hash_binop_cons_cons(MATH_MUL, MATH_POW, MATH_POW);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const x = lhs.lhs;
        const y = rhs.lhs;
        const k = lhs.rhs;
        const xy = $.valueOf(makeList(opr, x, y));
        const retval = $.valueOf(makeList(MATH_POW, xy, k));
        return [TFLAG_DIFF, retval];
    }
}

export const mul_2_pow_2_sym_any_pow_2_sym_any = new Builder();
