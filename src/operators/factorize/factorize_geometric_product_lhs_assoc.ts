import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD, MATH_MUL, MATH_OUTER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";
import { is_opr_2_any_rhs } from "../helpers/is_opr_2_any_rhs";
import { MATH_INNER } from "../inner/MATH_INNER";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = BCons<Sym, U, U>;
type LHS = BCons<Sym, LL, LR>;
type RHS = BCons<Sym, U, U>;
type EXPR = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        if ($.isFactoring()) {
            const a1 = lhs.rhs.lhs;
            const b1 = lhs.rhs.rhs;
            const a2 = rhs.lhs;
            const b2 = rhs.rhs;
            if (a1.equals(a2) && b1.equals(b2)) {
                return $.isVector(a1) && $.isVector(b1);
            }
            return false;
        }
        else {
            return false;
        }
    };
}

const guardLR = and(is_cons, is_opr_2_any_any(MATH_INNER));
const guardLHS = and(is_cons, is_opr_2_any_rhs(MATH_ADD, guardLR));
const guardRHS = and(is_cons, is_opr_2_any_any(MATH_OUTER));

/**
 * (X + a|b) + a^b => X + a*b
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('factorize_geometric_product_lhs_assoc', MATH_ADD, guardLHS, guardRHS, cross($), $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const X = lhs.lhs;
        const a = lhs.rhs.lhs;
        const b = lhs.rhs.rhs;
        return [CHANGED, makeList(opr, X, makeList(MATH_MUL, a, b))];
    }
}

export const factorize_geometric_product_lhs_assoc = new Builder();
