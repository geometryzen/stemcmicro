import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { is_tensor } from "../../tree/tensor/is_tensor";
import { Tensor } from "../../tree/tensor/Tensor";
import { Cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { TYPE_NAME_TENSOR } from "../tensor/TYPE_NAME_TENSOR";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new TypeofAny($);
    }
}

class TypeofAny extends Function1<Tensor> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('typeof_mat', new Sym('typeof'), is_tensor, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Tensor<U>, expr: UCons<Sym, Tensor<U>>): [TFLAGS, U] {
        return [CHANGED, TYPE_NAME_TENSOR];
    }
}

export const typeof_mat = new Builder();
