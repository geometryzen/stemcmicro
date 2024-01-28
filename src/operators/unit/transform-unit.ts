
// always returns a matrix with rank 2
// i.e. two dimensions,

import { ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { evaluate_integer } from "../../scripting/evaluate_integer";
import { cadr } from "../../tree/helpers";
import { one, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { create_tensor_elements_diagonal } from "../../tree/tensor/create_tensor_elements";
import { Tensor } from "../../tree/tensor/Tensor";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";

// the passed parameter is the size
export function Eval_unit(expr: Cons1<Sym, U>, $: ExtensionEnv): U {
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
