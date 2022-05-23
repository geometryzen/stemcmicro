import { TFLAG_DIFF, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { power_v1 } from "./power_v1";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = U;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * 
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    constructor($: ExtensionEnv) {
        super('pow_2_any_any', MATH_POW, is_any, is_any, $);
    }
    isZero(expr: EXP): boolean {
        return this.$.isZero(expr.lhs);
    }
    transform2(opr: Sym, base: LHS, expo: RHS, oldExpr: EXP): [TFLAGS, U] {
        const $ = this.$;
        if ($.isFactoring()) {
            return [NOFLAGS, oldExpr];
        }
        else {
            // Thi appears to do nothing but recall that the base class done its own transformation.
            const newExpr = power_v1(base, expo, oldExpr, this.$);
            return [!newExpr.equals(oldExpr) ? TFLAG_DIFF : NOFLAGS, newExpr];
        }
    }
}

export const pow_2_any_any = new Builder();
