import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, PHASE_IMPLICATE_FLAG, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_cons } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_add } from "./is_add";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new AddAnyAdd($);
    }
}

/**
 * (+ a (+ b1 b2 b3 ...)) => (+ a b1 b2 b3 ...) 
 */
class AddAnyAdd extends Function2<U, Cons> implements Operator<Cons> {
    readonly name = 'add_2_any_add';
    readonly hash: string;
    readonly phases = PHASE_IMPLICATE_FLAG;
    constructor($: ExtensionEnv) {
        super('add_2_any_add', MATH_ADD, is_any, and(is_cons, is_add), $);
        this.hash = hash_binop_atom_cons(MATH_ADD, HASH_ANY, MATH_ADD);
    }
    transform2(opr: Sym, lhs: U, rhs: Cons): [TFLAGS, U] {
        const $ = this.$;
        return [CHANGED, $.valueOf(makeList(opr, lhs, ...rhs.tail()))];
    }
}

export const add_2_any_add = new Builder();
