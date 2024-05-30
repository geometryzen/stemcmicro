import { HASH_BOO, HASH_STR } from "../hashing/hash_info";
import { is_boo } from "../operators/boo/is_boo";
import { is_str } from "../operators/str/is_str";
import { is_tensor } from "../operators/tensor/is_tensor";
import { U } from "../tree/tree";

/**
 * Converts the tensor of values to a EcmaScript native array of primitives.
 */
export function convert_tensor_to_primitives(tensor: U): (boolean | string)[] {
    if (is_tensor(tensor)) {
        return tensor.mapElements(function (element) {
            if (is_boo(element)) {
                return element.isTrue();
            } else if (is_str(element)) {
                return element.str;
            } else {
                throw new Error(`must be a ${HASH_BOO} or ${HASH_STR}.`);
            }
        });
    } else {
        throw new Error("must be a tensor.");
    }
}
