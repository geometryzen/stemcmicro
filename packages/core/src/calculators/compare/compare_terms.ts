import { is_blade, is_rat, is_sym, one, zero } from "@stemcmicro/atoms";
import { is_native, Native } from "@stemcmicro/native";
import { is_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { imu } from "../../env/imu";
import { compare_blade_blade } from "../../operators/blade/blade_extension";
import { is_unaop } from "../../operators/helpers/is_unaop";
import { is_imu } from "../../operators/imu/is_imu";
import { is_cons_opr_eq_mul } from "../../operators/mul/is_cons_opr_eq_mul";
import { is_mul_2_any_any } from "../../operators/mul/is_mul_2_any_any";
import { is_mul_2_any_blade } from "../../operators/mul/is_mul_2_any_blade";
import { is_mul_2_num_any } from "../../operators/mul/is_mul_2_num_any";
import { is_mul_2_sym_sym } from "../../operators/mul/is_mul_2_sym_sym";
import { is_num } from "../../operators/num/is_num";
import { is_pow_2_any_any } from "../../operators/pow/is_pow_2_any_any";
import { is_pow_2_sym_rat } from "../../operators/pow/is_pow_2_sym_rat";
import { canonical_factor_lhs, canonical_factor_rhs } from "../factorize/canonical_factor";
import { canonical_factor_blade_rhs } from "../factorize/canonical_factor_blade";
import { canonical_factor_imu_rhs } from "../factorize/canonical_factor_imu";
import { canonical_factor_num_lhs, canonical_factor_num_rhs } from "../factorize/canonical_factor_num";
import { factorizeL } from "../factorizeL";
import { compare_cons_cons } from "./compare_cons_cons";
import { compare_num_num } from "./compare_num_num";
import { compare_sym_sym } from "./compare_sym_sym";

/**
 * FIXME: Needs more testing.
 * Dead code for reference only.
 */
function compare_terms(lhs: U, rhs: U, $: ExtensionEnv): Sign {
    // console.lg("compare_terms", $.toInfixString(lhs), $.toInfixString(rhs));
    const lhsR = canonical_factor_num_rhs(lhs);
    const rhsR = canonical_factor_num_rhs(rhs);
    switch (compare_terms_core(lhsR, rhsR, $)) {
        case SIGN_GT: {
            return SIGN_GT;
        }
        case SIGN_LT: {
            return SIGN_LT;
        }
        case SIGN_EQ: {
            // If two terms, apart from numeric factors, are equal then it really does not matter too much
            // how they are sorted because they are destined to be combined through addition.
            const lhsL = canonical_factor_num_lhs(lhs);
            const rhsL = canonical_factor_num_lhs(rhs);
            return compare_num_num(lhsL, rhsL);
        }
    }
}

function compare_terms_core(lhs: U, rhs: U, $: ExtensionEnv): Sign {
    lhs = canonical_factor_num_rhs(lhs);
    rhs = canonical_factor_num_rhs(rhs);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: Sign, description: string): Sign {
        return retval;
    };
    // console.lg(`compare_terms ${render_as_infix(lhs, $)} ${render_as_infix(rhs, $)}`);
    if (lhs.equals(rhs)) {
        return hook(SIGN_EQ, "A");
    }
    if (is_cons(lhs) && is_pow_2_any_any(lhs) && is_cons(rhs) && is_pow_2_any_any(rhs)) {
        const baseL = lhs.lhs;
        const baseR = rhs.lhs;
        switch (compare_terms(baseL, baseR, $)) {
            case SIGN_GT: {
                return SIGN_GT;
            }
            case SIGN_LT: {
                return SIGN_LT;
            }
            default: {
                const expoL = lhs.rhs;
                const expoR = rhs.rhs;
                // We want higher powers on the LHS, so we flip the signs.
                return compare_terms(expoL, expoR, $);
                // return flip_sign(compare_terms(expoL, expoR, $));
            }
        }
    }

    if (is_sym(lhs) && is_sym(rhs)) {
        return hook(compare_sym_sym(lhs, rhs), "B");
    }
    if (is_cons(lhs)) {
        if (is_mul_2_num_any(lhs)) {
            throw new Error("This should be dead code now");
            // A factor of a number on the lhs has no effect.
            // Note that this only catches the case when lhs = (* Num X).
            // return hook(compare_terms(lhs.rhs, rhs, $), "C");
        }
        if (is_mul_2_any_any(lhs)) {
            const [a, b] = factorizeL(lhs);
            if (is_rat(a)) {
                return hook(compare_terms(b, rhs, $), "D");
            }
        }
    }
    if (is_cons(rhs)) {
        if (is_mul_2_num_any(rhs)) {
            throw new Error("This should be dead code now");
            // A factor of a number on the rhs has no effect.
            // Note that this only catches the case when rhs = (* Num X).
            // return hook(compare_terms(lhs, rhs.rhs, $), "E");
        }
        if (is_mul_2_any_any(rhs)) {
            const [a, b] = factorizeL(rhs);
            // console.lg(`factorizeL ${print_expr(rhs, $)} => a = ${print_expr(a, $)}, b = ${print_expr(b, $)}`);
            if (is_rat(a)) {
                return hook(compare_terms(lhs, b, $), "F");
            }
        }
    }
    if (is_sym(lhs)) {
        if ($.isimag(rhs)) {
            return hook(SIGN_LT, "G");
        }
        if (is_num(rhs)) {
            // Comparing (pow x 1) to (pow x 0)
            return hook(compare_num_num(one, zero), "H");
        }
        if (is_cons(rhs) && is_pow_2_any_any(rhs)) {
            const base = rhs.lhs;
            const expo = rhs.rhs;
            if (lhs.equals(base)) {
                if (is_num(expo)) {
                    return hook(compare_num_num(one, expo), "I");
                }
            }
        }
        return SIGN_EQ;
    }
    if (is_sym(rhs)) {
        if ($.isimag(lhs)) {
            return hook(SIGN_GT, "K");
        }
        if (is_num(lhs)) {
            // Comparing (pow x 0) to (pow x 1)
            return hook(compare_num_num(zero, one), "L");
        }
        if (is_cons(lhs) && is_pow_2_any_any(lhs)) {
            const base = lhs.lhs;
            const expo = lhs.rhs;
            if (rhs.equals(base)) {
                if (is_num(expo)) {
                    return hook(compare_num_num(expo, one), "M");
                }
            }
        }
        return SIGN_EQ;
    }
    if (is_num(lhs) && is_num(rhs)) {
        return compare_num_num(lhs, rhs);
    }
    if (is_num(lhs)) {
        if ($.isimag(rhs)) {
            return hook(SIGN_LT, "O");
        }
        if (is_cons(rhs) && is_pow_2_any_any(rhs)) {
            const expo = rhs.rhs;
            if (is_num(expo)) {
                return hook(compare_num_num(zero, expo), "P");
            }
        }
    }
    if (is_num(rhs)) {
        if ($.isimag(lhs)) {
            return hook(SIGN_GT, "Q");
        }
        if (is_sym(lhs)) {
            return hook(compare_num_num(one, zero), "R");
        }
        if (is_cons(lhs) && is_pow_2_any_any(lhs)) {
            const base = lhs.lhs;
            const expo = lhs.rhs;
            if (is_sym(base) && is_num(expo)) {
                return hook(compare_num_num(expo, zero), "S");
            }
        }
    }
    if (is_blade(lhs) && is_blade(rhs)) {
        return hook(compare_blade_blade(lhs, rhs), "T");
    }
    if (is_blade(lhs)) {
        return hook(SIGN_GT, "T");
    }
    if (is_blade(rhs)) {
        return hook(SIGN_LT, "T");
    }
    const lhsI = canonical_factor_imu_rhs(lhs);
    const rhsI = canonical_factor_imu_rhs(rhs);
    switch (compare_terms(lhsI, rhsI, $)) {
        case SIGN_GT: {
            return hook(SIGN_GT, "MM1");
        }
        case SIGN_LT: {
            return hook(SIGN_LT, "MM2");
        }
        case SIGN_EQ: {
            if (is_cons(lhs) && is_cons_opr_eq_mul(lhs) && is_cons(rhs) && is_cons_opr_eq_mul(rhs)) {
                const lhsB = canonical_factor_blade_rhs(lhs);
                const rhsB = canonical_factor_blade_rhs(rhs);
                switch (compare_terms(lhsB, rhsB, $)) {
                    case SIGN_GT: {
                        return hook(SIGN_GT, "MM1");
                    }
                    case SIGN_LT: {
                        return hook(SIGN_LT, "MM2");
                    }
                    case SIGN_EQ: {
                        if (is_cons(lhs) && is_cons_opr_eq_mul(lhs) && is_cons(rhs) && is_cons_opr_eq_mul(rhs)) {
                            const lhsL = canonical_factor_lhs(lhs);
                            const rhsL = canonical_factor_lhs(rhs);
                            switch (compare_terms(lhsL, rhsL, $)) {
                                case SIGN_GT: {
                                    return hook(SIGN_GT, "MM1");
                                }
                                case SIGN_LT: {
                                    return hook(SIGN_LT, "MM2");
                                }
                                case SIGN_EQ: {
                                    const lhsR = canonical_factor_rhs(lhs);
                                    const rhsR = canonical_factor_rhs(rhs);
                                    return hook(compare_terms(lhsR, rhsR, $), "MM3");
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (is_cons(lhs) && is_cons(rhs)) {
        // console.lg(`CONTINUING compare_terms ${render_as_infix(lhs, $)} ${render_as_infix(rhs, $)}`);
        // console.lg(`OPERATORS compare_terms ${render_as_infix(lhs.opr, $)} ${render_as_infix(rhs.opr, $)}`);
        const oprLHS = lhs.opr;
        const oprRHS = rhs.opr;
        if (oprLHS.equals(oprRHS) && is_sym(oprLHS) && is_native(oprLHS, Native.derivative)) {
            return compare_cons_cons(lhs, rhs, $);
        }
        if (is_mul_2_any_blade(lhs) && is_mul_2_any_blade(rhs)) {
            switch (compare_blade_blade(lhs.rhs, rhs.rhs)) {
                case SIGN_GT: {
                    return hook(SIGN_GT, "U");
                }
                case SIGN_LT: {
                    return hook(SIGN_LT, "V");
                }
                default: {
                    return hook(compare_terms(lhs.lhs, rhs.lhs, $), "W");
                }
            }
        }
        if (is_mul_2_any_blade(lhs)) {
            return hook(SIGN_GT, "X");
        }
        if (is_mul_2_any_blade(rhs)) {
            return hook(SIGN_LT, "Y");
        }
        if (is_mul_2_any_any(lhs) && is_mul_2_any_any(rhs)) {
            switch (compare_terms(lhs.lhs, rhs.lhs, $)) {
                case SIGN_GT: {
                    return SIGN_GT;
                }
                case SIGN_LT: {
                    return SIGN_LT;
                }
                default: {
                    return compare_terms(lhs.rhs, rhs.rhs, $);
                }
            }
        }
        if (is_pow_2_any_any(lhs) && is_pow_2_any_any(rhs)) {
            // Compare based upon the base first.
            const baseL = lhs.lhs;
            const baseR = rhs.lhs;
            switch (compare_terms(baseL, baseR, $)) {
                case SIGN_GT: {
                    return SIGN_GT;
                }
                case SIGN_LT: {
                    return SIGN_LT;
                }
                default: {
                    // Compare based on the exponents.
                    const expoL = lhs.rhs;
                    const expoR = rhs.rhs;
                    if (is_num(expoL) && is_num(expoR)) {
                        return compare_num_num(expoL, expoR);
                    }
                    return compare_terms(expoL, expoR, $);
                }
            }
        }
        if (is_pow_2_sym_rat(lhs) && is_mul_2_sym_sym(rhs)) {
            const base = lhs.lhs;
            const expo = lhs.rhs;
            if (expo.isTwo()) {
                if (base.equals(rhs.lhs)) {
                    return compare_terms(base, rhs.rhs, $);
                }
                if (base.equals(rhs.rhs)) {
                    return compare_terms(base, rhs.lhs, $);
                }
            }
        }
        if (is_mul_2_sym_sym(lhs) && is_pow_2_sym_rat(rhs)) {
            const base = rhs.lhs;
            const expo = rhs.rhs;
            if (expo.isTwo()) {
                if (lhs.lhs.equals(base)) {
                    return compare_terms(lhs.rhs, base, $);
                }
                if (lhs.rhs.equals(base)) {
                    return compare_terms(lhs.lhs, base, $);
                }
            }
        }
        if (is_unaop(lhs) && is_unaop(rhs)) {
            switch (compare_terms(lhs.opr, rhs.opr, $)) {
                case SIGN_GT: {
                    return SIGN_GT;
                }
                case SIGN_LT: {
                    return SIGN_LT;
                }
                default: {
                    return compare_terms(lhs.arg, rhs.arg, $);
                }
            }
        }
        if (is_imu(lhs)) {
            // This is really a bit imprecise.
            if (rhs.contains(imu)) {
                return SIGN_EQ;
            } else {
                return SIGN_GT;
            }
        }
        if (is_imu(rhs)) {
            // This is really a bit imprecise.
            if (lhs.contains(imu)) {
                return SIGN_EQ;
            } else {
                return SIGN_LT;
            }
        }
        // Exchanging unary and binary operators can cause looping problems.
        // e.g. when changing associativity.
        /*
        if (is_unaop(lhs) && is_binop(rhs)) {
            return SIGN_LT;
        }
        if (is_binop(lhs) && is_unaop(rhs)) {
            return SIGN_GT;
        }
        */
        // throw new Error(`compare_terms_redux lhs=${print_expr(lhs, $)} rhs=${print_expr(rhs, $)}`);
        //        return compare_terms_redux(lhs.opr, rhs.opr, $);
    }
    if ($.isimag(lhs) && $.isreal(rhs)) {
        return SIGN_GT;
    }
    if ($.isreal(lhs) && $.isimag(rhs)) {
        return SIGN_LT;
    }
    return SIGN_EQ;
}
