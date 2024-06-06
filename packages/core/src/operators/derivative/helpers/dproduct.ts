import { multiply_items } from "@stemcmicro/helpers";
import { car, cdr, U } from "@stemcmicro/tree";
import { add_terms } from "../../../calculators/add/add_terms";
import { ExtensionEnv } from "../../../env/ExtensionEnv";
import { length_of_cons_otherwise_zero } from "../../../length_of_cons_or_zero";
import { derivative } from "../derivative";

/**
 * TODO: This function allows the product to be of more than two expressions.
 * In our associated implementation we only really need a product of two expressions.
 * @param F = (* a1 a2 a3 ...)
 * @param X
 * @param $
 * @returns
 */
export function dproduct(F: U, X: U, $: ExtensionEnv): U {
    const n = length_of_cons_otherwise_zero(F) - 1;
    const terms: U[] = [];
    for (let i = 0; i < n; i++) {
        const factors: U[] = [];
        // We'll chomp through each argument in F
        let argList = cdr(F);
        // Using this inner loop like this ensures that we don't accidentally commute the factors.
        // Of course, the sorting of factors may be inclined to move the derivative around.
        for (let j = 0; j < n; j++) {
            const a = car(argList);
            if (i === j) {
                factors.push(derivative(a, X, $));
            } else {
                factors.push(a);
            }
            argList = cdr(argList);
        }
        terms.push(multiply_items(factors, $));
    }
    return add_terms(terms, $);
}
