import { ExtensionEnv, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { is_blade } from "../../operators/blade/is_blade";
import { is_hyp } from "../../operators/hyp/is_hyp";
import { is_imu } from "../../operators/imu/is_imu";
import { is_mul_2_any_any } from "../../operators/mul/is_mul_2_any_any";
import { is_num } from "../../operators/num/is_num";
import { is_pow_2_any_any } from "../../operators/pow/is_pow_2_any_any";
import { is_rat } from "../../operators/rat/is_rat";
import { is_sym } from "../../operators/sym/is_sym";
import { is_tensor } from "../../operators/tensor/is_tensor";
import { render_as_infix } from "../../print/print";
import { is_cons, U } from "../../tree/tree";
import { factorizeL } from "../factorizeL";
import { flip_sign } from "../flip_sign";
import { cmp_expr } from "./cmp_expr";
import { compare } from "./compare";
import { compare_num_num } from "./compare_num_num";
import { compare_sym_sym } from "./compare_sym_sym";
import { group } from "./group";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function compare_factors(lhs: U, rhs: U, $: ExtensionEnv): Sign {
    return cmp_expr(lhs, rhs, $);
}

export function compare_factors_complicated(lhs: U, rhs: U, $: ExtensionEnv): Sign {
    if (lhs.equals(rhs)) {
        return SIGN_EQ;
    }
    // When comparing power expressions, the expressions should sort first according to the base,
    // and if that is the same than
    if (is_cons(lhs) && is_pow_2_any_any(lhs) && is_cons(rhs) && is_pow_2_any_any(rhs)) {
        const baseL = lhs.lhs;
        const baseR = rhs.lhs;
        switch (compare_factors(baseL, baseR, $)) {
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
                return flip_sign(compare_factors(expoL, expoR, $));
            }
        }
    }
    // console.lg(`compare_factors lhs => ${render_as_sexpr(lhs, $)} rhs=> ${render_as_sexpr(rhs, $)}`);
    // Numeric factors in lhs term have no effect on ordering.
    if (is_cons(lhs) && is_mul_2_any_any(lhs)) {
        const [a, b] = factorizeL(lhs);
        if (is_rat(a)) {
            return compare_factors(b, rhs, $);
        }
    }
    // Numeric factors in rhs term have no effect on ordering.
    if (is_cons(rhs) && is_mul_2_any_any(rhs)) {
        const [a, b] = factorizeL(rhs);
        if (is_rat(a)) {
            return compare_factors(lhs, b, $);
        }
    }
    const gLHS = group(lhs);
    const gRHS = group(rhs);
    // console.lg("gLHS", gLHS, render_as_infix(lhs, $));
    // console.lg("gRHS", gRHS, render_as_infix(rhs, $));
    if (gLHS > gRHS) {
        return SIGN_GT;
    }
    if (gLHS < gRHS) {
        return SIGN_LT;
    }
    // We are led to believe that lhs and rhs have the same group, but we must be careful
    // console.lg(`compare_factors lhs=${print_expr(lhs, $)} rhs=${print_expr(rhs, $)}`);
    if (is_sym(lhs)) {
        if (is_sym(rhs)) {
            if ($.treatAsVector(lhs) && $.treatAsVector(rhs)) {
                return SIGN_EQ;
            }
            return compare_sym_sym(lhs, rhs);
        }
        else {
            throw new Error(`lhs: Sym = ${lhs}, rhs = ${render_as_infix(rhs, $)} ${group(rhs)}`);
        }
    }
    else if (is_hyp(lhs)) {
        if (is_hyp(rhs)) {
            return SIGN_EQ;
        }
        else {
            throw new Error(`lhs: Hyp = ${lhs}, rhs = ${rhs}`);
        }
    }
    else if (is_imu(lhs)) {
        if (is_imu(rhs)) {
            return SIGN_EQ;
        }
        else {
            throw new Error(`lhs: Imu = ${lhs}, rhs = ${rhs}`);
        }
    }
    else if (is_tensor(lhs)) {
        if (is_tensor(rhs)) {
            return SIGN_EQ;
        }
        else {
            throw new Error(`lhs: Hyp = ${lhs}, rhs = ${rhs}`);
        }
    }
    else if (is_cons(lhs)) {
        if (is_cons(rhs)) {
            const oprL = lhs.opr;
            const oprR = rhs.opr;
            // Comparison based upon the operator name.
            switch (compare(oprL, oprR)) {
                case SIGN_GT: {
                    return SIGN_GT;
                }
                case SIGN_LT: {
                    return SIGN_LT;
                }
                default: {
                    if (lhs.equals(rhs)) {
                        // TODO: Compare based on arguments...
                        return SIGN_EQ;
                    }
                    return SIGN_EQ;
                }
            }
        }
        else {
            throw new Error(`lhs = ${lhs}, rhs = ${rhs}`);
        }
    }
    else if (is_num(lhs) && is_num(rhs)) {
        return compare_num_num(lhs, rhs);
    }
    else if (is_blade(lhs) && is_blade(rhs)) {
        // It's not OK to change blade factors because multiplication is not commutative.
        return SIGN_EQ;
    }
    else {
        throw new Error(`lhs = ${render_as_infix(lhs, $)}, rhs = ${render_as_infix(rhs, $)}`);
    }
}