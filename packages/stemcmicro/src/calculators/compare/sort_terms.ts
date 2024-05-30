import { Native, native_sym } from "math-expression-native";
import { U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";

/**
 * Sorts an array of terms. Assumes that terms can commute under addition.
 * @param terms The unsorted array of terms. WARNING: This array may be reordered in future implementations.
 * @param $
 * @returns A new array containing the sorted factors.
 */
export function sort_terms(terms: U[], $: Pick<ExtensionEnv, "compareFn">): U[] {
    // We don't use the index yet but it could be used to make the sort stable (see corresponding factors code).
    const sortable = terms.map(function (value, index) {
        return { value, index };
    });
    const compareFn = $.compareFn(native_sym(Native.add));
    sortable.sort(function (x, y) {
        return compareFn(x.value, y.value);
    });
    const sorted = sortable.map(function (elem) {
        return elem.value;
    });
    // console.lg(`sort_terms(${items_to_infix(terms, $)}) => ${items_to_infix(sorted, $)}`);
    return sorted;
}
