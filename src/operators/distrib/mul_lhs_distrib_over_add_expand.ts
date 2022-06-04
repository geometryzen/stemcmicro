import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_cons } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { is_add_2_any_any } from "../add/is_add_2_any_any";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Operation * is left-distributive over (or with respect to ) +
 * 
 * A * (B + C) => (A * B) + (A * C) 
 */
class Op extends Function2<U, BCons<Sym, U, U>> implements Operator<BCons<Sym, U, BCons<Sym, U, U>>> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_lhs_distrib_over_add_expand', MATH_MUL, is_any, and(is_cons, is_add_2_any_any), $);
        this.hash = hash_binop_atom_cons(this.opr, HASH_ANY, MATH_ADD);
    }
    transform2(opr: Sym, lhs: U, rhs: BCons<Sym, U, U>, expr: BCons<Sym, U, BCons<Sym, U, U>>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isExpanding()) {
            const a = lhs;
            const b = rhs.lhs;
            const c = rhs.rhs;

            const ab = $.valueOf(makeList(opr, a, b));
            const ac = $.valueOf(makeList(opr, a, c));
            return [TFLAG_DIFF, $.valueOf(makeList(rhs.opr, ab, ac))];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

/**
 * Operation * is left-distributive over (or with respect to ) +
 * 
 * A * (B + C) => (A * B) + (A * C) 
 */
export const mul_lhs_distrib_over_add_expand = new Builder();
