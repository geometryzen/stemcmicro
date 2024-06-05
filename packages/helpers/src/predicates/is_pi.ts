import { is_sym, Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";

const MATH_PI = native_sym(Native.PI);

export function is_pi(expr: U): expr is Sym & { _type: "" } {
    if (is_sym(expr)) {
        return MATH_PI.equalsSym(expr);
    } else {
        return false;
    }
}
