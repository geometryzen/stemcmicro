import { Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { is_add_2_any_any } from "../../operators/add/is_add_2_any_any";
import { compare_blade_blade, is_blade } from "../../operators/blade/BladeExtension";
import { is_inner_2_any_any } from "../../operators/inner/is_inner_2_any_any";
import { is_mul_2_any_any } from "../../operators/mul/is_mul_2_any_any";
import { is_mul_2_blade_rat } from "../../operators/mul/is_mul_2_blade_rat";
import { is_outer_2_any_any } from "../../operators/outer/is_outer_2_any_any";
import { is_pow_2_any_any } from "../../operators/pow/is_pow_2_any_any";
import { is_rat } from "../../operators/rat/RatExtension";
import { is_sym } from "../../operators/sym/is_sym";
import { is_num } from "../../predicates/is_num";
import { is_flt } from "../../tree/flt/is_flt";
import { is_cons, U } from "../../tree/tree";
import { is_uom } from "../../tree/uom/is_uom";
import { factorizeL } from "../factorizeL";
import { compare_factorizable } from "./compare_factorizable";
import { compare_opr_opr } from "./compare_opr_opr";
import { compare_sym_sym } from "./compare_sym_sym";
import { has_imu_factor } from "./has_imu_factor";

export function compare_terms(lhs: U, rhs: U): Sign {
    // console.log(`compare_terms ${lhs} ${rhs}`);
    // Numeric factors in lhs term have no effect on ordering.
    if (is_cons(lhs) && is_mul_2_any_any(lhs)) {
        const [a, b] = factorizeL(lhs);
        if (is_rat(a)) {
            return compare_terms(b, rhs);
        }
    }
    // Numeric factors in rhs term have no effect on ordering.
    if (is_cons(rhs) && is_mul_2_any_any(rhs)) {
        const [a, b] = factorizeL(rhs);
        if (is_rat(a)) {
            return compare_terms(lhs, b);
        }
    }

    if (is_cons(lhs)) {
        if (is_add_2_any_any(lhs)) {
            if (is_cons(rhs)) {
                if (is_add_2_any_any(rhs)) {
                    return SIGN_EQ;
                }
                if (is_mul_2_any_any(rhs)) {
                    return SIGN_LT;
                }
                if (is_pow_2_any_any(rhs)) {
                    return SIGN_LT;
                }
                else {
                    return compare_opr_opr(lhs.car, rhs.car);
                }
            }
            if (is_flt(rhs)) {
                return SIGN_EQ;
            }
            if (is_sym(rhs)) {
                return SIGN_EQ;
            }
            if (is_blade(rhs)) {
                // We could have (j+k)+i.
                // add_2_canonical_ordering can't deal with it but the association version can.
                return SIGN_EQ;
            }
            else {
                throw new Error(`lhs: Add = ${lhs}, rhs = ${rhs}`);
            }
        }
        else if (is_mul_2_any_any(lhs)) {
            if (is_cons(rhs)) {
                if (is_add_2_any_any(rhs)) {
                    return SIGN_EQ;
                }
                else if (is_mul_2_any_any(rhs)) {
                    return compare_factorizable(lhs, rhs);
                }
                else if (is_pow_2_any_any(rhs)) {
                    return compare_factorizable(lhs, rhs);
                }
                else if (is_outer_2_any_any(rhs)) {
                    return SIGN_EQ;
                }
                else {
                    return compare_opr_opr(lhs.car, rhs.car);
                }
            }
            else if (is_num(rhs)) {
                return SIGN_GT;
            }
            else if (is_sym(rhs)) {
                // TODO: Must be a conflict somewhere because it loops with SIGN_GT.
                return SIGN_LT;
            }
            else {
                throw new Error(`lhs: Multiply = ${lhs}, rhs = ${rhs}`);
            }
        }
        else if (is_pow_2_any_any(lhs)) {
            if (is_cons(rhs)) {
                if (is_add_2_any_any(rhs)) {
                    return SIGN_EQ;
                }
                else if (is_mul_2_any_any(rhs)) {
                    return compare_factorizable(lhs, rhs);
                }
                else if (is_pow_2_any_any(rhs)) {
                    return compare_factorizable(lhs, rhs);
                }
                else {
                    return compare_opr_opr(lhs.car, rhs.car);
                }
            }
            else if (is_num(rhs)) {
                return SIGN_GT;
            }
            else {
                throw new Error(`lhs: Power = ${lhs}, rhs = ${rhs}`);
            }
        }
        else if (is_inner_2_any_any(lhs)) {
            if (is_cons(rhs)) {
                if (is_mul_2_any_any(rhs)) {
                    return compare_opr_opr(lhs.car, rhs.car);
                }
                else if (is_outer_2_any_any(rhs)) {
                    return SIGN_LT;
                }
                else {
                    return SIGN_EQ;
                }
            }
            else {
                return SIGN_EQ;
            }
        }
        else if (is_outer_2_any_any(lhs)) {
            if (is_cons(rhs)) {
                if (is_inner_2_any_any(rhs)) {
                    return SIGN_GT;
                }
                else {
                    return compare_opr_opr(lhs.car, rhs.car);
                }
            }
            else {
                throw new Error(`lhs: Outer = ${lhs}, rhs = ${rhs}`);
            }
        }
        else {
            if (is_cons(rhs)) {
                // Suppose we have the situation of two identical functions, but called with different arguments.
                // How could we delegate this to an appropriate comparator?
                // What about the case of disimilar functions? Maybe we still want proximity?
                return SIGN_EQ;
                // throw new Error(`lhs: Cons = ${lhs}, rhs: Cons = ${rhs}`);
            }
            throw new Error(`lhs: Cons = ${lhs}, rhs = ${rhs}`);
        }
    }
    if (is_sym(lhs)) {
        if (is_cons(rhs)) {
            if (is_add_2_any_any(rhs)) {
                return SIGN_LT;
            }
            else if (is_mul_2_any_any(rhs)) {
                if (has_imu_factor(rhs)) {
                    return SIGN_LT;
                }
                return SIGN_EQ;
            }
            else {
                throw new Error(`lhs: Sym = ${lhs}, rhs: Cons = ${rhs}`);
            }
        }
        else if (is_sym(rhs)) {
            return compare_sym_sym(lhs, rhs);
        }
        else if (is_flt(rhs)) {
            return SIGN_GT;
        }
        else {
            throw new Error(`lhs: Sym = ${lhs}, rhs = ${rhs}`);
        }
    }
    if (is_blade(lhs)) {
        if (is_blade(rhs)) {
            return compare_blade_blade(lhs, rhs);
        }
        if (is_cons(rhs) && is_mul_2_blade_rat(rhs)) {
            return compare_blade_blade(lhs, rhs.lhs);
        }
        throw new Error(`lhs: Blade = ${lhs}, rhs = ${rhs}`);
    }
    if (is_rat(lhs)) {
        if (is_uom(rhs)) {
            return SIGN_LT;
        }
        if (is_sym(rhs)) {
            return SIGN_LT;
        }
        return SIGN_EQ;
    }
    if (is_flt(lhs)) {
        if (is_uom(rhs)) {
            return SIGN_LT;
        }
        if (is_sym(rhs)) {
            return SIGN_LT;
        }
        return SIGN_EQ;
    }
    if (is_uom(lhs)) {
        if (is_uom(rhs)) {
            return SIGN_EQ;
        }
    }
    throw new Error(`lhs = ${lhs}, rhs = ${rhs}`);
}