import { ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_any_any } from "../mul/is_mul_2_any_any";
import { is_pow_2_any_any } from "../pow/is_pow_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Power + Multiply => Multiply + Power (prettyfmtMode only)
 * THIS SEEMS TO CONFLICT  
 */
class Op extends Function2<BCons<Sym, U, U>, BCons<Sym, U, U>> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_pow_2_any_any_mul_2_any_any', MATH_ADD, and(is_cons, is_pow_2_any_any), and(is_cons, is_mul_2_any_any), $);
        this.hash = hash_binop_cons_cons(MATH_ADD, MATH_POW, MATH_MUL);
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, U>, rhs: BCons<Sym, U, U>, orig: BCons<Sym, BCons<Sym, U, U>, BCons<Sym, U, U>>): [TFLAGS, U] {
        // const $ = this.$;
        /*
        if ($.prettyfmtMode) {
            return [true, reverse_binop(orig)];
        }
        */
        return [TFLAG_NONE, orig];
    }
}

export const add_2_pow_2_any_any_mul_2_any_any = new Builder();
