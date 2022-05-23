import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_SYM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_pow_2_sym_rat } from "../pow/is_pow_2_sym_rat";
import { is_sym } from "../sym/is_sym";

type GUARD<I, O extends I> = (arg: I) => arg is O;

function and<L extends U, R extends L, T extends R>(guardL: GUARD<U, L>, guardR: GUARD<L, R>): GUARD<U, T> {
    return function (arg: U): arg is T {
        return guardL(arg) && guardR(arg);
    };
}

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross(lhs: Sym, rhs: BCons<Sym, Sym, Rat>): boolean {
    const zzz = lhs;
    const aaa = rhs.lhs;
    return compare_sym_sym(zzz, aaa) > 0;
}

//
// zzz * (aaa ** Rat) => (aaa ** Rat) * zzz
//
class Op extends Function2X<Sym, BCons<Sym, Sym, Rat>> implements Operator<Cons> {
    readonly name = 'mul_2_zzz_pow_2_aaa_rat';
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_zzz_pow_2_aaa_rat', MATH_MUL, is_sym, and(is_cons, is_pow_2_sym_rat), cross, $);
        this.hash = hash_binop_atom_cons(MATH_MUL, HASH_SYM, MATH_POW);
    }
    transform2(opr: Sym, lhs: Sym, rhs: BCons<Sym, Sym, Rat>): [TFLAGS, U] {
        return [TFLAG_DIFF, makeList(opr, rhs, lhs)];
    }
}

export const mul_2_zzz_pow_2_aaa_rat = new Builder();
