import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { items_to_cons } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, U } from "../../tree/tree";
import { is_add_2_any_any } from "../add/is_add_2_any_any";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";

type LL = U;
type LRL = Cons2<Sym, Sym, Sym>;
type LRR = Sym;
type LR = Cons2<Sym, LRL, LRR>;
type L = Cons2<Sym, LL, LR>;
type RLRR = Sym;
type RLRL = Sym;
type RLR = Cons2<Sym, RLRL, RLRR>;
type RLL = Rat;
type RL = Cons2<Sym, RLL, RLR>;
type RR = Sym;
type R = Cons2<Sym, RL, RR>;
type EXPR = Cons2<Sym, L, R>;

class Op extends Function2<L, R> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super("order_inner_before_outer", MATH_MUL, and(is_cons, is_add_2_any_any), and(is_cons, is_mul_2_any_any));
    }
    transform2(opr: Sym, lhs: L, rhs: R, expr: EXPR, $: ExtensionEnv): [TFLAGS, U] {
        if ($.isExpanding()) {
            const a = lhs;
            const b = rhs.lhs;
            const c = rhs.rhs;

            const ab = items_to_cons(opr, a, b);
            const ac = items_to_cons(opr, a, c);
            return [TFLAG_DIFF, items_to_cons(rhs.opr, ab, ac)];
        } else {
            return [TFLAG_NONE, expr];
        }
    }
}

/**
 * Operation * is left-distributive over (or with respect to ) +
 *
 * A * (B + C) => (A * B) + (A * C)
 */
export const order_inner_before_outer = mkbuilder(Op);
