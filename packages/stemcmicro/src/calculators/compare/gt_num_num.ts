import { Num } from "math-expression-atoms";
import { SIGN_GT } from "../../env/ExtensionEnv";
import { compare_num_num } from "./compare_num_num";

export function gt_num_num(lhs: Num, rhs: Num): boolean {
    return compare_num_num(lhs, rhs) === SIGN_GT;
}
