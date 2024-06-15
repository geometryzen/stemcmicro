import { Tensor } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { U } from "@stemcmicro/tree";
import { copy_tensor } from "./copy_tensor";

export function elementwise(source: Tensor, foo: (expr: U, env: ExprContext) => U, env: ExprContext): Tensor {
    const T = copy_tensor(source);
    const n = T.nelem;
    for (let i = 0; i < n; i++) {
        const element = T.elems[i];
        try {
            const value = foo(element, env);
            T.elems[i] = value;
        } finally {
            element.release();
        }
    }
    return T;
}
