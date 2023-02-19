import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, MODE_IMPLICATE, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_cons } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_mul } from "./is_mul";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * (* a (* b1 b2 b3 ...)) => (* a b1 b2 b3 ...) 
 */
class Op extends Function2<U, Cons> implements Operator<Cons> {
    readonly hash: string;
    readonly phases = MODE_IMPLICATE;
    constructor($: ExtensionEnv) {
        super('mul_2_any_mul', MATH_MUL, is_any, and(is_cons, is_mul), $);
        this.hash = hash_binop_atom_cons(MATH_MUL, HASH_ANY, MATH_MUL);
    }
    transform2(opr: Sym, lhs: U, rhs: Cons): [TFLAGS, U] {
        const $ = this.$;
        return [TFLAG_DIFF, $.valueOf(items_to_cons(MATH_MUL, lhs, ...rhs.tail()))];
    }
}

export const mul_2_any_mul = new Builder();
