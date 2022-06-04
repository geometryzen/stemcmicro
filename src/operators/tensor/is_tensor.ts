import { Tensor } from "../../tree/tensor/Tensor";

export function is_tensor(p: unknown): p is Tensor {
    return p instanceof Tensor;
}
