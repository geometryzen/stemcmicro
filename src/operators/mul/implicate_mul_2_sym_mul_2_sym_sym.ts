import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, PHASE_IMPLICATE, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_SYM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_sym_sym } from "./is_mul_2_sym_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * a * (b * c) => (* a b c), where a,b,c are all symbols.
 * 
 * Redundant because can be handled more fundamentally?
 */
class Op extends Function2<Sym, BCons<Sym, Sym, Sym>> implements Operator<Cons> {
    readonly hash: string;
    readonly phases = PHASE_IMPLICATE;
    constructor($: ExtensionEnv) {
        super('implicate_mul_2_sym_mul_2_sym_sym', MATH_MUL, is_sym, and(is_cons, is_mul_2_sym_sym), $);
        this.hash = hash_binop_atom_cons(MATH_MUL, HASH_SYM, MATH_MUL);
    }
    transform2(opr: Sym, lhs: Sym, rhs: BCons<Sym, Sym, Sym>): [TFLAGS, U] {
        const $ = this.$;
        const a = lhs;
        const b = rhs.lhs;
        const c = rhs.rhs;
        const abc = $.valueOf(makeList(MATH_MUL, a, b, c));
        return [TFLAG_DIFF, abc];
    }
}

export const implicate_mul_2_sym_mul_2_sym_sym = new Builder();
