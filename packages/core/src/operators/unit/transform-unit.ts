// always returns a matrix with rank 2
// i.e. two dimensions,

import { one, Sym, Tensor, zero } from "@stemcmicro/atoms";
import { Cons, Cons1, U } from "@stemcmicro/tree";
import { ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { evaluate_integer } from "../../scripting/evaluate_integer";
import { cadr } from "../../tree/helpers";
import { create_tensor_elements_diagonal } from "../../tree/tensor/create_tensor_elements";

export function eval_unit(expr: Cons, $: ExtensionEnv): U {
    const n = evaluate_integer(cadr(expr), $);

    if (isNaN(n)) {
        return expr;
    }

    if (n < 1) {
        return expr;
    }

    const sizes = [n, n];
    const elems = create_tensor_elements_diagonal(n, one, zero);
    const I = new Tensor(sizes, elems);

    return I;
}

export function unit(arg: U, expr: Cons1<Sym, U>, $: ExtensionEnv): [TFLAGS, U] {
    const n = evaluate_integer(cadr(expr), $);

    if (isNaN(n)) {
        return [TFLAG_NONE, expr];
    }

    if (n < 1) {
        return [TFLAG_NONE, expr];
    }

    const sizes = [n, n];
    const elems = create_tensor_elements_diagonal(n, one, zero);
    const I = new Tensor(sizes, elems);

    return [TFLAG_DIFF, I];
}
