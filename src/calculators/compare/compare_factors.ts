import { ExtensionEnv, Sign, SIGN_EQ } from "../../env/ExtensionEnv";
import { is_sym } from "../../operators/sym/is_sym";
import { U } from "../../tree/tree";
import { compare_sym_sym } from "./compare_sym_sym";

export function compare_factors(lhs: U, rhs: U, $: ExtensionEnv): Sign {
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
    else {
        throw new Error(`lhs = ${lhs}, rhs = ${rhs}`);
    }
}