import { Sym } from "@stemcmicro/atoms";
import { is_native_sym } from "@stemcmicro/native";
import { ProgramEnv } from "@stemcmicro/stack";
import { is_nil, U } from "@stemcmicro/tree";

export function make_should_annotate(env: ProgramEnv) {
    return function should_annotate_symbol(x: Sym, value: U): boolean {
        if (env.hasUserFunction(x)) {
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
        } else {
            if (is_native_sym(x)) {
                return false;
            } else {
                return true;
            }
        }
    };
}
