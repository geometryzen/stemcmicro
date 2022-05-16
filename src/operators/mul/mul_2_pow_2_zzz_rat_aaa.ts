import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_pow_2_sym_rat } from "../pow/is_pow_2_sym_rat";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross(lhs: BCons<Sym, Sym, Rat>, rhs: Sym): boolean {
    const s1 = lhs.lhs;
    const s2 = rhs;
    return compare_sym_sym(s1, s2) > 0;
}

//
// (zzz ** Rat) * aaa => aaa * (zzz ** Rat)
//
class Op extends Function2X<BCons<Sym, Sym, Rat>, Sym> implements Operator<Cons> {
    readonly name = 'mul_2_pow_2_zzz_rat_aaa';
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_pow_2_zzz_rat_aaa', MATH_MUL, and(is_cons, is_pow_2_sym_rat), is_sym, cross, $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_POW, HASH_SYM);
    }
    transform2(opr: Sym, lhs: BCons<Sym, Sym, Rat>, rhs: Sym): [TFLAGS, U] {
        const $ = this.$;
        return [CHANGED, $.valueOf(makeList(opr, rhs, lhs))];
    }
}

export const mul_2_pow_2_zzz_rat_aaa = new Builder();
