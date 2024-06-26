import { create_sym, is_blade, Sym } from "@stemcmicro/atoms";
import { contains_single_blade, extract_single_blade, remove_factors } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons2, items_to_cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

const MATH_MUL = native_sym(Native.multiply);
const MATH_VECTOR_CROSS_PRODUCT = create_sym("cross");

type LHS = U;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super("cross_any_any", MATH_VECTOR_CROSS_PRODUCT, is_any, is_any);
    }
    valueOf(expr: EXP, $: ExtensionEnv): U {
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
        } finally {
            opr.release();
            argL.release();
            argR.release();
        }
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
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

export const cross_any_any = mkbuilder<EXP>(Op);
