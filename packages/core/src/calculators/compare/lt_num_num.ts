import { Num } from "@stemcmicro/atoms";
import { SIGN_LT } from "../../env/ExtensionEnv";
import { compare_num_num } from "./compare_num_num";

export function lt_num_num(lhs: Num, rhs: Num): boolean {
    return compare_num_num(lhs, rhs) === SIGN_LT;
}
