import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_TENSOR } from "../../hashing/hash_info";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { Tensor } from "../../tree/tensor/Tensor";
import { U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";
import { is_tensor } from "../tensor/is_tensor";
import { algebra } from "./algebra";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * G = algebra([1,1,1],['e1','e2','e3'])
 * e1 = G[1]
 * e2 = G[2]
 * e3 = G[3]
 */
class Op extends Function2<Tensor, Tensor> implements Operator<U> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ['Blade'];
    constructor($: ExtensionEnv) {
        super('algebra_2_tensor_tensor', create_sym('algebra'), is_tensor, is_tensor, $);
        this.#hash = hash_binop_atom_atom(create_sym('algebra'), HASH_TENSOR, HASH_TENSOR);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, metric: Tensor<U>, labels: Tensor<U>): [TFLAGS, U] {
        return [TFLAG_DIFF, algebra(metric, labels, this.$)];
    }
}

export const algebra_2_tensor_tensor = new Builder();
