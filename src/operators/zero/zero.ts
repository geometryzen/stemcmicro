
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { MAXDIM } from '../../runtime/constants';
import { evaluate_integer } from '../../scripting/evaluate_integer';
import { zero } from '../../tree/rat/Rat';
import { create_tensor_elements } from '../../tree/tensor/create_tensor_elements';
import { Tensor } from '../../tree/tensor/Tensor';
import { Cons, U } from '../../tree/tree';

export function eval_zero(expr: Cons, $: ExtensionEnv): U {
    return create_zero_tensor(expr, $);
}

function create_zero_tensor(expr: Cons, $: ExtensionEnv): U {
    const k: number[] = Array(MAXDIM).fill(0);

    let m = 1;
    let ndim = 0;
    for (const el of expr.tail()) {
        const i = evaluate_integer(el, $);
        if (i < 1 || isNaN(i)) {
            // if the input is nonsensical just return 0
            return zero;
        }
        m *= i;
        k[ndim++] = i;
    }

    if (ndim === 0) {
        return zero;
    }
    const dsizes = new Array<number>(ndim);
    for (let i = 0; i < ndim; i++) {
        dsizes[i] = k[i];
    }
    const elems = create_tensor_elements(m, zero);
    return new Tensor(dsizes, elems);
}
