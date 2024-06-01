import { is_blade } from "@stemcmicro/atoms";
import { contains_single_blade } from "../../calculators/compare/contains_single_blade";
import { extract_single_blade } from "../../calculators/compare/extract_single_blade";
import { remove_factors } from "../../calculators/remove_factors";
import { Extension, ExtensionBuilder, ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { is_multiply } from "../../runtime/helpers";
import { MATH_LCO, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { items_to_cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements ExtensionBuilder<U> {
    create(): Extension<U> {
        return new Op();
    }
}
type LHS = U;
type RHS = U;
type EXP = Cons2<Sym, U, U>;

class Op extends Function2<LHS, RHS> {
    constructor() {
        super("lco_2_any_any", MATH_LCO, is_any, is_any);
    }
    isKind(expr: U, $: ExtensionEnv): expr is EXP {
        if (super.isKind(expr, $)) {
            const lhs = expr.lhs;
            const rhs = expr.rhs;
            if (is_blade(lhs) && is_blade(rhs)) {
                // Avoid ambiguity because we know that (<< Blade Blade) exists
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        if (is_multiply(lhs)) {
            if (contains_single_blade(lhs)) {
                const bladeL = extract_single_blade(lhs);
                const residueL = remove_factors(lhs, is_blade);
                const A = $.valueOf(items_to_cons(MATH_LCO, bladeL, rhs));
                // Making an assumption here that the residue is a scalar.
                const B = $.valueOf(items_to_cons(MATH_MUL, residueL, A));
                return [TFLAG_DIFF, B];
            }
        }
        if (is_multiply(rhs)) {
            if (contains_single_blade(rhs)) {
                const bladeR = extract_single_blade(rhs);
                const residue = remove_factors(rhs, is_blade);
                const A = $.valueOf(items_to_cons(MATH_LCO, lhs, bladeR));
                // Making an assumption here that the residue is a scalar.
                const B = $.valueOf(items_to_cons(MATH_MUL, residue, A));
                return [TFLAG_DIFF, B];
            }
        }
        return [TFLAG_NONE, expr];
    }
}

export const lco_2_any_any = new Builder();
