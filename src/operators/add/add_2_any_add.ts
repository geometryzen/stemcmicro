import { ExtensionEnv, Operator, OperatorBuilder, MODE_EXPANDING, MODE_IMPLICATE, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_cons } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_add } from "./is_add";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * (+ a (+ b1 b2 b3 ...)) => (+ a b1 b2 b3 ...) 
 */
class Op extends Function2<U, Cons> implements Operator<Cons> {
    readonly name = 'add_2_any_add';
    readonly hash: string;
    readonly phases = MODE_IMPLICATE | MODE_EXPANDING;
    constructor($: ExtensionEnv) {
        super('add_2_any_add', MATH_ADD, is_any, and(is_cons, is_add), $);
        this.hash = hash_binop_atom_cons(MATH_ADD, HASH_ANY, MATH_ADD);
    }
    transform2(opr: Sym, lhs: U, rhs: Cons, expr: Cons): [TFLAGS, U] {
        const $ = this.$;
        if ($.isImplicating()) {
            return [TFLAG_DIFF, $.valueOf(items_to_cons(opr, lhs, ...rhs.tail()))];
        }
        else if ($.isAssociationImplicit()) {
            return [TFLAG_DIFF, $.valueOf(items_to_cons(opr, lhs, ...rhs.tail()))];

        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const add_2_any_add = new Builder();
