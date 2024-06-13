import { create_tensor_elements_diagonal, is_num, one, Rat, Tensor, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { num_to_number, prolog_eval_1_arg } from "@stemcmicro/helpers";
import { Cons, U } from "@stemcmicro/tree";

export function eval_unit(expr: Cons, $: ExprContext): U {
    return prolog_eval_1_arg(
        expr,
        (x: U) => {
            if (is_num(x)) {
                const n = num_to_number(x);
                if (isNaN(n)) {
                    return expr;
                }

                if (n < 0) {
                    expr.addRef();
                    return expr;
                }

                return unit(n);
            } else {
                expr.addRef();
                return expr;
            }
        },
        $
    );
}

function unit(n: number): Tensor<Rat> {
    const dims = [n, n];
    const elems = create_tensor_elements_diagonal(n, one, zero);
    return new Tensor(dims, elems);
}
