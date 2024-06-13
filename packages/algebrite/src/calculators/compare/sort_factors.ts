import { Native, native_sym } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";

/**
 * Sorts an array of factors while respecting whether the factors are scalars (can they commute?).
 * @param factors The unsorted array of factors. WARNING: This array may be reordered in future implementations.
 * @param $
 * @returns A new array containing the sorted factors.
 */
export function sort_factors(factors: U[], $: Pick<ExtensionEnv, "compareFn" | "isscalar">): U[] {
    const sortable = factors.map(function (value, index) {
        return { value, index };
    });
    sortable.sort(function (x, y) {
        const x_comp_y = $.compareFn(native_sym(Native.multiply))(x.value, y.value);
        // If either side is a scalar then we are allowed to take the canonical reordering as is.
        if ($.isscalar(x.value) || $.isscalar(y.value)) {
            return x_comp_y;
        } else {
            // If neither are scalars then keep the order stable by sorting based on original index.
            return x.index - y.index;
        }
    });
    // TODO: It's tempting to copy
    const sorted = sortable.map(function (elem) {
        return elem.value;
    });
    return sorted;
}
