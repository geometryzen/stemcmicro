import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "../../hashing/hash_info";
import { MATH_LT } from "../../runtime/ns_math";
import { booF } from "../../tree/boo/Boo";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type LHS = Sym;
type RHS = Rat;
type EXPR = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('testlt_sym_rat', MATH_LT, is_sym, is_rat, $);
        this.#hash = hash_binop_atom_atom(MATH_LT, HASH_SYM, HASH_RAT);
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
            return [TFLAG_DIFF, booF];
        }
        return [TFLAG_DIFF, booF];
    }
}

export const testlt_sym_rat = new Builder();
