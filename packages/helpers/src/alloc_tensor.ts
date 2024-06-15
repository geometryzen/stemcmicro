import { Tensor } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

export function alloc_tensor<T extends U>(): Tensor<T> {
    return new Tensor<T>([], []);
}
