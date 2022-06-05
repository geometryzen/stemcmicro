import { Tensor } from "../../tree/tensor/Tensor";
import { U } from "../../tree/tree";

export function is_tensor(p: U): p is Tensor {
    return p instanceof Tensor;
}
