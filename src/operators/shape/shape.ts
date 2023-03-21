import { ExtensionEnv } from '../../env/ExtensionEnv';
import { halt } from '../../runtime/defs';
import { cadr } from '../../tree/helpers';
import { create_int, zero } from '../../tree/rat/Rat';
import { Tensor } from '../../tree/tensor/Tensor';
import { U } from '../../tree/tree';
import { is_tensor } from '../tensor/is_tensor';

// shape of tensor
export function Eval_shape(p1: U, $: ExtensionEnv): U {
    const result = shape($.valueOf(cadr(p1)), $);
    return result;
}

function shape(M: U, $: ExtensionEnv): U {
    if (!is_tensor(M)) {
        if (!$.iszero(M)) {
            halt('transpose: tensor expected, 1st arg is not a tensor');
        }
        return zero;
    }

    const { ndim: rank } = M;

    const elems = new Array<U>(rank);

    const dims = [rank];
    for (let i = 0; i < rank; i++) {
        elems[i] = create_int(M.dim(i));
    }

    return new Tensor(dims, elems);
}
