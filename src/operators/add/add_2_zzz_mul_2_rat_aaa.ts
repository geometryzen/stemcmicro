import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_SYM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_mul_2_rat_sym } from "../mul/is_mul_2_rat_sym";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross(lhs: Sym, rhs: BCons<Sym, Rat, Sym>): boolean {
    return compare_sym_sym(lhs, rhs.rhs) > 0;
}

//
// TODO: This could be add_2_any_any, with the flip being done by mul_2_rat_sym
//
// zzz + (Rat * aaa) => (Rat * aaa) + zzz
//
class Op extends Function2X<Sym, BCons<Sym, Rat, Sym>> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_zzz_mul_2_rat_aaa', MATH_ADD, is_sym, and(is_cons, is_mul_2_rat_sym), cross, $);
        this.hash = hash_binop_atom_cons(MATH_ADD, HASH_SYM, MATH_MUL);
    }
    transform2(opr: Sym, lhs: Sym, rhs: BCons<Sym, Rat, Sym>): [TFLAGS, U] {
        return [TFLAG_DIFF, makeList(opr, rhs, lhs)];
    }
}

export const add_2_zzz_mul_2_rat_aaa = new Builder();
