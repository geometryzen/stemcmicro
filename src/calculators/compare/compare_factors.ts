import { ExtensionEnv, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { is_hyp } from "../../operators/hyp/is_hyp";
import { is_mul_2_any_any } from "../../operators/mul/is_mul_2_any_any";
import { is_sym } from "../../operators/sym/is_sym";
import { is_num } from "../../predicates/is_num";
import { print_expr } from "../../print";
import { is_rat } from "../../tree/rat/is_rat";
import { is_tensor } from "../../tree/tensor/is_tensor";
import { is_cons, U } from "../../tree/tree";
import { factorizeL } from "../factorizeL";
import { compare } from "./compare";
import { compare_num_num } from "./compare_num_num";
import { compare_sym_sym } from "./compare_sym_sym";
import { group } from "./group";

export function compare_factors(lhs: U, rhs: U, $: ExtensionEnv): Sign {
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
    if (gLHS > gRHS) {
        return SIGN_GT;
    }
    if (gLHS < gRHS) {
        return SIGN_LT;
    }
    // We are led to believe that lhs and rhs have the same group, but we must be careful
    // console.log(`compare_factors lhs=${print_expr(lhs, $)} rhs=${print_expr(rhs, $)}`);
    if (is_sym(lhs)) {
        if (is_sym(rhs)) {
            if ($.treatAsVector(lhs) && $.treatAsVector(rhs)) {
                return SIGN_EQ;
            }
            return compare_sym_sym(lhs, rhs);
        }
        else {
            throw new Error(`lhs: Sym = ${lhs}, rhs = ${print_expr(rhs, $)} ${group(rhs)}`);
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
    else {
        throw new Error(`lhs = ${print_expr(lhs, $)}, rhs = ${print_expr(rhs, $)}`);
    }
}