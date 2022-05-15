import { Tensor } from "./Tensor";

export function is_tensor(p: unknown): p is Tensor {
    return p instanceof Tensor;
}
