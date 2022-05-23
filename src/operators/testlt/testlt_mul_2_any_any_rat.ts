import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_GT, MATH_LT, MATH_MUL } from "../../runtime/ns_math";
import { False, True } from "../../tree/boo/Boo";
import { is_boo } from "../../tree/boo/is_boo";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_any_any } from "../mul/is_mul_2_any_any";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type LL = U;
type LR = U;
type LHS = BCons<Sym, LL, LR>;
type RHS = Rat;
type EXPR = BCons<Sym, LHS, RHS>;

/**
 * (< (* x y) k)
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('testlt_mul_2_any_any_rat', MATH_LT, and(is_cons, is_mul_2_any_any), is_rat, $);
        this.hash = hash_binop_cons_atom(MATH_LT, MATH_MUL, HASH_RAT);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXPR): [TFLAGS, U] {
        if (rhs.isNegative()) {
            return [TFLAG_DIFF, False];
        }
        if (rhs.isZero()) {
            const $ = this.$;
            const x = lhs.lhs;
            const y = lhs.rhs;
            const x_LT_0 = $.valueOf(makeList(MATH_LT, x, zero));
            const y_LT_0 = $.valueOf(makeList(MATH_LT, y, zero));
            const x_GT_0 = $.valueOf(makeList(MATH_GT, x, zero));
            const y_GT_0 = $.valueOf(makeList(MATH_GT, y, zero));
            if (is_boo(x_LT_0) && is_boo(x_GT_0) && is_boo(y_LT_0) && is_boo(y_GT_0)) {
                const cond = (x_LT_0.isTrue() && y_GT_0.isTrue()) || (x_GT_0.isTrue() && y_LT_0.isTrue());
                return [TFLAG_DIFF, cond ? True : False];
            }
            else {
                /*
                console.log();
                console.log(`opr=${opr}`);
                console.log(`x=${x}`);
                console.log(`y=${y}`);
                console.log(`k=${rhs}`);
                console.log(`DEBUG ${x} < 0 => ${x_LT_0}, ${x} > 0 => ${x_GT_0}`);
                console.log(`DEBUG ${y} < 0 => ${y_LT_0}, ${y} > 0 => ${y_GT_0}`);
                */
            }
            return [TFLAG_DIFF, False];
        }
        return [TFLAG_DIFF, False];
    }
}

export const testlt_mul_2_any_any_rat = new Builder();
