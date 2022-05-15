import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_mul_2_any_blade } from "../mul/is_mul_2_any_blade";
import { is_add_2_any_mul_2_any_blade } from "./is_add_2_any_mul_2_any_blade";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = BCons<Sym, U, Blade>;
type LHS = BCons<Sym, LL, LR>;
type RHS = BCons<Sym, U, Blade>;
type EXPR = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        if ($.implicateMode) {
            return false;
        }
        if ($.isFactoring()) {
            const blade1 = lhs.rhs.rhs;
            const blade2 = rhs.rhs;
            return blade1.equals(blade2);
        }
        else {
            return false;
        }
    };
}

/**
 * (X + b * blade) + c * blade => X + (b + c) * blade
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('add_2_assoc_lhs_factorize_blades', MATH_ADD, and(is_cons, is_add_2_any_mul_2_any_blade), and(is_cons, is_mul_2_any_blade), cross($), $);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const X = lhs.lhs;
        const b = lhs.rhs.lhs;
        const blade = lhs.rhs.rhs;
        const c = rhs.lhs;
        const bc = $.valueOf(makeList(MATH_ADD, b, c));
        const bcBlade = $.valueOf(makeList(MATH_MUL, bc, blade));
        const retval = $.valueOf(makeList(MATH_ADD, X, bcBlade));
        return [CHANGED, retval];
    }
}

export const add_2_assoc_lhs_factorize_blades = new Builder();
