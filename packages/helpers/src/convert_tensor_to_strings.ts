import { is_str, is_tensor } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

/**
 * Converts the tensor of Str values to a EcmaScript native array of strings.
 */
export function convert_tensor_to_strings(tensor: U): string[] {
    if (is_tensor(tensor)) {
        return tensor.mapElements(function (element) {
            if (is_str(element)) {
                return element.str;
            } else {
                throw new Error("must be a string.");
            }
        });
    } else {
        throw new Error("must be a tensor.");
    }
}
