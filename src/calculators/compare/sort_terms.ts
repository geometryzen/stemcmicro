import { ExtensionEnv } from "../../env/ExtensionEnv";
import { U } from "../../tree/tree";
import { compare_terms_redux } from "./compare_terms";

/**
 * Sorts an array of terms. Assumes that terms can commute under addition. 
 * @param terms The unsorted array of terms. WARNING: This array may be reordered in future implementations.
 * @param $ 
 * @returns A new array containing the sorted factors.
 */
export function sort_terms(terms: U[], $: ExtensionEnv): U[] {
    // We don't use the index yet but it could be used to make the sort stable (see corresponding factors code).I
    const sortable = terms.map(function (value, index) {
        return { value, index };
    });
    sortable.sort(function (x, y) {
        return compare_terms_redux(x.value, y.value, $);
    });
    const sorted = sortable.map(function (elem) {
        return elem.value;
    });
    // console.lg(`sort_terms(${items_to_infix(terms, $)}) => ${items_to_infix(sorted, $)}`);
    return sorted;
}