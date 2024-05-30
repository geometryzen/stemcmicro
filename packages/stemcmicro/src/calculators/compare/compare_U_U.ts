import { is_blade, is_flt, is_rat, is_sym } from "math-expression-atoms";
import { Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { is_hyp } from "../../operators/hyp/is_hyp";
import { is_imu } from "../../operators/imu/is_imu";
import { is_inner_2_any_any } from "../../operators/inner/is_inner_2_any_any";
import { is_mul_2_any_any } from "../../operators/mul/is_mul_2_any_any";
import { is_outer_2_any_any } from "../../operators/outer/is_outer_2_any_any";
import { is_pow_2_any_any } from "../../operators/pow/is_pow_2_any_any";
import { is_cons, U } from "../../tree/tree";
import { compare_factorizable } from "./compare_factorizable";
import { compare_opr_opr } from "./compare_opr_opr";
import { compare_sym_sym } from "./compare_sym_sym";
import { group } from "./group";
import { has_imu_factor } from "./has_imu_factor";

/**
 * The order of operations is currently |,^,*
 * @param lhs
 * @param rhs
 * @returns
 */
export function compare_U_U(lhs: U, rhs: U): Sign {
    // console.lg("compare_U_U", `${lhs}`, `${rhs}`);
    if (lhs.equals(rhs)) {
        return SIGN_EQ;
    }
    if (is_cons(lhs)) {
        if (is_mul_2_any_any(lhs)) {
            if (is_cons(rhs)) {
                if (is_mul_2_any_any(rhs)) {
                    return compare_factorizable(lhs, rhs);
                } else if (is_inner_2_any_any(rhs)) {
                    return compare_opr_opr(lhs.car, rhs.car);
                } else {
                    return compare_opr_opr(lhs.car, rhs.car);
                }
            } else if (is_rat(rhs)) {
                return SIGN_GT;
            } else if (is_sym(rhs)) {
                // Ordering really depends on what the symbol is, how it compares to the other expression.
                return SIGN_EQ;
            } else {
                throw new Error(`lhs: Multiply = ${lhs}, rhs = ${rhs}`);
            }
        }
        if (is_pow_2_any_any(lhs)) {
            if (is_cons(rhs)) {
                if (is_mul_2_any_any(rhs)) {
                    return compare_factorizable(lhs, rhs);
                }
                if (is_pow_2_any_any(rhs)) {
                    return compare_factorizable(lhs, rhs);
                }
                if (is_inner_2_any_any(rhs)) {
                    return SIGN_GT;
                } else {
                    return SIGN_EQ;
                    // throw new Error(`lhs: Power = ${lhs}, rhs: Cons = ${rhs}`);
                }
            }
            if (is_sym(rhs)) {
                return SIGN_GT;
            } else {
                throw new Error(`lhs: Power = ${lhs}, rhs = ${rhs}`);
            }
        }
        if (is_inner_2_any_any(lhs)) {
            if (is_cons(rhs)) {
                if (is_mul_2_any_any(rhs)) {
                    return SIGN_LT;
                } else if (is_outer_2_any_any(rhs)) {
                    return SIGN_LT;
                } else if (is_inner_2_any_any(rhs)) {
                    return SIGN_EQ;
                } else if (is_pow_2_any_any(rhs)) {
                    return SIGN_LT;
                } else if (is_flt(rhs)) {
                    throw new Error(`lhs: Inner = ${lhs}, rhs: Flt = ${rhs}`);
                } else {
                    throw new Error(`lhs: Inner = ${lhs}, rhs: Cons = ${rhs}`);
                }
            } else {
                return SIGN_EQ;
            }
        }
        if (is_outer_2_any_any(lhs)) {
            if (is_cons(rhs)) {
                if (is_inner_2_any_any(rhs)) {
                    return SIGN_GT;
                } else {
                    throw new Error(`lhs: Outer = ${lhs}, rhs: Cons = ${rhs}`);
                }
            }
            if (is_rat(rhs)) {
                return SIGN_GT;
            } else {
                throw new Error(`lhs: Outer = ${lhs}, rhs = ${rhs}`);
            }
        } else {
            if (is_cons(rhs)) {
                return compare_U_U(lhs.opr, rhs.opr);
            } else if (is_sym(rhs)) {
                return SIGN_GT;
            } else {
                throw new Error(`lhs: Cons = ${lhs}, rhs = ${rhs}`);
            }
        }
    } else if (is_rat(lhs)) {
        if (is_cons(rhs)) {
            if (is_outer_2_any_any(rhs)) {
                return SIGN_LT;
            }
            if (is_mul_2_any_any(rhs)) {
                return SIGN_LT;
            }
        }
        if (is_rat(rhs)) {
            return lhs.compare(rhs);
        }
        if (is_sym(rhs)) {
            return SIGN_LT;
        } else {
            throw new Error(`lhs: Rat = ${lhs}, rhs = ${rhs}`);
        }
    } else if (is_flt(lhs)) {
        if (is_cons(rhs)) {
            return SIGN_LT;
        } else if (is_flt(rhs)) {
            return lhs.compare(rhs);
        } else {
            throw new Error(`lhs: Flt = ${lhs}, rhs = ${rhs}`);
        }
    } else if (is_sym(lhs)) {
        if (is_rat(rhs)) {
            return SIGN_GT;
        } else if (is_sym(rhs)) {
            return compare_sym_sym(lhs, rhs);
        } else if (is_hyp(rhs)) {
            return SIGN_LT;
        } else if (is_blade(rhs)) {
            return SIGN_LT;
        } else if (is_cons(rhs)) {
            if (is_mul_2_any_any(rhs)) {
                if (has_imu_factor(rhs)) {
                    return SIGN_LT;
                }
                return SIGN_LT;
            } else if (is_pow_2_any_any(rhs)) {
                if (is_imu(rhs)) {
                    return SIGN_LT;
                } else {
                    throw new Error(`lhs: Sym = ${lhs}, rhs: Power = ${rhs}`);
                }
            } else {
                return SIGN_LT;
            }
        } else {
            throw new Error(`lhs: Sym = ${lhs}, rhs = ${rhs}`);
        }
    } else if (is_hyp(lhs)) {
        if (is_sym(rhs)) {
            return SIGN_GT;
        } else {
            throw new Error(`lhs: Hyp = ${lhs}, rhs = ${rhs} group(rhs)=${group(rhs)}`);
        }
    } else {
        throw new Error(`lhs = ${lhs}, rhs = ${rhs}`);
    }
}
