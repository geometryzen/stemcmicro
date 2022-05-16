
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
    return s1.equalsSym(s2);
}

/**
 * (xxx ** Rat) * xxx => xxx ** (succ(Rat)) 
 */
class Op extends Function2X<BCons<Sym, Sym, Rat>, Sym> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_pow_2_xxx_rat_xxx', MATH_MUL, and(is_cons, is_pow_2_sym_rat), is_sym, cross, $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_POW, HASH_SYM);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: BCons<Sym, Sym, Rat>, rhs: Sym, expr: BCons<Sym, BCons<Sym, Sym, Rat>, Sym>): [TFLAGS, U] {
        const $ = this.$;
        const xxx = lhs.lhs;
        const rat = lhs.rhs;
        const expo = rat.succ();
        const D = $.valueOf(makeList(MATH_POW, xxx, expo));
        return [CHANGED, D];
    }
}

export const mul_2_pow_2_xxx_rat_xxx = new Builder();
