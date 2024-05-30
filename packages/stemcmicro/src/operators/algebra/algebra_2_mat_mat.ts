import { assert_tensor, create_sym, is_tensor, Sym, Tensor } from "@stemcmicro/atoms";
import { Cons, U } from "@stemcmicro/tree";
import { Extension, ExtensionBuilder, ExtensionEnv, FEATURE, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_TENSOR } from "../../hashing/hash_info";
import { Function2 } from "../helpers/Function2";
import { algebra } from "./algebra";

class Builder implements ExtensionBuilder<U> {
    create(): Extension<U> {
        return new Op();
    }
}
/**
 * (algebra metric labels), where metric and labels are Tensor[U]
 * G = algebra([1,1,1],['e1','e2','e3'])
 * e1 = G[1]
 * e2 = G[2]
 * e3 = G[3]
 */
class Op extends Function2<Tensor, Tensor> implements Extension<Cons> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Blade"];
    constructor() {
        super("algebra_2_tensor_tensor", create_sym("algebra"), is_tensor, is_tensor);
        this.#hash = hash_binop_atom_atom(create_sym("algebra"), HASH_TENSOR, HASH_TENSOR);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: Cons, $: ExtensionEnv): U {
        const argList = expr.argList;
        try {
            const arg0 = argList.item(0);
            const arg1 = argList.item(1);
            try {
                const val0 = $.valueOf(arg0);
                const val1 = $.valueOf(arg1);
                try {
                    const metric = assert_tensor(val0);
                    const labels = assert_tensor(val1);
                    return algebra(metric, labels, $);
                } finally {
                    val0.release();
                    val1.release();
                }
            } finally {
                arg0.release();
                arg1.release();
            }
        } finally {
            argList.release();
        }
    }
    transform2(opr: Sym, metric: Tensor<U>, labels: Tensor<U>, orig: Cons, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, algebra(metric, labels, $)];
    }
}

export const algebra_2_tensor_tensor = new Builder();
