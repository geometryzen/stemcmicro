import { is_sym } from "@stemcmicro/atoms";
import { is_nil, U } from "@stemcmicro/tree";
import { Sign } from "../../env/ExtensionEnv";
import { compare_sym_sym } from "./compare_sym_sym";

/**
 * FIXME: Needs more testing.
 */
export function compare_opr_opr(lhs: U, rhs: U): Sign {
    // console.lg("compare_opr_opr", `${lhs}`, `${rhs}`);
    if (is_sym(lhs)) {
        if (is_sym(rhs)) {
            return compare_sym_sym(lhs, rhs);
        } else if (is_nil(rhs)) {
            // Sym, NIL
            throw new Error();
        } else {
            throw new Error();
        }
    } else if (is_nil(lhs)) {
        if (is_sym(rhs)) {
            // NIL, Sym
            throw new Error();
        } else if (is_nil(rhs)) {
            throw new Error();
        } else {
            throw new Error();
        }
    } else {
        throw new Error();
    }
}
