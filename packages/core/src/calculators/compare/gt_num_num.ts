import { Num } from "@stemcmicro/atoms";
import { compare_num_num } from "@stemcmicro/helpers";
import { SIGN_GT } from "../../env/ExtensionEnv";

export function gt_num_num(lhs: Num, rhs: Num): boolean {
    return compare_num_num(lhs, rhs) === SIGN_GT;
}
