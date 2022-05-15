
/**
 * Returns the component of the tensor obtained by drilling into it with the list of indices.
 * TODO: This is begging for a recursive function.
 * @param expr (component Mat iList), where iList is not NIL.
 */

import { ExtensionEnv } from "../env/ExtensionEnv";
import { is_integer_or_integer_float } from "../is";
import { Tensor } from "../tree/tensor/Tensor";
import { is_cons, is_nil, U } from "../tree/tree";
import { index_function } from "./index_function";

/**
 * 
 * @param M The tensor whose components we wish to access.
 * @param indices This may be a list or it may be a value or even NIL.
 */
export function get_component(M: Tensor, indices: U, $: ExtensionEnv): U {
    // console.lg(`get_component ${M} , ${indices}`);

    if (is_nil(indices)) {
        return M;
    }
    if (is_cons(indices)) {
        const stack: U[] = [M];
        // we examined the head of the list which was the tensor,
        // now look into the indexes
        let i_holder: U = indices;
        while (is_cons(i_holder)) {
            const i_tree = i_holder.car;
            const i = $.valueOf(i_tree);
            stack.push(i);
            if (!is_integer_or_integer_float(i)) {
                // TODO: Improve the message by keeping track of where we are.
                throw new Error(`index with something other than an integer`);
            }
            i_holder = i_holder.cdr;
        }

        // stack contains M at the bottom and indices above with the rightmost index at the top.
        // This seems inconvenient. You would think that the processing would be easier if the
        // order of indices allowed the first to be applied to be popped. Oh well.
        return index_function(stack, $);
    }
    return index_function([M, indices], $);
}
