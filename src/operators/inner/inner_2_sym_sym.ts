import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, SIGN_GT, STABLE, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, makeList, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { value_of } from "../helpers/valueOf";
import { is_sym } from "../sym/is_sym";

function canoncal_reorder_inner_factors_sym_sym(opr: Sym, lhs: Sym, rhs: Sym, orig: Cons, $: ExtensionEnv): [TFLAGS, U] {
    switch (compare_sym_sym(lhs, rhs)) {
        case SIGN_GT: {
            return [CHANGED, value_of(makeList(opr, rhs, lhs), $)];
        }
        default: {
            return [STABLE, orig];
        }
    }
}

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Sym;
type RHS = Sym;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * Sym | Sym
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    constructor($: ExtensionEnv) {
        super('inner_2_sym_sym', MATH_INNER, is_sym, is_sym, $);
    }
    isScalar(): boolean {
        return true;
    }
    isVector(): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isZero(expr: EXP): boolean {
        // It actually could be zero.
        return false;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        if ($.treatAsScalar(lhs)) {
            if ($.treatAsScalar(rhs)) {
                // TODO: This is incorrect because 
                // scalar | scalar
                return [CHANGED, value_of(makeList(MATH_MUL.clone(opr.pos, opr.end), lhs, rhs), $)];
            }
            else if ($.treatAsVector(rhs)) {
                // scalar | vector
                return [CHANGED, zero];
            }
            else {
                // scalar | something
                return [STABLE, expr];
            }
        }
        else if ($.treatAsVector(lhs)) {
            if ($.treatAsScalar(rhs)) {
                // vector | scalar
                return [CHANGED, zero];
            }
            else if ($.treatAsVector(rhs)) {
                // vector | vector
                if ($.isFactoring()) {
                    if (lhs.equals(rhs)) {
                        // x | x = x * x - x ^ x = x * x
                        return [CHANGED, makeList(MATH_MUL.clone(opr.pos, opr.end), lhs, lhs)];
                    }
                }
                return canoncal_reorder_inner_factors_sym_sym(opr, lhs, rhs, expr, $);
            }
            else {
                // vector | something
                return [STABLE, expr];
            }
        }
        else {
            if ($.treatAsScalar(rhs)) {
                // something | scalar
                return [CHANGED, value_of(makeList(MATH_MUL.clone(opr.pos, opr.end), lhs, rhs), $)];
            }
            else if ($.treatAsVector(rhs)) {
                // something | vector
                return [STABLE, expr];
            }
            else {
                // something | something
                return [STABLE, expr];
            }
        }
    }
}

export const inner_2_sym_sym = new Builder();
