import { TFLAG_DIFF, ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_SYM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { binswap } from "../helpers/binswap";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_sym_rat } from "../mul/is_mul_2_sym_rat";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Sym;
type RL = Sym;
type RR = Rat;
type RHS = BCons<Sym, RL, RR>;
type EXP = BCons<Sym, LHS, RHS>

//
// TODO: This could be add_2_any_any, with the flip being done by mul_2_rat_sym
//
// Sym1 + (Sym2 * Rat) => Sym1 + (Rat * Sym2)
//
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_sym_mul_2_sym_rat', MATH_ADD, is_sym, and(is_cons, is_mul_2_sym_rat), $);
        this.hash = hash_binop_atom_cons(MATH_ADD, HASH_SYM, MATH_MUL);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        const $ = this.$;
        if ($.explicateMode) {
            const retval = makeList(opr, lhs, binswap(rhs));
            return [TFLAG_DIFF, retval];
        }
        return [TFLAG_NONE, orig];
    }
}

export const add_2_sym_mul_2_sym_rat = new Builder();
