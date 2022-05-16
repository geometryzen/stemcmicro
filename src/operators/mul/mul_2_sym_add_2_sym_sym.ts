import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_SYM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { is_add_2_sym_sym } from "../add/is_add_2_sym_sym";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * a * (b + c) => (a * b) + (a * c)
 * 
 * TODO: This Operator duplicates mul_lhs_distrib_over_add_expand, but is is optimized for symbols.
 * Ideally it should be consolidated. 
 */
class Op extends Function2<Sym, BCons<Sym, Sym, Sym>> implements Operator<BCons<Sym, Sym, BCons<Sym, Sym, Sym>>> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_sym_add_2_sym_sym', MATH_MUL, is_sym, and(is_cons, is_add_2_sym_sym), $);
        this.hash = hash_binop_atom_cons(MATH_MUL, HASH_SYM, MATH_ADD);
    }
    transform2(opr: Sym, lhs: Sym, rhs: BCons<Sym, Sym, Sym>, expr: BCons<Sym, Sym, BCons<Sym, Sym, Sym>>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isExpanding()) {
            const a = lhs;
            const b = rhs.lhs;
            const c = rhs.rhs;
            const ab = $.valueOf(makeList(opr, a, b));
            const ac = $.valueOf(makeList(opr, a, c));
            return [CHANGED, $.valueOf(makeList(rhs.opr, ab, ac))];
        }
        return [NOFLAGS, expr];
    }
}

export const mul_2_sym_add_2_sym_sym = new Builder();
