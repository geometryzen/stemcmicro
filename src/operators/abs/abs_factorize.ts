import { is_rat, Rat, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons, Cons2, is_cons, items_to_cons, U } from "math-expression-tree";
import { Extension, ExtensionBuilder, FEATURE, MODE_FACTORING, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { and } from "../helpers/and";
import { Function2 } from "../helpers/Function2";
import { is_pow_2_any_rat } from "../pow/is_pow_2_any_rat";

export const abs = native_sym(Native.abs);

class Builder implements ExtensionBuilder<Cons> {
    create(): Extension<Cons> {
        return new Op();
    }
}

type LL = U;
type LR = Rat;
type LHS = Cons2<Sym, LL, LR>;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

const guardL = and(is_cons, is_pow_2_any_rat);
const guardR = is_rat;

/**
 * (pow (pow x 2) 1/2) => abs(x)
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly phases = MODE_FACTORING;
    constructor() {
        super('abs_factorize', MATH_POW, guardL, guardR);
        this.#hash = hash_binop_cons_atom(this.opr, MATH_POW, HASH_ANY);
    }
    dependencies?: FEATURE[] | undefined;
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const x = lhs.lhs;
        const m = lhs.rhs;
        const n = rhs;
        if (m.isTwo() && n.isHalf()) {
            const factorized = items_to_cons(abs, x);
            return [TFLAG_DIFF, factorized];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const abs_factorize = new Builder();
