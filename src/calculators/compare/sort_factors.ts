import { ExtensionEnv } from "../../env/ExtensionEnv";
import { U } from "../../tree/tree";
import { compare_factors } from "./compare_factors";

/**
 * Sorts an array of factors while respecting whether the factors are scalars (can they commute?).
 * @param factors The unsorted array of factors. WARNING: This array may be reordered in future implementations.
 * @param $ 
 * @returns A new array containing the sorted factors.
 */
export function sort_factors(factors: U[], $: ExtensionEnv): U[] {
    const sortable = factors.map(function (value, index) {
        return { value, index };
    });
    sortable.sort(function (x, y) {
        const x_comp_y = compare_factors(x.value, y.value, $);
        // console.lg(render_as_infix(x.value, $), "x is scalar?", $.isScalar(x.value));
        // console.lg(render_as_infix(y.value, $), "y is scalar?", $.isScalar(y.value));
        // If either side is a scalar then we are allowed to take the canonical reordering as is.
        if ($.isScalar(x.value) || $.isScalar(y.value)) {
            return x_comp_y;
        }
        else {
            // If neither are scalars then keep the order stable by sorting based on original index.
            return x.index - y.index;
        }
    });
    // TODO: It's tempting to copy
    const sorted = sortable.map(function (elem) {
        return elem.value;
    });
    // console.lg(`sort_factors(${items_to_infix(factors, $)}) => ${items_to_infix(sorted, $)}`);
    return sorted;
}