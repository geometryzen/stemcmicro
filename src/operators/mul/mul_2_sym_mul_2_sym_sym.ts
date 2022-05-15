import { canonical_order_factors_3 } from "../../calculators/order/canonical_order_factors_3";
import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_sym_sym } from "./is_mul_2_sym_sym";

function canoncal_reorder_factors_mul_sym_sym_sym(lhs: Sym, rhs: BCons<Sym, Sym, Sym>, orig: Cons, $: ExtensionEnv): [TFLAGS, U] {
    const s1 = lhs;
    const s2 = rhs.lhs;
    const s3 = rhs.rhs;
    return canonical_order_factors_3(s1, s2, s3, orig, $);
}

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

export const mul_2_sym_mul_2_sym_sym = new Builder();

/**
 * a * (b * c)
 * 
 * Redundant because can be handled more fundamentally?
 */
class Op extends Function2<Sym, BCons<Sym, Sym, Sym>> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('mul_2_sym_mul_2_sym_sym', MATH_MUL, is_sym, and(is_cons, is_mul_2_sym_sym), $);
    }
    transform2(opr: Sym, lhs: Sym, rhs: BCons<Sym, Sym, Sym>, expr: BCons<Sym, Sym, BCons<Sym, Sym, Sym>>): [TFLAGS, U] {
        // console.log(`${this.name} explicate=${this.$.explicateMode} implicate=${this.$.implicateMode}`);
        const $ = this.$;
        if ($.explicateMode) {
            return canoncal_reorder_factors_mul_sym_sym_sym(lhs, rhs, expr, $);
        }
        if ($.implicateMode) {
            const a = lhs;
            const b = rhs.lhs;
            const c = rhs.rhs;
            return [CHANGED, makeList(MATH_MUL, a, b, c)];
        }
        return [NOFLAGS, expr];
    }
}
