import { complex_conjugate } from "../../complex_conjugate";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_TENSOR, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { half } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Tensor } from "../../tree/tensor/Tensor";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { simplify } from "../simplify/simplify";
import { is_tensor } from "../tensor/is_tensor";
import { wrap_as_transform } from "../wrap_as_transform";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

export abstract class FunctionTensor extends Function1<Tensor> {
    readonly hash: string;
    constructor(opr: Sym, $: ExtensionEnv) {
        super(`${opr.text}_${HASH_TENSOR}`, opr, is_tensor, $);
        this.hash = hash_unaop_atom(this.opr, HASH_TENSOR);
    }
}

class Op extends FunctionTensor {
    constructor($: ExtensionEnv) {
        super(native_sym(Native.abs), $);
    }
    transform1(opr: Sym, arg: Tensor, expr: UCons<Sym, Tensor>): [TFLAGS, U] {
        return wrap_as_transform(abs_of_tensor(arg, this.$), expr);
    }
}

// also called the "norm" of a vector
export function abs_of_tensor(M: Tensor, $: ExtensionEnv): U {
    if (M.ndim !== 1) {
        throw new Error('abs(tensor) with tensor rank > 1');
    }
    // 
    const K = simplify(M, $);
    // TODO: We need to be careful here. The conjugate operation really belongs inside the inner operation for tensors.
    return $.valueOf(simplify($.power($.inner(K, complex_conjugate(K, $)), half), $));
}

export const abs_tensor = new Builder();
