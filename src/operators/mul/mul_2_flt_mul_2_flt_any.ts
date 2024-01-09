import { is_flt } from "math-expression-atoms";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_FLT } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_flt_any } from "./is_mul_2_flt_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Flt1 * (Flt2 * X) => (Flt1 * Flt2) * X
 */
class Op extends Function2<Flt, BCons<Sym, Flt, U>> implements Operator<Cons> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Flt'];
    constructor($: ExtensionEnv) {
        super('mul_2_flt_mul_2_flt_any', MATH_MUL, is_flt, and(is_cons, is_mul_2_flt_any), $);
        this.hash = hash_binop_atom_cons(MATH_MUL, HASH_FLT, MATH_MUL);
    }
    transform2(opr: Sym, lhs: Flt, rhs: BCons<Sym, Flt, U>): [TFLAGS, U] {
        const $ = this.$;
        const num1 = lhs;
        const num2 = rhs.lhs;
        const r1r2 = num1.mul(num2);
        const X = rhs.rhs;
        const S = $.valueOf(items_to_cons(MATH_MUL, r1r2, X));
        return [TFLAG_DIFF, S];
    }
}

export const mul_2_flt_mul_2_flt_any = new Builder();
