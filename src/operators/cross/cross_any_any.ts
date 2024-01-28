import { is_blade } from "math-expression-atoms";
import { contains_single_blade } from "../../calculators/compare/contains_single_blade";
import { extract_single_blade } from "../../calculators/compare/extract_single_blade";
import { remove_factors } from "../../calculators/remove_factors";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { items_to_cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
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
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    constructor($: ExtensionEnv) {
        super('cross_any_any', MATH_VECTOR_CROSS_PRODUCT, is_any, is_any, $);
    }
    valueOf(expr: EXP): U {
        const $ = this.$;
        const opr = expr.opr;
        const argL = expr.lhs;
        const argR = expr.rhs;
        try {
            const lhs = $.valueOf(argL);
            const rhs = $.valueOf(argR);
            if (contains_single_blade(lhs)) {
                const bladeL = extract_single_blade(lhs);
                if (!bladeL.equals(lhs)) {
                    const residueL = remove_factors(lhs, is_blade);
                    const A = $.valueOf(items_to_cons(opr, bladeL, rhs));
                    const B = $.valueOf(items_to_cons(MATH_MUL, residueL, A));
                    return B;
                }
            }
            if (contains_single_blade(rhs)) {
                const bladeR = extract_single_blade(rhs);
                if (!bladeR.equals(rhs)) {
                    const residueR = remove_factors(rhs, is_blade);
                    const A = $.valueOf(items_to_cons(opr, lhs, bladeR));
                    const B = $.valueOf(items_to_cons(MATH_MUL, A, residueR));
                    return B;
                }
            }
            return expr;
        }
        finally {
            opr.release();
            argL.release();
            argR.release();
        }
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
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
