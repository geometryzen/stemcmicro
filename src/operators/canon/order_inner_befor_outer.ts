import { TFLAG_DIFF, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { is_add_2_any_any } from "../add/is_add_2_any_any";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_any_any } from "../mul/is_mul_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LRL = BCons<Sym, Sym, Sym>;
type LRR = Sym;
type LR = BCons<Sym, LRL, LRR>
type L = BCons<Sym, LL, LR>
type RLRR = Sym;
type RLRL = Sym;
type RLR = BCons<Sym, RLRL, RLRR>;
type RLL = Rat;
type RL = BCons<Sym, RLL, RLR>;
type RR = Sym;
type R = BCons<Sym, RL, RR>
type EXPR = BCons<Sym, L, R>;

class Op extends Function2<L, R> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('order_inner_before_outer', MATH_MUL, and(is_cons, is_add_2_any_any), and(is_cons, is_mul_2_any_any), $);
    }
    transform2(opr: Sym, lhs: L, rhs: R, expr: EXPR): [TFLAGS, U] {
        const $ = this.$;
        if ($.isExpanding()) {
            const a = lhs;
            const b = rhs.lhs;
            const c = rhs.rhs;

            const ab = makeList(opr, a, b);
            const ac = makeList(opr, a, c);
            return [TFLAG_DIFF, makeList(rhs.opr, ab, ac)];
        }
        else {
            return [NOFLAGS, expr];
        }
    }
}

/**
 * Operation * is left-distributive over (or with respect to ) +
 * 
 * A * (B + C) => (A * B) + (A * C) 
 */
export const order_inner_before_outer = new Builder();
