import { ExtensionEnv, MODE_FACTORING, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { MATH_POW } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_pow_2_any_rat } from "../pow/is_pow_2_any_rat";
import { is_rat } from "../rat/rat_extension";

export const abs = native_sym(Native.abs);

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = Rat;
type LHS = BCons<Sym, LL, LR>;
type RHS = Rat;
type EXP = BCons<Sym, LHS, RHS>;

const guardL = and(is_cons, is_pow_2_any_rat);
const guardR = is_rat;

/**
 * (pow (pow x 2) 1/2) => abs(x)
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    readonly phases = MODE_FACTORING;
    constructor($: ExtensionEnv) {
        super('abs_factorize', MATH_POW, guardL, guardR, $);
        this.#hash = hash_binop_cons_atom(this.opr, MATH_POW, HASH_ANY);
    }
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
