
import { ExtensionEnv, Operator, OperatorBuilder, STABLE, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
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
 *
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_cos_sin', MATH_MUL, and(is_cons, is_opr_1_any(MATH_COS)), and(is_cons, is_opr_1_any(MATH_SIN)), $);
        this.hash = hash_binop_cons_cons(MATH_MUL, MATH_COS, MATH_SIN);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXPR): [TFLAGS, U] {
        // TODO: Should mul_2_sin_cos and mul_2_cos_sin coordinate on who will be canonical?
        return [STABLE, orig];
        // const $ = this.$;
        // return [CHANGED, $.valueOf(makeList(opr, orig.rhs, orig.lhs))];
    }
}

export const mul_2_cos_sin = new Builder();
