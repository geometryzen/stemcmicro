import { Sign } from "../../env/ExtensionEnv";
import { is_sym } from "../../operators/sym/is_sym";
import { is_nil, U } from "../../tree/tree";
import { compare_sym_sym } from "./compare_sym_sym";

export function compare_opr_opr(lhs: U, rhs: U): Sign {
    if (is_sym(lhs)) {
        if (is_sym(rhs)) {
            return compare_sym_sym(lhs, rhs);
        }
        else if (is_nil(rhs)) {
            // Sym, NIL
            throw new Error();
        }
        else {
            throw new Error();
        }
    }
    else if (is_nil(lhs)) {
        if (is_sym(rhs)) {
            // NIL, Sym
            throw new Error();
        }
        else if (is_nil(rhs)) {
            throw new Error();
        }
        else {
            throw new Error();
        }
    }
    else {
        throw new Error();
    }
}