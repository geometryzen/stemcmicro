import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_MUL } from "../../runtime/ns_math";
import { negOne } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, makeList, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/BladeExtension";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_blade_rat } from "../mul/is_mul_2_blade_rat";
import { is_rat } from "../rat/RatExtension";
import { MATH_VECTOR_OR_CROSS_PRODUCT } from "./MATH_VECTOR_OR_CROSS_PRODUCT";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type LHS = Blade;
type RHS = Blade;
type EXPR = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('cross_blade_blade', MATH_VECTOR_OR_CROSS_PRODUCT, is_blade, is_blade, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXPR): [TFLAGS, U] {
        const $ = this.$;
        const wedge = lhs.__wedge__(rhs);
        if (is_blade(wedge)) {
            return [CHANGED, $.valueOf(makeList(MATH_MUL, negOne, wedge.dual()))];
        }
        if (is_rat(wedge)) {
            return [CHANGED, wedge];
        }
        if (is_cons(wedge) && is_mul_2_blade_rat(wedge)) {
            const bld = wedge.lhs;
            const num = wedge.rhs;
            return [CHANGED, $.valueOf(makeList(MATH_MUL, negOne.mul(num), bld.dual()))];
        }
        // Other possibilities...
        // Rat * Blade
        // Num * Blade
        throw new Error(`${wedge}`);
    }
}

export const cross_blade_blade = new Builder();
