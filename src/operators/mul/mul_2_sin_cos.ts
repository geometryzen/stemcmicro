import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { MATH_COS } from "../cos/MATH_COS";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_opr_1_any } from "../helpers/is_opr_1_any";
import { UCons } from "../helpers/UCons";
import { MATH_SIN } from "../sin/MATH_SIN";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = UCons<Sym, U>;
type RHS = UCons<Sym, U>;
type EXPR = BCons<Sym, LHS, RHS>;

/**
 * Does this work for all fields? e.g. multivectors.
 * 
 * sin(X) * cos(Y) => cos(Y) * sin(Y)
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_sin_cos', MATH_MUL, and(is_cons, is_opr_1_any(MATH_SIN)), and(is_cons, is_opr_1_any(MATH_COS)), $);
        this.hash = hash_binop_cons_cons(MATH_MUL, MATH_SIN, MATH_COS);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXPR): [TFLAGS, U] {
        const $ = this.$;
        return [CHANGED, $.valueOf(makeList(opr, orig.rhs, orig.lhs))];
    }
}

export const mul_2_sin_cos = new Builder();
