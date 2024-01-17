import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_TENSOR, hash_unaop_atom } from "../../hashing/hash_info";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { Tensor } from "../../tree/tensor/Tensor";
import { Cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { is_tensor } from "../tensor/is_tensor";
import { TYPE_NAME_TENSOR } from "../tensor/TYPE_NAME_TENSOR";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function1<Tensor> implements Operator<Cons> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = [];
    constructor($: ExtensionEnv) {
        super('typeof_tensor', create_sym('typeof'), is_tensor, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_TENSOR);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Tensor<U>, expr: UCons<Sym, Tensor<U>>): [TFLAGS, U] {
        return [TFLAG_DIFF, TYPE_NAME_TENSOR];
    }
}

export const typeof_tensor = new Builder();
