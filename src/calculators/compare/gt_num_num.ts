import { SIGN_GT } from "../../env/ExtensionEnv";
import { Num } from "../../tree/num/Num";
import { compare_num_num } from "./compare_num_num";

export function gt_num_num(lhs: Num, rhs: Num): boolean {
    return compare_num_num(lhs, rhs) === SIGN_GT;
}
