import { ExtensionEnv, TFLAGS } from "../../env/ExtensionEnv";
import { is_cons, U } from "../../tree/tree";
import { is_add } from '../add/is_add';
import { cosine_of_angle } from './cosine_of_angle';
import { cosine_of_angle_sum } from './cosine_of_angle_sum';

export function transform_cos(x: U, origExpr: U, $: ExtensionEnv): [TFLAGS, U] {
    if (is_cons(x) && is_add(x)) {
        return cosine_of_angle_sum(x, origExpr, $);
    }
    return cosine_of_angle(x, origExpr, $);
}
