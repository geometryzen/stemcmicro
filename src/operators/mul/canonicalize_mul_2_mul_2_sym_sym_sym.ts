import { canonical_order_factors_3 } from "../../calculators/order/canonical_order_factors_3";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_sym_sym } from "./is_mul_2_sym_sym";

type LHS = BCons<Sym, Sym, Sym>;
type RHS = Sym;
type EXP = BCons<Sym, LHS, RHS>;

function canoncal_reorder_factors_mul_sym_sym_sym(lhs: LHS, rhs: RHS, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
    const s1 = lhs.lhs;
    const s2 = lhs.rhs;
    const s3 = rhs;
    return canonical_order_factors_3(s1, s2, s3, orig, $);
}

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * (a * b) * c reordering (not fundamental)
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    // Assuming that there is a dependency on all features because of the use of compare factors.
    readonly dependencies: FEATURE[] = ['Blade', 'Flt', 'Imu', 'Uom', 'Vector'];
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_sym_sym_sym', MATH_MUL, and(is_cons, is_mul_2_sym_sym), is_sym, $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_SYM);
    }
    isImag(expr: EXP): boolean {
        // RHS is a symbol and so can only be a real or a vector over the reals.
        return this.$.isImag(expr.lhs);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        return canoncal_reorder_factors_mul_sym_sym_sym(lhs, rhs, expr, $);
    }
}

export const canonicalize_mul_2_mul_2_sym_sym_sym = new Builder();
