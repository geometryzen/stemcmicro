import { is_native_sym } from "math-expression-native";
import { is_nil, U } from "math-expression-tree";
import { Sym } from "../tree/sym/Sym";
import { ScriptVars } from "./eigenmath";

export function make_should_annotate(scope: ScriptVars) {
    return function should_annotate_symbol(x: Sym, value: U): boolean {
        if (scope.hasUserFunction(x)) {
            if (x.equals(value) || is_nil(value)) {
                return false;
            }
            /*
            if (x.equals(I_LOWER) && isimaginaryunit(value))
                return false;
    
            if (x.equals(J_LOWER) && isimaginaryunit(value))
                return false;
            */

            return true;
        }
        else {
            if (is_native_sym(x)) {
                return false;
            }
            else {
                return true;
            }
        }
    };
}
