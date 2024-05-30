import { is_blade, is_hyp, is_num, is_str, is_sym, is_tensor, is_uom } from "math-expression-atoms";
import { car, cdr, is_cons, is_nil, U } from "math-expression-tree";
import { ExprComparator, ExtensionEnv, Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "../../env/ExtensionEnv";
import { is_imu } from "../../operators/imu/is_imu";
import { strcmp } from "../../operators/str/str_extension";
import { is_power } from "../../runtime/helpers";
import { compare_expr_expr } from "./compare_expr_expr";
import { compare_num_num } from "./compare_num_num";
import { compare_sym_sym } from "./compare_sym_sym";
import { compare_tensors } from "./compare_tensors";

export class MulComparator implements ExprComparator {
    compare(lhs: U, rhs: U, $: ExtensionEnv): Sign {
        // console.lg("compare_factor_factor", $.toInfixString(lhs), $.toInfixString(rhs));

        // We have to treat (pow base expo) as a special case because of the ambiguity in representing a symbol.
        // i.e. sym is the same as (pow sym expo).
        // So we have to order power expressions according to the base.

        // Under multiplication, we don't want strings to be sorted because they don't commute.
        // This makes more sense for addition, but why order them under multiplication?
        // Perhaps the only thing that doesn't commute under addition?
        // This will likely mess with the use of strings as units of measure.
        if (is_str(lhs) && is_str(rhs)) {
            return SIGN_EQ;
        }

        if (is_power(lhs)) {
            const base = lhs.base;
            return this.compare(base, rhs, $);
        }
        if (is_power(rhs)) {
            const base = rhs.base;
            return this.compare(lhs, base, $);
        }

        if (lhs === rhs || lhs.equals(rhs)) {
            return SIGN_EQ;
        }

        if (is_nil(lhs) && is_nil(rhs)) {
            return SIGN_EQ;
        }

        if (is_nil(lhs)) {
            return SIGN_LT;
        }

        if (is_nil(rhs)) {
            return SIGN_GT;
        }

        if (is_num(lhs) && is_num(rhs)) {
            return compare_num_num(lhs, rhs);
        }

        if (is_num(lhs)) {
            return SIGN_LT;
        }

        if (is_num(rhs)) {
            return SIGN_GT;
        }

        if (is_imu(lhs) && is_imu(rhs)) {
            return SIGN_EQ;
        }

        if (is_imu(lhs)) {
            return SIGN_LT;
        }

        if (is_imu(rhs)) {
            return SIGN_GT;
        }

        if (is_sym(lhs) && is_sym(rhs)) {
            return compare_sym_sym(lhs, rhs);
        }

        if (is_sym(lhs)) {
            return SIGN_LT;
        }

        if (is_sym(rhs)) {
            return SIGN_GT;
        }

        if (is_tensor(lhs) && is_tensor(rhs)) {
            return compare_tensors(lhs, rhs);
        }

        if (is_tensor(lhs)) {
            return SIGN_LT;
        }

        if (is_tensor(rhs)) {
            return SIGN_GT;
        }

        while (is_cons(lhs) && is_cons(rhs)) {
            const n = compare_expr_expr(car(lhs), car(rhs));
            if (n !== SIGN_EQ) {
                return n;
            }
            lhs = cdr(lhs);
            rhs = cdr(rhs);
        }

        if (is_cons(lhs)) {
            return SIGN_LT;
        }

        if (is_cons(rhs)) {
            return SIGN_GT;
        }

        if (is_hyp(lhs) && is_hyp(rhs)) {
            // Will probably order base on symbols in future.
            return strcmp(lhs.printname, rhs.printname);
        }

        if (is_hyp(lhs)) {
            return SIGN_LT;
        }

        if (is_hyp(rhs)) {
            return SIGN_GT;
        }

        if (is_blade(lhs) && is_blade(rhs)) {
            // In general, blades do not commute under multiplication.
            return SIGN_EQ;
        }

        if (is_blade(lhs)) {
            return SIGN_LT;
        }

        if (is_blade(rhs)) {
            return SIGN_GT;
        }

        if (is_str(lhs)) {
            if (is_str(rhs)) {
                return strcmp(lhs.str, rhs.str);
            } else {
                return SIGN_LT;
            }
        } else if (is_str(rhs)) {
            return SIGN_GT;
        }

        if (is_uom(lhs) && is_uom(rhs)) {
            return SIGN_EQ;
        }

        if (is_uom(lhs)) {
            return SIGN_LT;
        }

        if (is_uom(rhs)) {
            return SIGN_GT;
        }

        return SIGN_EQ;
    }
}
