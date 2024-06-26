import { is_add } from "@stemcmicro/helpers";
import { U } from "@stemcmicro/tree";
import { ExtensionEnv, TFLAGS } from "../../env/ExtensionEnv";
import { cosine_of_angle } from "./cosine_of_angle";
import { cosine_of_angle_sum } from "./cosine_of_angle_sum";

export function transform_cos(x: U, origExpr: U, $: ExtensionEnv): [TFLAGS, U] {
    if (is_add(x)) {
        return cosine_of_angle_sum(x, origExpr, $);
    }
    return cosine_of_angle(x, origExpr, $);
}
