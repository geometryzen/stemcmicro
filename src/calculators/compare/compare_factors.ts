import { ExtensionEnv, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { is_blade } from "../../operators/blade/BladeExtension";
import { is_mul_2_any_any } from "../../operators/mul/is_mul_2_any_any";
import { is_mul_2_num_any } from "../../operators/mul/is_mul_2_num_any";
import { is_sym } from "../../operators/sym/is_sym";
import { is_imu } from "../../predicates/is_imu";
import { is_flt } from "../../tree/flt/is_flt";
import { is_rat } from "../../tree/rat/is_rat";
import { is_cons, U } from "../../tree/tree";
import { is_uom } from "../../tree/uom/is_uom";
import { factorizeL } from "../factorizeL";
import { compare } from "./compare";
import { compare_sym_sym } from "./compare_sym_sym";

const GROUP_NUM = 0;
const GROUP_SYM = 2;
const GROUP_CONS = 3;
const GROUP_IMU = 4;
const GROUP_BLADE = 5;
const GROUP_UOM = 6;
type GROUP = typeof GROUP_NUM | typeof GROUP_SYM | typeof GROUP_CONS | typeof GROUP_BLADE | typeof GROUP_IMU | typeof GROUP_UOM;

function group(expr: U): GROUP {
    if (is_rat(expr)) {
        return GROUP_NUM;
    }
    if (is_flt(expr)) {
        return GROUP_NUM;
    }
    if (is_sym(expr)) {
        return GROUP_SYM;
    }
    if (is_cons(expr)) {
        // Note that we have to check for the imaginary unit before declaring general Cons because i = (power -1 1/2)
        // We don't wany the group to be determined by Numeric factors.
        // But we will have to navigate through possible associations on the LHS.
        // This solution is probably naive.
        if (is_mul_2_num_any(expr)) {
            return group(expr.rhs);
        }
        if (is_imu(expr)) {
            return GROUP_IMU;
        }
        return GROUP_CONS;
    }
    if (is_blade(expr)) {
        return GROUP_BLADE;
    }
    if (is_uom(expr)) {
        return GROUP_UOM;
    }
    throw new Error(`group() of ${expr}`);
}

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
    // We are led to believe that lhs and rhs have the same group, byt we must be careful
    // console.log(`compare_factors lhs=${print_expr(lhs, $)} rhs=${print_expr(rhs, $)}`);
    if (is_sym(lhs)) {
        if (is_sym(rhs)) {
            if ($.treatAsVector(lhs) && $.treatAsVector(rhs)) {
                return SIGN_EQ;
            }
            return compare_sym_sym(lhs, rhs);
        }
        else {
            throw new Error(`lhs: Sym = ${lhs}, rhs = ${rhs}`);
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
    else {
        throw new Error(`lhs = ${lhs}, rhs = ${rhs}`);
    }
}