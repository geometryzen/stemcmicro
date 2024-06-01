import { create_int, is_tensor, Tensor, zero } from "@stemcmicro/atoms";
import { Cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { halt } from "../../runtime/defs";
import { cadr } from "../../tree/helpers";

// shape of tensor
export function eval_shape(p1: Cons, $: ExtensionEnv): U {
    const result = shape($.valueOf(cadr(p1)), $);
    return result;
}

function shape(M: U, $: ExtensionEnv): U {
    if (!is_tensor(M)) {
        if (!$.iszero(M)) {
            halt("transpose: tensor expected, 1st arg is not a tensor");
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
