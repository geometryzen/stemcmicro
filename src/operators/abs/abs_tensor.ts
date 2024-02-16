import { complex_conjugate } from "../../complex_conjugate";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionBuilder, ExtensionEnv, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_TENSOR, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { half } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Tensor } from "../../tree/tensor/Tensor";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { simplify } from "../simplify/simplify";
import { is_tensor } from "../tensor/is_tensor";
import { wrap_as_transform } from "../wrap_as_transform";

class Builder implements ExtensionBuilder<U> {
    create(config: Readonly<EnvConfig>): Extension<U> {
        return new Op(config);
    }
}

export abstract class FunctionTensor extends Function1<Tensor> {
    readonly #hash: string;
    constructor(opr: Sym, readonly config: Readonly<EnvConfig>) {
        super(`${opr.key()}_${HASH_TENSOR}`, opr, is_tensor);
        this.#hash = hash_unaop_atom(this.opr, HASH_TENSOR);
    }
    get hash(): string {
        return this.#hash;
    }
}

class Op extends FunctionTensor {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(native_sym(Native.abs), config);
    }
    transform1(opr: Sym, arg: Tensor, expr: Cons1<Sym, Tensor>, $: ExtensionEnv): [TFLAGS, U] {
        return wrap_as_transform(abs_of_tensor(arg, $), expr);
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
