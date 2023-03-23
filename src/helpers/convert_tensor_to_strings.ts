import { U } from "../tree/tree";
import { is_str } from "../operators/str/is_str";
import { is_tensor } from "../operators/tensor/is_tensor";

/**
 * Converts the tensor of Str values to a JavaScript native array of strings.
 */
export function convert_tensor_to_strings(tensor: U): string[] {
    if (is_tensor(tensor)) {
        return tensor.mapElements(function (element) {
            if (is_str(element)) {
                return element.str;
            }
            else {
                throw new Error("must be a string.");
            }
        });
    }
    else {
        throw new Error("must be a tensor.");
    }
}
