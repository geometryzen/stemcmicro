import { contains_single_blade } from "../../calculators/compare/contains_single_blade";
import { extract_single_blade } from "../../calculators/compare/extract_single_blade";
import { remove_factors } from "../../calculators/remove_factors";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { items_to_cons, U } from "../../tree/tree";
import { is_blade } from "../blade/is_blade";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { MATH_VECTOR_CROSS_PRODUCT } from "./MATH_VECTOR_CROSS_PRODUCT";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type LHS = U;
type RHS = U;
type EXPR = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('cross_any_any', MATH_VECTOR_CROSS_PRODUCT, is_any, is_any, $);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXPR): [TFLAGS, U] {
        const $ = this.$;
        if (contains_single_blade(lhs)) {
            const bladeL = extract_single_blade(lhs);
            if (!bladeL.equals(lhs)) {
                const residueL = remove_factors(lhs, is_blade);
                const A = $.valueOf(items_to_cons(opr, bladeL, rhs));
                const B = $.valueOf(items_to_cons(MATH_MUL, residueL, A));
                return [TFLAG_DIFF, B];
            }
        }
        if (contains_single_blade(rhs)) {
            const bladeR = extract_single_blade(rhs);
            if (!bladeR.equals(rhs)) {
                const residueR = remove_factors(rhs, is_blade);
                const A = $.valueOf(items_to_cons(opr, lhs, bladeR));
                const B = $.valueOf(items_to_cons(MATH_MUL, A, residueR));
                return [TFLAG_DIFF, B];
            }
        }
        return [TFLAG_NONE, expr];
    }
}

export const cross_any_any = new Builder();
