import { MATH_PI } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";

export function is_pi(sym: Sym): sym is Sym {
    return MATH_PI.equalsSym(sym);
}