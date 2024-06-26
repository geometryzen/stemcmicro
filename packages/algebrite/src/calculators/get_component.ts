/**
 * Returns the component of the tensor obtained by drilling into it with the list of indices.
 * TODO: This is begging for a recursive function.
 * @param expr (component Tensot iList), where iList is not NIL.
 */

import { is_rat, is_tensor, Tensor } from "@stemcmicro/atoms";
import { cadnr, cdnr, Cons, is_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../env/ExtensionEnv";
import { is_num_and_integer } from "../is";
import { index_function } from "./index_function";

export function eval_index(expr: Cons, $: ExtensionEnv): U {
    const tensor = $.valueOf(cadnr(expr, 1));
    if (is_tensor(tensor)) {
        return get_component(tensor, cdnr(expr, 2), $);
    } else {
        return expr;
    }
}

/**
 *
 * @param M The tensor whose components we wish to access.
 * @param indices This may be a list or it may be a value or even NIL.
 */
export function get_component(M: Tensor, indices: U, $: ExtensionEnv): U {
    // console.lg(`get_component ${M} , ${indices}`);

    if (indices.isnil) {
        return M;
    }
    if (is_cons(indices)) {
        const stack: U[] = [];
        // we examined the head of the list which was the tensor,
        // now look into the indexes
        let remaining: U = indices;
        while (is_cons(remaining)) {
            const expr = remaining.car;
            const num = $.valueOf(expr);
            stack.push(num);
            if (!is_num_and_integer(num)) {
                // TODO: Improve the message by keeping track of where we are.
                throw new Error(`index with something other than an integer`);
            }
            remaining = remaining.cdr;
        }

        // stack contains M at the bottom and indices above with the rightmost index at the top.
        // This seems inconvenient. You would think that the processing would be easier if the
        // order of indices allowed the first to be applied to be popped.
        return index_function(M, stack);
    } else if (is_rat(indices)) {
        return index_function(M, [indices]);
    } else {
        throw new Error();
    }
}
