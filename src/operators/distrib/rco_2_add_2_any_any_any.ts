import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { MATH_ADD, MATH_RCO } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * (a + b) >> c => (a >> c) + (b >> c)
 */
class Op extends Function2<BCons<Sym, U, U>, U> implements Operator<Cons> {
    readonly breaker = true;
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('rco_2_add_2_any_any_any', MATH_RCO, and(is_cons, is_opr_2_any_any(MATH_ADD)), is_any, $);
        this.hash = hash_binop_cons_atom(MATH_RCO, MATH_ADD, HASH_ANY);
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, U>, rhs: U): [TFLAGS, U] {
        const $ = this.$;
        const a = lhs.lhs;
        const b = lhs.rhs;
        const c = rhs;
        const ac = $.valueOf(items_to_cons(opr, a, c));
        const bc = $.valueOf(items_to_cons(opr, b, c));
        const retval = $.valueOf(items_to_cons(lhs.opr, ac, bc));
        return [TFLAG_DIFF, retval];
    }
}

export const rco_2_add_2_any_any_any = new Builder();
