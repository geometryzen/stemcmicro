import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_GT, MATH_LT, MATH_MUL } from "../../runtime/ns_math";
import { booF, booT } from "../../tree/boo/Boo";
import { Rat, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { is_boo } from "../boo/is_boo";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_any_any } from "../mul/is_mul_2_any_any";
import { is_rat } from "../rat/is_rat";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type LL = U;
type LR = U;
type LHS = Cons2<Sym, LL, LR>;
type RHS = Rat;
type EXPR = Cons2<Sym, LHS, RHS>;

/**
 * (< (* x y) k)
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('testlt_mul_2_any_any_rat', MATH_LT, and(is_cons, is_mul_2_any_any), is_rat, $);
        this.#hash = hash_binop_cons_atom(MATH_LT, MATH_MUL, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXPR): [TFLAGS, U] {
        if (rhs.isNegative()) {
            return [TFLAG_DIFF, booF];
        }
        if (rhs.isZero()) {
            const $ = this.$;
            const x = lhs.lhs;
            const y = lhs.rhs;
            const x_LT_0 = $.valueOf(items_to_cons(MATH_LT, x, zero));
            const y_LT_0 = $.valueOf(items_to_cons(MATH_LT, y, zero));
            const x_GT_0 = $.valueOf(items_to_cons(MATH_GT, x, zero));
            const y_GT_0 = $.valueOf(items_to_cons(MATH_GT, y, zero));
            if (is_boo(x_LT_0) && is_boo(x_GT_0) && is_boo(y_LT_0) && is_boo(y_GT_0)) {
                const cond = (x_LT_0.isTrue() && y_GT_0.isTrue()) || (x_GT_0.isTrue() && y_LT_0.isTrue());
                return [TFLAG_DIFF, cond ? booT : booF];
            }
            else {
                // console.lg();
                // console.lg(`opr=${opr}`);
                // console.lg(`x=${x}`);
                // console.lg(`y=${y}`);
                // console.lg(`k=${rhs}`);
                // console.lg(`DEBUG ${x} < 0 => ${x_LT_0}, ${x} > 0 => ${x_GT_0}`);
                // console.lg(`DEBUG ${y} < 0 => ${y_LT_0}, ${y} > 0 => ${y_GT_0}`);
            }
            return [TFLAG_DIFF, booF];
        }
        return [TFLAG_DIFF, booF];
    }
}

export const testlt_mul_2_any_any_rat = new Builder();
