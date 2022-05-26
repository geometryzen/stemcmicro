import { ExtensionEnv } from '../../env/ExtensionEnv';
import { cadr } from '../../tree/helpers';
import { is_cons, U } from '../../tree/tree';
import { is_add } from '../add/is_add';
import { cosine_of_angle } from './cosine_of_angle';
import { cosine_of_angle_sum } from './cosine_of_angle_sum';

export function Eval_cos(p1: U, $: ExtensionEnv) {
    return cosine($.valueOf(cadr(p1)), $);
}

export function cosine(x: U, $: ExtensionEnv): U {
    if (is_cons(x) && is_add(x)) {
        return cosine_of_angle_sum(x, $);
    }
    else {
        return cosine_of_angle(x, $);
    }
}
