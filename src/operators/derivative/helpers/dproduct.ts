import { add_terms } from "../../../calculators/add/add_terms";
import { ExtensionEnv } from "../../../env/ExtensionEnv";
import { length_of_cons_otherwise_zero } from "../../../length_of_cons_or_zero";
import { multiply_items } from "../../../multiply";
import { car, cdr, U } from "../../../tree/tree";
import { derivative } from "../derivative";

/**
 * TODO: This function allows the product to be of more than two expressions.
 * In our associated implementation we only really need a product of two expressions.
 * @param p1 
 * @param p2 
 * @param $ 
 * @returns 
 */
export function dproduct(p1: U, p2: U, $: ExtensionEnv): U {
    const n = length_of_cons_otherwise_zero(p1) - 1;
    const toAdd: U[] = [];
    for (let i = 0; i < n; i++) {
        const arr: U[] = [];
        let p3 = cdr(p1);
        for (let j = 0; j < n; j++) {
            let temp = car(p3);
            if (i === j) {
                temp = derivative(temp, p2, $);
            }
            arr.push(temp);
            p3 = cdr(p3);
        }
        toAdd.push(multiply_items(arr, $));
    }
    return add_terms(toAdd, $);
}
