import { is_rat, Rat, Sym, two } from "@stemcmicro/atoms";
import { Cons2, is_cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "@stemcmicro/hashing";
import { MATH_POW } from "../../runtime/ns_math";
import { and } from "../helpers/and";
import { Function2 } from "../helpers/Function2";
import { is_pow_2_any_rat } from "./is_pow_2_any_rat";

type LL = U;
type LR = Rat;
type LHS = Cons2<Sym, LL, LR>;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

const guardL = and(is_cons, is_pow_2_any_rat);
const guardR = is_rat;

/**
 * (b**2)**(1/2) => b, for b real and positive or zero.
 * (b**m)**n => b**(m*n), for any positive integers m and n.
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("pow_2_pow_2_any_rat_rat", MATH_POW, guardL, guardR);
        this.#hash = hash_binop_cons_atom(this.opr, MATH_POW, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    isKind(expr: U, $: ExtensionEnv): expr is Cons2<Sym, LHS, Rat> {
        if (super.isKind(expr, $)) {
            const m = expr.base.expo;
            const n = expr.expo;
            // (b**2)**(1/2)
            if (m.isTwo() && n.isHalf()) {
                const b = expr.base.base;
                if ($.isreal(b)) {
                    if ($.ispositive(b) || $.iszero(b)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const b = lhs.base;
        const m = lhs.expo;
        const n = rhs;
        if (m.isPositiveInteger() && n.isPositiveInteger()) {
            const mn = $.multiply(m, n);
            const retval = $.power(b, mn);
            return [TFLAG_DIFF, retval];
        }
        if (m.isHalf() && n.equalsRat(two)) {
            return [TFLAG_DIFF, b];
        }
        if (m.isMinusOne() && n.isMinusOne()) {
            return [TFLAG_DIFF, b];
        }
        if (m.isTwo() && n.isHalf()) {
            return [TFLAG_DIFF, b];
        }
        // console.lg(`${this.name} ${lhs} ${rhs}`);
        return [TFLAG_NONE, expr];
    }
}

export const pow_2_pow_2_any_rat_rat = mkbuilder<EXP>(Op);
