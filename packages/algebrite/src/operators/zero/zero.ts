import { create_tensor_elements, Tensor, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Cons, U } from "@stemcmicro/tree";
import { MAXDIM } from "../../runtime/constants";
import { evaluate_integer } from "../../scripting/evaluate_integer";

export function eval_zero(expr: Cons, $: ExprContext): U {
    const k: number[] = Array(MAXDIM).fill(0);

    let m = 1;
    let ndim = 0;
    for (const x of expr.tail()) {
        const i = evaluate_integer(x, $);
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
