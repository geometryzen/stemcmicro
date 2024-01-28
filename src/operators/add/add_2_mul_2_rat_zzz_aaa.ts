import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { binswap } from "../helpers/binswap";
import { Function2X } from "../helpers/Function2X";
import { is_mul_2_rat_sym } from "../mul/is_mul_2_rat_sym";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross(lhs: Cons2<Sym, Rat, Sym>, rhs: Sym): boolean {
    return compare_sym_sym(lhs.rhs, rhs) > 0;
}

//
// (Rat * zzz) + aaa => aaa + (Rat * zzz)
//
class Op extends Function2X<Cons2<Sym, Rat, Sym>, Sym> implements Operator<Cons> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_mul_2_rat_zzz_aaa', MATH_ADD, and(is_cons, is_mul_2_rat_sym), is_sym, cross, $);
        this.#hash = hash_binop_cons_atom(MATH_ADD, MATH_MUL, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Cons2<Sym, Rat, Sym>, rhs: Sym, orig: Cons2<Sym, Cons2<Sym, Rat, Sym>, Sym>): [TFLAGS, U] {
        return [TFLAG_DIFF, binswap(orig)];
    }
}

export const add_2_mul_2_rat_zzz_aaa = new Builder();
